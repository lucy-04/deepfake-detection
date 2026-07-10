# evaluate.py - measure the trained model on the dataset's test split.
# Run this AFTER train.py. It prints accuracy, precision, recall and F1, plus a
# confusion matrix, and saves everything to metrics.json (used in the README / site).
#
# Self-contained on purpose so it also runs as a single Colab cell.
# "Positive" here means FAKE - i.e. precision/recall are about catching fakes.

import os
import json
import torch
import torchvision.models as models
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Subset

# ---- settings (same as train.py) ----
SEED = 42
DATA_DIR = "dataset"
MODEL_PATH = "models/deepfake_model.pth"
MAX_EVAL_IMAGES = 4000
METRICS_PATH = "metrics.json"

device = "cuda" if torch.cuda.is_available() else "cpu"

eval_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def resolve_root():
    # find the folder that contains the train/ valid/ test/ split folders
    root = DATA_DIR
    if not os.path.isdir(root):
        import kagglehub
        root = kagglehub.dataset_download("xhlulu/140k-real-and-fake-faces")
    for current, dirs, _ in os.walk(root):
        lowered = [d.lower() for d in dirs]
        if "train" in lowered and "test" in lowered:
            return current
    return root


def cap(dataset, limit):
    # optionally keep only `limit` random images so evaluation is quick
    if limit is None or limit >= len(dataset):
        return dataset
    generator = torch.Generator().manual_seed(SEED)
    idx = torch.randperm(len(dataset), generator=generator)[:limit].tolist()
    return Subset(dataset, idx)


def main():
    root = resolve_root()
    test_ds = datasets.ImageFolder(os.path.join(root, "test"), transform=eval_transform)
    classes = test_ds.classes              # e.g. ["fake", "real"]
    test_loader = DataLoader(cap(test_ds, MAX_EVAL_IMAGES), batch_size=32)

    model = models.resnet18()
    model.fc = torch.nn.Linear(model.fc.in_features, 2)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model = model.to(device)
    model.eval()

    # collect predictions vs the true labels for the test images
    y_true, y_pred = [], []
    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            preds = model(images).argmax(dim=1).cpu()
            y_pred.extend(preds.tolist())
            y_true.extend(labels.tolist())

    # fake = class 0, real = class 1 (ImageFolder sorts names alphabetically)
    fake = classes.index("fake") if "fake" in classes else 0
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == fake and p == fake)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t != fake and p == fake)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == fake and p != fake)
    tn = sum(1 for t, p in zip(y_true, y_pred) if t != fake and p != fake)

    accuracy = (tp + tn) / len(y_true) if y_true else 0.0
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0

    metrics = {
        "test_images": len(y_true),
        "accuracy": round(accuracy * 100, 1),
        "precision": round(precision * 100, 1),
        "recall": round(recall * 100, 1),
        "f1": round(f1 * 100, 1),
        "confusion_matrix": {
            "true_fake_pred_fake": tp,
            "true_fake_pred_real": fn,
            "true_real_pred_fake": fp,
            "true_real_pred_real": tn,
        },
    }

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print("Test images:", metrics["test_images"])
    print(f"Accuracy:  {metrics['accuracy']}%")
    print(f"Precision: {metrics['precision']}%  (of images flagged fake, how many really were)")
    print(f"Recall:    {metrics['recall']}%  (of real fakes, how many we caught)")
    print(f"F1:        {metrics['f1']}%")
    print("Confusion matrix:", metrics["confusion_matrix"])
    print("Saved to", METRICS_PATH)


if __name__ == "__main__":
    main()

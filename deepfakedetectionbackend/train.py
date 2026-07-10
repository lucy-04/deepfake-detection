# train.py - fine-tune ResNet18 to tell real vs fake faces apart.
# This is the pipeline I used to train the model, cleaned up from my Colab notebook.
# Run order:  python train.py   then   python evaluate.py
#
# Dataset: xhlulu/140k-real-and-fake-faces. It already comes split into
# train/ valid/ test/ folders, each holding a real/ and a fake/ folder.

import os
import torch
import torchvision.models as models
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Subset

# ---- settings ----
SEED = 42                       # fixed so any subsampling is repeatable
DATA_DIR = "dataset"            # local folder with train/ valid/ test/ (else we download)
EPOCHS = 5
BATCH_SIZE = 32
LR = 0.0001
MODEL_PATH = "models/deepfake_model.pth"
MAX_TRAIN_IMAGES = 20000        # cap training set for faster Colab runs (None = use all 100k)
MAX_EVAL_IMAGES = 4000          # cap val/test for speed (None = use all)

device = "cuda" if torch.cuda.is_available() else "cpu"

# training images get light augmentation so the model generalises a bit better.
# val/test images are NOT augmented - we want to score them as they really are.
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

eval_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def download_dataset():
    # only used on Colab - grabs the Kaggle dataset and returns its path
    import kagglehub
    path = kagglehub.dataset_download("xhlulu/140k-real-and-fake-faces")
    print("Downloaded dataset to:", path)
    return path


def resolve_root():
    # find the folder that actually contains the train/ valid/ test/ split folders.
    root = DATA_DIR if os.path.isdir(DATA_DIR) else download_dataset()
    for current, dirs, _ in os.walk(root):
        lowered = [d.lower() for d in dirs]
        if "train" in lowered and "test" in lowered:
            return current
    return root


def valid_dir_name(root):
    # this dataset names it "valid", but some use "val" - handle both
    return "valid" if os.path.isdir(os.path.join(root, "valid")) else "val"


def cap(dataset, limit):
    # optionally keep only `limit` random images, so Colab runs don't take forever
    if limit is None or limit >= len(dataset):
        return dataset
    generator = torch.Generator().manual_seed(SEED)
    idx = torch.randperm(len(dataset), generator=generator)[:limit].tolist()
    return Subset(dataset, idx)


def main():
    root = resolve_root()
    train_ds = datasets.ImageFolder(os.path.join(root, "train"), transform=train_transform)
    val_ds = datasets.ImageFolder(os.path.join(root, valid_dir_name(root)), transform=eval_transform)
    print("Classes:", train_ds.classes, "| train images:", len(train_ds))

    train_loader = DataLoader(cap(train_ds, MAX_TRAIN_IMAGES), batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(cap(val_ds, MAX_EVAL_IMAGES), batch_size=BATCH_SIZE)

    # start from ImageNet weights and only swap the final layer for 2 classes
    model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
    model.fc = torch.nn.Linear(model.fc.in_features, 2)
    model = model.to(device)

    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LR)

    for epoch in range(EPOCHS):
        model.train()
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

        val_acc = accuracy(model, val_loader)
        print(f"Epoch {epoch} done - val accuracy: {val_acc:.3f}")

    os.makedirs("models", exist_ok=True)
    torch.save(model.state_dict(), MODEL_PATH)
    print("Model saved to", MODEL_PATH)


def accuracy(model, loader):
    # quick helper: fraction of images the model gets right
    model.eval()
    correct, total = 0, 0
    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            preds = model(images).argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    return correct / total if total else 0.0


if __name__ == "__main__":
    main()

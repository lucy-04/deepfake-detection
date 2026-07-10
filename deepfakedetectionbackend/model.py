import os
import torch
import torchvision.models as models
import torchvision.transforms as transforms

# look for the weights next to this file, so it works no matter where we run from
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "deepfake_model.pth")

class DeepfakeDetector:

    def __init__(self):

        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model weights not found at {MODEL_PATH}")

        self.model = models.resnet18()

        self.model.fc = torch.nn.Linear(self.model.fc.in_features,2)

        self.model.load_state_dict(torch.load(MODEL_PATH,map_location=self.device))

        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((224,224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485,0.456,0.406],
                std=[0.229,0.224,0.225]
            )
        ])

    def predict(self,image):

        image = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(image)

        probs = torch.softmax(outputs,dim=1)

        conf,pred = torch.max(probs,1)

        label = "FAKE" if pred.item()==0 else "REAL"

        return label,conf.item()
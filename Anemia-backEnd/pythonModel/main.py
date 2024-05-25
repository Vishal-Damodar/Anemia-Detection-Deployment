# from flask import Flask, render_template, request, redirect, url_for, session
import re
import  json
import sys
import os
# from flask import Flask, flash, request, redirect, url_for, render_template
# from werkzeug.utils import secure_filename
# import matplotlib.pyplot as plt
# import numpy as np
import cv2
# import matplotlib.pyplot as plt
# import numpy as np
import os
# import PIL
# import tensorflow as tf
# from csv import writer
# import pandas as pd
# from flask_material import Material
import cv2
import math
import cvzone
# import torch
# import torchvision
# from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
# from torchvision.transforms import functional as F
# from PIL import Image
# import numpy as np
# import matplotlib.pyplot as plt
# from tensorflow import keras
# from tensorflow.keras import layers
# from tensorflow.keras.models import Sequential
# from tensorflow import keras
import os
# from tensorflow.keras.models import Sequential
# import numpy as np
from ultralytics import YOLO
import cv2
# from flask import send_from_directory
import math


def video_detection(img_path):
    img = cv2.imread(img_path)

    model = YOLO("pythonModel\\best.pt")
  
    classNames = ['Anemic Nail', 'Anemic Tongue', 'Non-Anemic Nail', 'Non-Anemic Tongue']

    results = model(img, stream=False, conf=0.05)
    
    detections = []
    for r in results:
        boxes = r.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            w, h = x2 - x1, y2 - y1
            conf = math.ceil((box.conf[0] * 100)) / 100
            cls = int(box.cls[0])
            class_name = classNames[cls]
            detections.append({'class_name': class_name, 'confidence': conf})
            cvzone.cornerRect(img, (x1, y1, w, h))
            cvzone.putTextRect(img, f'{class_name} {conf}', (max(0, x1), max(35, y1)), scale=0.7, thickness=1)

    return img, detections


def main():
    
    img_path = sys.argv[1]
    img, detections = video_detection(img_path)
    
    # Save the resulting image
    output_path = os.path.splitext(img_path)[0] + "_detected.jpg"
    cv2.imwrite(output_path, img)

    # print(output_path)
    # print(detections)
    # Print detections as JSON
    print(json.dumps({
        'output_image_path': output_path,
        'detections': detections
    }))

if __name__ =='__main__':
	main()

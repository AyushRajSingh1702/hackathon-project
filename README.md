Haan bhai 😄 PDF nahi chahiye, written text hi de raha hoon. Isko direct README.md me paste kar dena.

🌙 LunaEnhance AI

AI-powered Lunar Image Enhancement Platform

📌 Problem Statement

Lunar images often suffer from low resolution, noise, blur and limited visible details. Because of this, observing and visually analysing the lunar surface can become difficult.

Normal image resizing only increases the image size. It does not intelligently reconstruct fine details.

💡 Our Solution

LunaEnhance AI is a web-based AI image enhancement platform designed for lunar images.

It combines:

🤖 Real-ESRGAN x4 for AI-based super-resolution
🧹 OpenCV denoising for cleaner images
🌗 CLAHE for better contrast
✨ Image sharpening for clearer edges
⚡ NVIDIA CUDA GPU acceleration
🧩 Tile processing to handle limited GPU memory
🌐 Simple and user-friendly web interface

The AI reconstructs plausible fine details based on learned patterns. It does not claim to recover exact original information that was never captured.

🏗️ System Architecture
User
  ↓
HTML / CSS / JavaScript
  ↓
Python Flask Backend
  ↓
Real-ESRGAN x4
  ↓
OpenCV Post-Processing
  ↓
Enhanced Lunar Image
  ↓
Download
🛠️ Technology Stack
Frontend
HTML5
CSS3
JavaScript
Backend
Python
Flask
Flask-CORS
OpenCV
AI
PyTorch
Real-ESRGAN
RRDBNet
Hardware Acceleration
NVIDIA CUDA
NVIDIA GeForce RTX 3050 Laptop GPU
✨ Key Features
Upload lunar images
AI-powered 4× super-resolution
Noise reduction
Contrast enhancement
Sharpening
GPU-accelerated processing
Tile-based processing
Original vs enhanced image preview
Fullscreen image viewer
Download enhanced image
Browse workflow for finding lunar images online
📁 Project Structure
HACKATHON/
│
├── backend/
│   ├── app.py
│   └── weights/
│       └── RealESRGAN_x4plus.pth
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── uploads/
├── outputs/
├── .gitignore
└── README.md

uploads/ and outputs/ are ignored by Git because they contain runtime/user-generated files.

⚡ GPU Acceleration

LunaEnhance AI automatically checks whether CUDA is available.

When an NVIDIA GPU is available:

CUDA Available: True
Device: cuda
GPU: NVIDIA GeForce RTX 3050 A Laptop GPU

The Real-ESRGAN model uses GPU acceleration and FP16 inference for faster processing.

Tile processing is used to help process large images within limited GPU memory.

🌐 Browse Workflow

The Browse Lunar Images option allows users to search for lunar images online.

Because of browser security restrictions such as CORS, an arbitrary Google Images result cannot always be directly sent to the local backend.

The practical workflow is:

Browse
   ↓
Find Lunar Image
   ↓
Save / Select Image
   ↓
Upload
   ↓
Enhance
▶️ How to Run
Start Backend

Open the project in VS Code and run:

cd backend
python app.py

Backend:

http://127.0.0.1:5000
Start Frontend

Open:

frontend/index.html

using VS Code Live Server.

The frontend normally runs on:

http://127.0.0.1:5500

Then upload a lunar image and click Enhance Image.

🔬 Future Scope
🌙 Mission-wise lunar image database
🚀 Chandrayaan image integration
🔭 NASA and ESA image integration
📍 Lunar coordinates and scientific metadata
📊 Image quality metrics
🧠 Specialized lunar-trained enhancement model
☁️ Cloud deployment
🔌 API/repository integration
🔍 Automated lunar image classification
🎯 Innovation

LunaEnhance AI is not simply an image enlarger.

It combines:

AI Super-Resolution + Image Processing + GPU Acceleration

into a simple web application specifically focused on lunar imagery.

🏆 Hackathon Project

LunaEnhance AI

An AI-assisted platform for enhancing lunar images and making their visual details easier to observe and analyse. 🌙🚀


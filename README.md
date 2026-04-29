<div align="center">

# 🎁 GiftHaven

**An AI-First E-Commerce Platform & Smart Recommendation Engine**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-AI_Backend-009688.svg?logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED.svg?logo=docker)
![AWS](https://img.shields.io/badge/AWS-EC2_Deployed-FF9900.svg?logo=amazonaws)

</div>

---

## 📑 Table of Contents
* [About the Project](#-about-the-project)
* [Core Features](#-core-features)
* [Technology Stack](#-technology-stack)
* [Local Development Setup](#-local-development-setup)
* [Architecture and Deployment](#-architecture-and-deployment)
* [Live Access](#-live-access)

---

## 📖 About the Project

This repository contains the application codebase for **GiftHaven**. It is an advanced e-commerce platform built to provide smart product recommendations, a seamless shopping experience, and robust user management. The platform utilizes a modern containerized architecture, blending a high-performance React frontend with a dual-backend system for e-commerce logic and AI functionalities.

---

## 🚀 Core Features

* **🛒 E-Commerce User Flow**
  Includes dedicated pages for browsing products, viewing categories, managing a shopping cart, and a complete checkout process.

* **🤖 AI Chat Integration & Recommendations**
  A global chat widget integrated into the routing structure to provide users with AI-driven assistance, powered by FastAPI and TensorFlow.

* **👓 WebAR Product Previews**
  Integrated Augmented Reality capabilities allowing users to visualize products in their physical space before purchasing.

* **📦 Order Management**
  Authenticated routes for users to track and view their historical orders securely.

* **🔒 Authentication**
  Secure user login and registration powered by Supabase and managed globally via React Context.

* **📱 Responsive Design**
  Fully accessible and responsive UI components built with Radix UI and styled using Tailwind CSS.

---

## 🛠️ Technology Stack

### 💻 Frontend
* **Framework:** React 18 with Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS and Tailwind-Merge
* **UI Components:** Shadcn UI (built on Radix UI primitives)
* **Client-Side Routing:** React Router DOM v6
* **State & Data Fetching:** TanStack React Query and native React Context API
* **Form Validation:** React Hook Form combined with Zod schema validation

### ⚙️ Backend & Infrastructure
* **Databases & Auth:** Supabase JS Client
* **AI Services:** FastAPI and TensorFlow
* **Infrastructure:** AWS EC2 (Ubuntu Linux)
* **Containerization:** Docker and Docker Compose
* **Web Server / Proxy:** Nginx

---

## 💻 Local Development Setup

Follow these instructions to set up the frontend project locally for development.

* **Clone the repository**
  ```bash
  git clone [https://github.com/Nitin962dev/giftastic-wishlist-wonder.git](https://github.com/Nitin962dev/giftastic-wishlist-wonder.git)
  ```

* **Navigate to the project directory**
  ```bash
  cd giftastic-wishlist-wonder
  ```

* **Install dependencies**
  ```bash
  npm install
  ```

* **Start the local development server**
  ```bash
  npm run dev
  ```

* **Run tests**
  ```bash
  npm run test
  ```

---

## 🚢 Architecture and Deployment

The GiftHaven platform uses a modern containerized architecture. The entire stack (Frontend, API services, and dependencies) is orchestrated using Docker Compose. The application is hosted on an AWS EC2 instance, utilizing Nginx as a reverse proxy to serve the React application and route API requests securely.

### 🌍 Live Access

The application is deployed and publicly accessible via a static AWS Elastic IP address. This ensures a persistent, reliable entry point for users to reach the platform anytime, anywhere. 

* **Live Deployment URL:**
  [http://52.204.222.90](http://52.204.222.90)
  

### 🤖 Automated EC2 Deployment (User Data)

The deployment process is fully automated. When provisioning a new AWS EC2 instance, pass the following bash script into the **User Data** field. 

This script will automatically update the system, install the required base packages, and execute the master deployment script from the GitHub repository, which handles installing Docker, cloning the project, and starting the Docker Compose cluster on boot.

```bash
#!/bin/bash
set -e

echo "Updating system..."
apt update -y
apt install -y curl git

echo "Running deployment script from GitHub..."
bash <(curl -s [https://raw.githubusercontent.com/Nitin962dev/giftastic-wishlist-wonder/main/Automatic-deploy-gift-ai-linux.sh](https://raw.githubusercontent.com/Nitin962dev/giftastic-wishlist-wonder/main/Automatic-deploy-gift-ai-linux.sh))
```

### 🔧 Manual Deployment Steps

If you are accessing an existing server and need to trigger the deployment process manually without the User Data hook, follow these steps:

* **Update system packages**
  ```bash
  apt update -y
  ```

* **Install curl and git**
  ```bash
  apt install -y curl git
  ```

* **Execute the automated deployment script**
  ```bash
  bash <(curl -s [https://raw.githubusercontent.com/Nitin962dev/giftastic-wishlist-wonder/main/Automatic-deploy-gift-ai-linux.sh](https://raw.githubusercontent.com/Nitin962dev/giftastic-wishlist-wonder/main/Automatic-deploy-gift-ai-linux.sh))
  ```

* **View running containers**
  ```bash
  docker compose ps
  ```

* **View live application logs**
  ```bash
  docker compose logs -f
  ```

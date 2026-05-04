# 🎁 GiftHaven Infrastructure & Deployment

**Containerized Deployment Architecture for an E-Commerce Platform**

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white) ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white) ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## 📌 Project Scope & Acknowledgments

This repository contains the Kubernetes manifests, container configurations, and deployment scripts for the GiftHaven e-commerce platform. It provides a robust setup for deploying the application in a scalable and observable cloud-native environment.


* **Application Code:** The core React and FastAPI application was developed by [Nitin962dev](https://github.com/Nitin962dev).
* **My Contribution:** I designed and implemented the complete DevOps lifecycle for this application. All Docker/Docker Compose configurations, Kubernetes manifests (Namespaces, Deployments, Services, HPA), Helm-based monitoring (Prometheus & Grafana), and AWS EC2 automation were authored by me to demonstrate modern infrastructure practices.

## ✨ Features

-   **Kubernetes Manifests:** Pre-configured `Deployment`, `Service`, `Namespace`, and `HorizontalPodAutoscaler` for easy deployment.
-   **Automatic Scaling:** A Horizontal Pod Autoscaler (HPA) automatically scales application pods based on CPU load to handle traffic spikes efficiently.
-   **Containerized Frontend:** A multi-stage `Dockerfile` builds the React application and serves it via Nginx for a lightweight and performant deployment.
-   **AI-Powered Backend:** Leverages Supabase Edge Functions for advanced features like AI gift chat, product comparisons, and automated kit building.
-   **Automated Single-Server Deployment:** Includes bootstrap scripts for a simplified setup on a single Linux server using Docker Compose.

<img width="2637" height="672" alt="Screenshot from 2026-05-04 21-30-49" src="https://github.com/user-attachments/assets/f5efd941-05d7-403f-9ef0-048b80b3871c" />


## 🏛️ Architecture

The application is designed with a decoupled frontend and backend, orchestrated by Kubernetes.

-   **Frontend:** The React single-page application is containerized with Nginx and runs as a Kubernetes `Deployment`.
-   **Backend & Database:** [Supabase](https://supabase.com/) provides the PostgreSQL database, user authentication, and serverless Edge Functions that power the application's dynamic and AI-driven features.
-   **Kubernetes Cluster Flow:**
    1.  User traffic hits a Kubernetes `Service` (e.g., NodePort or LoadBalancer).
    2.  The `Service` routes traffic to one of the running frontend `Pods`.
    3.  The Kubernetes Metrics Server monitors pod CPU usage.
    4.  The `HorizontalPodAutoscaler` adjusts the number of `Deployment` replicas between 1 and 5 based on a 60% CPU utilization target.

## 🛠️ Tech Stack

| Component      | Technology                                    |
| -------------- | --------------------------------------------- |
| **Orchestration**  | Kubernetes                                  |
| **Containerization** | Docker                                      |
| **Web Server**     | Nginx                                       |
| **Frontend**       | React, Vite, TypeScript, Tailwind CSS, Shadcn UI |
| **Backend**        | Supabase (Edge Functions, PostgreSQL, Auth) |
| **Deployment**     | `kubectl`, Shell Script, Docker Compose      |

## 🚀 Deployment Guide

There are two primary methods for deploying GiftHaven: using Kubernetes for a scalable environment or using Docker Compose for a simple, single-server setup.

### Kubernetes Deployment (Recommended)

This method is ideal for production environments that require scalability and resilience.

#### Prerequisites

-   A running Kubernetes cluster (e.g., Minikube, kind, EKS, GKE).
-   `kubectl` command-line tool configured to connect to your cluster.
-   [Kubernetes Metrics Server](https://github.com/kubernetes-sigs/metrics-server) installed in your cluster (for HPA).

#### 1. Install Metrics Server

The HPA relies on metrics collected by the Metrics Server. If it's not already installed, apply the official manifest:
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

#### 2. Deploy GiftHaven

Clone this repository and apply all manifests from the `k8s` directory. This single command will create the namespace, deployment, service, and HPA.

```bash
git clone https://github.com/parth2496singh/gifthaven-k8s.git
cd gifthaven-k8s
kubectl apply -f k8s/
```
The application uses the public Docker image `parthsingh2496/giftastic-wishlist-wonder-gift-ai:latest`.

#### 3. Access the Application

To access the deployed application, forward a local port to the service:

```bash
kubectl port-forward svc/gift-ai-service -n gift-ai 5173:5173
```
You can now access GiftHaven at **[http://localhost:5173](http://localhost:5173)**.

### EC2 / Docker Compose Deployment

This method is suitable for development, testing, or small-scale deployments on a single virtual machine.

#### Prerequisites
- An Ubuntu-based Linux server (e.g., AWS EC2).
- Root or `sudo` privileges.

#### Instructions

Execute the `ec2-bootstrap.sh` script. It will automatically install Docker, clone the repository, and deploy the application using Docker Compose.

```bash
curl -sL https://raw.githubusercontent.com/parth2496singh/gifthaven-k8s/main/ec2-bootstrap.sh | sudo bash
```
The application will be available on port 80 of the server's public IP address.

## 📊 Monitoring & Autoscaling

#### Check HPA Status

You can monitor the Horizontal Pod Autoscaler to see the current and desired number of replicas.

```bash
# Watch the HPA status update every 5 seconds
kubectl get hpa -n gift-ai -w
```
This will show the target CPU utilization (60%) and the pod count adjusting in response to load.

#### Observability with Prometheus & Grafana

Deploy a complete monitoring stack using the `kube-prometheus-stack` Helm chart.

**Prerequisites:**
- Helm package manager

**1. Add Helm Repository:**
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```

**2. Install `kube-prometheus-stack`:**
```bash
helm install prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

**3. Access Dashboards:**

- **Prometheus:**
    ```bash
    kubectl port-forward svc/prometheus-stack-kube-prom-prometheus -n monitoring 9090:9090
    ```
    Access at `http://localhost:9090`.

- **Grafana:**
    ```bash
    # Get the admin password
    kubectl get secret prometheus-stack-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode ; echo

    # Port forward the service
    kubectl port-forward svc/prometheus-stack-grafana -n monitoring 3000:80
    ```
    Access at `http://localhost:3000`. Login with username `admin` and the password retrieved above.

<img width="2842" height="1394" alt="Screenshot from 2026-05-04 20-23-09" src="https://github.com/user-attachments/assets/f1f0f5ee-3270-4c58-8c67-f56b97fdac93" />


<img width="2842" height="1298" alt="Screenshot from 2026-05-04 19-54-32" src="https://github.com/user-attachments/assets/9bc36b61-533a-48e9-a0f4-d1e3faaac3e6" />

  ## 🛣️ Future Roadmap
- [ ] Add an NGINX Ingress Controller for domain-based routing.
- [ ] Implement a CI/CD pipeline using GitHub Actions to automate image builds.
- [ ] Configure TLS/HTTPS termination using `cert-manager`.

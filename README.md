# 🎁 GiftHaven

**Cloud-Native Containerized E-Commerce Platform** *Complete with Observability, Autoscaling, & Automated Deployment*

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white) ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white) ![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)

---

## Overview

This repository contains the infrastructure configurations and deployment manifests for GiftHaven. It sets up the underlying cluster workloads, internal networking, load-based scaling, and node bootstrapping.

**Capabilities:**
* Kubernetes workload management and service abstraction.
* Horizontal Pod Autoscaling (HPA) via Metrics Server.
* Helm-managed Prometheus and Grafana monitoring stack.
* Automated AWS EC2 instance bootstrapping.

---

## Architecture Flow

1. **User Request** -> Hits Kubernetes NodePort Service.
2. **Traffic Routing** -> Forwarded to React/FastAPI Deployment Pods.
3. **Autoscaling** -> Metrics Server tracks CPU; HPA scales pods up/down.
4. **Observability** -> Prometheus scrapes Pod metrics; Grafana visualizes data.

---

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18 (Vite), TypeScript, Tailwind CSS, Shadcn UI, React Query |
| **Backend & AI** | FastAPI, TensorFlow, Supabase JS Client |
| **Infrastructure** | Kubernetes, AWS EC2 (Ubuntu), Nginx, Docker / Compose |
| **Monitoring** | Prometheus, Grafana, Kubernetes Metrics Server |

---

## Deployment Guide

### 1. Workloads
Apply the base deployment manifests, services, and HPA configs.

    kubectl apply -f k8s/

### 2. Metrics Server
Required for HPA functionality.

    kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

### 3. Observability Stack
Install the kube-prometheus-stack via Helm. Ensure Helm 3+ is installed.

    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo add grafana https://grafana.github.io/helm-charts
    helm repo update

    helm install prometheus-stack prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

---

## Monitoring & Operations

### Autoscaling
Verify HPA status and target thresholds:

    kubectl get hpa

### Dashboard Access
Port-forward the monitoring services to access them locally.

**Prometheus (Local port 9090):**

    kubectl port-forward svc/prometheus-stack-kube-prom-prometheus -n monitoring 9090:9090

**Grafana (Local port 3000):**

    kubectl port-forward svc/prometheus-stack-grafana -n monitoring 3000:80

*(Default Grafana credentials: admin / prom-operator)*

---

## AWS EC2 Bootstrapping

Instance provisioning is handled via an EC2 User Data script. Pass this script into the User Data field during EC2 launch, or run it manually on a fresh Ubuntu instance:

    #!/bin/bash
    set -e

    apt update -y
    apt install -y curl git

    bash <(curl -s https://raw.githubusercontent.com/Nitin962dev/giftastic-wishlist-wonder/main/Automatic-deploy-gift-ai-linux.sh)

---

## Roadmap

* [ ] Implement NGINX Ingress for domain routing.
* [ ] Configure CI/CD pipeline via GitHub Actions.
* [ ] Integrate Loki for centralized log aggregation.
* [ ] Package application manifests into a custom Helm chart.
* [ ] Enable TLS/HTTPS termination via cert-manager.

#!/bin/bash
set -e
export DEBIAN_FRONTEND=noninteractive

install_docker(){

    if command -v docker >/dev/null 2>&1; then
        echo "Docker is already installed. Skipping installation."
        docker --version
        return
    fi

    echo "Docker not found. Installing Docker..."


    echo "Removing old Docker versions (if any)..."
    sudo apt remove -y docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc || true
    sudo apt autoremove -y || true

    echo "Updating system..."
    sudo apt update
    sudo apt install -y ca-certificates curl gnupg git

    echo "Creating keyring..."
    sudo install -m 0755 -d /etc/apt/keyrings

    sudo rm -f /etc/apt/keyrings/docker.gpg

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
        sudo gpg --batch --yes --dearmor -o /etc/apt/keyrings/docker.gpg

    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo "Adding Docker repository..."
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
$(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    echo "Installing Docker..."
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo "Enabling Docker..."
    sudo systemctl enable docker
    sudo systemctl start docker

    echo "Adding user to docker group..."
    sudo usermod -aG docker $(whoami)
    newgrp docker
}

deploy_project(){

    if [ -d "giftastic-wishlist-wonder" ]; then
        echo "Repo exists → pulling latest changes"
        cd giftastic-wishlist-wonder
        git pull
    else
        git clone https://github.com/Nitin962dev/giftastic-wishlist-wonder.git
        cd giftastic-wishlist-wonder
    fi

    echo "Starting Deployment..."
    docker compose up -d --build
    echo "Deployment completed"

}

install_docker
deploy_project
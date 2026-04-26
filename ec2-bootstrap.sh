#!/bin/bash
set -e

echo "Updating system..."
apt update -y
apt install -y curl git

echo "Running deployment script from GitHub..."

bash <(curl -s https://raw.githubusercontent.com/Nitin962dev/giftastic-wishlist-wonder/main/Automatic-deploy-gift-ai-linux.sh)
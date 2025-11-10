#!/bin/bash
# Script to generate initial folder and module structure for digi-order

echo "🚀 Generating NestJS modules and folders..."

# Gateway module (entry point)
nest g module gateway
nest g controller gateway
nest g service gateway

# Business modules
MODULES=("menu" "order" "table" "kitchen" "notification")

mkdir -p src/modules

for module in "${MODULES[@]}"
do
  echo "🧩 Creating module: $module"
  nest g module modules/$module
  nest g service modules/$module
  nest g controller modules/$module
done

echo "✅ All modules created successfully!"

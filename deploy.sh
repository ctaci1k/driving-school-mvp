#!/bin/bash
# deploy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Production Deployment${NC}"

# Check required files
echo -e "${YELLOW}Checking required files...${NC}"
required_files=(".env.production" "docker-compose.prod.yml" "Dockerfile")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        exit 1
    fi
done

# Load environment variables
echo -e "${YELLOW}Loading environment variables...${NC}"
export $(cat .env.production | grep -v '^#' | xargs)

# Build the application
echo -e "${GREEN}📦 Building Next.js application...${NC}"
npm run build

# Optimize Next.js output for Docker
echo -e "${YELLOW}Optimizing build output...${NC}"
npm run build:standalone

# Build Docker images
echo -e "${GREEN}🐳 Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down

# Start new containers
echo -e "${GREEN}🚀 Starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Run database migrations
echo -e "${GREEN}📊 Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy

# Seed database (optional, only for first deployment)
if [ "$1" == "--seed" ]; then
    echo -e "${YELLOW}Seeding database...${NC}"
    docker-compose -f docker-compose.prod.yml exec -T app npx prisma db seed
fi

# Health check
echo -e "${YELLOW}Performing health check...${NC}"
health_check() {
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)
    if [ "$response" == "200" ]; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        return 0
    else
        echo -e "${RED}❌ Health check failed (HTTP $response)${NC}"
        return 1
    fi
}

# Retry health check
max_retries=5
retry_count=0
while [ $retry_count -lt $max_retries ]; do
    if health_check; then
        break
    fi
    retry_count=$((retry_count + 1))
    echo -e "${YELLOW}Retrying health check ($retry_count/$max_retries)...${NC}"
    sleep 5
done

# Show container status
echo -e "${GREEN}📊 Container Status:${NC}"
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo -e "${GREEN}📝 Recent logs:${NC}"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${YELLOW}Access your application at: https://yourdomain.com${NC}"
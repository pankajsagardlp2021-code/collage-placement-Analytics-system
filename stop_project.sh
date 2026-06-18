#!/bin/bash

# ==============================================================================
# College Placement Analytics System - Shutdown Automation Script
# ==============================================================================

# ANSI Color codes for beautiful console logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}🛑 Stopping College Placement Analytics System...${NC}"
echo -e "${BLUE}======================================================================${NC}"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Helper function to stop a service running on a specific port
stop_port_service() {
    local port=$1
    local name=$2
    local pids=$(lsof -t -i:$port -sTCP:LISTEN)
    
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}🔄 Stopping $name (PIDs: $pids)...${NC}"
        kill $pids 2>/dev/null
        sleep 1
        
        # Double check if still running and force kill if necessary
        pids_check=$(lsof -t -i:$port -sTCP:LISTEN)
        if [ -n "$pids_check" ]; then
            echo -e "${RED}⚠️ $name did not stop gracefully. Forcing shutdown...${NC}"
            kill -9 $pids_check 2>/dev/null
        fi
        echo -e "${GREEN}✅ $name stopped successfully.${NC}"
    else
        echo -e "${GREEN}ℹ️ $name is not running on port $port.${NC}"
    fi
}

# 1. Stop Frontend Server on port 8000
echo -e "\n${YELLOW}[1/3] Stopping Frontend Server...${NC}"
stop_port_service 8000 "Frontend server"

# 2. Stop Flask Backend on port 5001
echo -e "\n${YELLOW}[2/3] Stopping Flask Backend...${NC}"
stop_port_service 5001 "Flask backend"

# 3. Stop SQL Server Docker Container
echo -e "\n${YELLOW}[3/3] Stopping SQL Server Docker container...${NC}"
CONTAINER_RUNNING=$(docker inspect -f '{{.State.Running}}' SQL_Server_Docker 2>/dev/null)

if [ "$CONTAINER_RUNNING" = "true" ]; then
    echo -e "${YELLOW}🔄 Stopping SQL Server Docker container ('SQL_Server_Docker')...${NC}"
    docker stop SQL_Server_Docker
    echo -e "${GREEN}✅ SQL Server Docker container stopped successfully.${NC}"
else
    echo -e "${GREEN}ℹ️ SQL Server Docker container is not running.${NC}"
fi

echo -e "\n${BLUE}======================================================================${NC}"
echo -e "${GREEN}🎉 All College Placement Analytics System services stopped successfully!${NC}"
echo -e "${BLUE}======================================================================${NC}"

#!/bin/bash

# ==============================================================================
# College Placement Analytics System - Startup Automation Script
# ==============================================================================

# ANSI Color codes for beautiful console logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}🚀 Starting College Placement Analytics System...${NC}"
echo -e "${BLUE}======================================================================${NC}"

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ------------------------------------------------------------------------------
# 1. Verify Docker Daemon is Running
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[1/4] Checking Docker daemon status...${NC}"
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker daemon is not running!${NC}"
    echo -e "${YELLOW}👉 Please start Docker Desktop and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker daemon is running.${NC}"

# ------------------------------------------------------------------------------
# 2. Check and Start SQL Server Docker Container
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[2/4] Checking SQL Server container ('SQL_Server_Docker')...${NC}"
CONTAINER_EXISTS=$(docker ps -a --filter "name=^/SQL_Server_Docker$" --format '{{.Names}}')

if [ -z "$CONTAINER_EXISTS" ]; then
    echo -e "${RED}❌ Error: Docker container 'SQL_Server_Docker' was not found.${NC}"
    echo -e "${YELLOW}👉 Please make sure you have created the container with name 'SQL_Server_Docker'.${NC}"
    exit 1
fi

CONTAINER_RUNNING=$(docker inspect -f '{{.State.Running}}' SQL_Server_Docker 2>/dev/null)

if [ "$CONTAINER_RUNNING" = "true" ]; then
    echo -e "${GREEN}✅ SQL Server container is already running.${NC}"
else
    echo -e "${YELLOW}🔄 SQL Server container is stopped. Starting it now...${NC}"
    docker start SQL_Server_Docker
    echo -e "${YELLOW}⏳ Waiting 6 seconds for SQL Server to boot and accept connections...${NC}"
    sleep 6
    echo -e "${GREEN}✅ SQL Server container started successfully.${NC}"
fi

# ------------------------------------------------------------------------------
# 3. Detect Python Interpreter with Required Dependencies
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[3/4] Detecting Python environment...${NC}"

# Helper to check if a python executable is valid and has dependencies
is_valid_python() {
    local cmd=$1
    if command -v "$cmd" &>/dev/null; then
        if "$cmd" -c "import flask, flask_cors, pyodbc" &>/dev/null; then
            return 0
        fi
    fi
    return 1
}

PYTHON_CMD=""
if is_valid_python "python3"; then
    PYTHON_CMD="python3"
elif is_valid_python "/usr/local/bin/python3"; then
    PYTHON_CMD="/usr/local/bin/python3"
elif is_valid_python "python"; then
    PYTHON_CMD="python"
else
    # Fallback to python3 or python but warn user
    if command -v python3 &>/dev/null; then
        PYTHON_CMD="python3"
    elif command -v python &>/dev/null; then
        PYTHON_CMD="python"
    else
        echo -e "${RED}❌ Error: No python interpreter found. Please install Python 3.${NC}"
        exit 1
    fi
    echo -e "${YELLOW}⚠️ Warning: Required packages (flask, flask_cors, pyodbc) not found in $PYTHON_CMD.${NC}"
    echo -e "${YELLOW}👉 Please install them using: pip install flask flask-cors pyodbc${NC}"
fi

echo -e "${GREEN}✅ Using Python interpreter: $PYTHON_CMD${NC}"

# ------------------------------------------------------------------------------
# 4. Check and Start Flask Backend Server (Port 5001)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[4/4] Checking Flask backend on port 5001...${NC}"
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Flask backend is already running on port 5001.${NC}"
else
    echo -e "${YELLOW}🚀 Starting Flask backend...${NC}"
    
    # Run backend and redirect outputs to backend.log
    $PYTHON_CMD backend/app.py > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Give it a couple of seconds to bind to the port
    sleep 2
    
    if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✅ Flask backend started successfully (PID: $BACKEND_PID).${NC}"
    else
        echo -e "${RED}❌ Error: Failed to start Flask backend.${NC}"
        echo -e "${YELLOW}👉 Please check backend.log for error details:${NC}"
        if [ -f backend.log ]; then
            tail -n 15 backend.log
        fi
        exit 1
    fi
fi

# ------------------------------------------------------------------------------
# 5. Check and Start Frontend HTTP Server (Port 8000)
# ------------------------------------------------------------------------------
echo -e "\n${YELLOW}[5/5] Checking Frontend server on port 8000...${NC}"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Frontend server is already running on port 8000.${NC}"
else
    echo -e "${YELLOW}🚀 Starting Frontend static server...${NC}"
    # Run python http.server inside frontend/ directory
    (cd frontend && $PYTHON_CMD -m http.server 8000 --bind 127.0.0.1 > ../frontend.log 2>&1 &)
    FRONTEND_PID=$!
    
    # Give it a second to bind
    sleep 1.5
    
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✅ Frontend server started successfully (PID: $FRONTEND_PID).${NC}"
    else
        echo -e "${RED}❌ Error: Failed to start Frontend server.${NC}"
        echo -e "${YELLOW}👉 Please check frontend.log for error details.${NC}"
        exit 1
    fi
fi

# ------------------------------------------------------------------------------
# 6. Open Web Browser
# ------------------------------------------------------------------------------
URL="http://127.0.0.1:8000/index.html"
echo -e "\n${GREEN}🎉 System is fully up and running!${NC}"
echo -e "${BLUE}🌐 Dashboard URL: ${URL}${NC}"
echo -e "${YELLOW}🖥️ Opening browser automatically...${NC}"

if command -v open &> /dev/null; then
    open "$URL"
elif command -v xdg-open &> /dev/null; then
    xdg-open "$URL"
else
    echo -e "${YELLOW}👉 Please navigate to ${URL} manually in your web browser.${NC}"
fi

echo -e "\n${BLUE}======================================================================${NC}"
echo -e "${GREEN}💡 To stop the project services at any time, run: ./stop_project.sh${NC}"
echo -e "${BLUE}======================================================================${NC}"

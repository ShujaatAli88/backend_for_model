
# # Use a Node.js base image
# FROM node:16

# # Set the working directory for Node.js
# WORKDIR /app

# # Copy package.json and package-lock.json (assuming they exist in the backend directory)
# COPY backend/package*.json /app/
# COPY backend/requirements.txt /app/

# # Install dependencies
# RUN npm install
# RUN pip install virtualenv
# RUN virtualenv venv  # Create the virtual environment
# RUN . venv/bin/activate && pip install -r requirements.txt  # Install dependencies inside the virtual environment

# # Copy the rest of the Node.js application files
# COPY . /app/

# # Expose the port that Node.js app runs on (default: 3000)
# EXPOSE 3000

# # Command to run Node.js API
# CMD ["node", "server.js"]


# Use a Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package files (no need for backend/ prefix since context is already ./backend)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*


# If you really need Python (only keep this if you're running Python scripts from Node.js)
RUN apt-get update && apt-get install -y --fix-missing python3-pip
RUN pip3 install virtualenv
COPY requirements.txt ./  
RUN virtualenv venv
# Modify requirements.txt to remove duplicate PyYAML
# RUN sed -i '/PyYAML/d' requirements.txt && echo "PyYAML==6.0.2" >> requirements.txt
RUN . venv/bin/activate && pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Command to run Node.js API
CMD ["node", "server.js"]

# Use a Node.js base image
FROM node:16

# Set the working directory for Node.js
WORKDIR /app

# Copy package.json and package-lock.json (assuming they exist in the backend directory)
COPY backend/package*.json /app/
COPY backend/requirements.txt /app/

# Install dependencies
RUN npm install
RUN pip install virtualenv
RUN virtualenv venv  # Create the virtual environment
RUN . venv/bin/activate && pip install -r requirements.txt  # Install dependencies inside the virtual environment

# Copy the rest of the Node.js application files
COPY backend/ /app/

# Expose the port that Node.js app runs on (default: 3000)
EXPOSE 3000

# Command to run Node.js API
CMD ["node", "server.js"]

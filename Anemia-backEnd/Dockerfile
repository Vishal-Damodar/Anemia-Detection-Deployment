# Use a base image with Node.js
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the Node.js backend API files to the working directory
COPY . .

# Install Python and create a virtual environment
RUN apt-get update && apt-get install -y python3 python3-pip
RUN apt-get install -y python3.11-venv
RUN python3 -m venv pythonModel/venv
RUN /bin/bash -c "source pythonModel/venv/bin/activate && pip install -r pythonModel/requirements.txt"

# Install Python dependencies
# RUN pip install -r pythonModel/requirements.txt

# Expose the port on which the Node.js API will run
EXPOSE 3006

COPY entrypoint.sh ../
RUN chmod 777 /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]

# Command to start the Node.js API with the Python script as a subprocess
# CMD ["/bin/bash", "-c", "source pythonModel/venv/bin/activate && npm start"]
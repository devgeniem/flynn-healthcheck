FROM node:boron

# Create runtime directories
RUN mkdir -p /usr/src/app/config
WORKDIR /usr/src/app

# Install app and dependecies
COPY package.json /usr/src/app/
RUN npm install
COPY check.js /usr/src/app/
COPY entry.sh /usr/src/app/
RUN chmod +x /usr/src/app/entry.sh

# Run the script
ENTRYPOINT /usr/src/app/entry.sh
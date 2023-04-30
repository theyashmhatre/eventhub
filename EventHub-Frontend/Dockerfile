FROM node:16 AS development
ENV NODE_ENV development
ENV REACT_APP_RAZORPAY_ID rzp_test_rVDuTAsVgSnmJi
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package*.json ./
RUN npm install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]
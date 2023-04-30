FROM node:16

ENV secretOrKey uiwberjhwb4hjwb829u835nj23@#%2j3528732#523j23b57235
ENV dbPassword hackathon
ENV MAIL_USER yashmhatre622@gmail.com
ENV MAIL_PASS Hellothere@1
ENV CLIENT_ID 960495597669-h361fp70s3pgjea09kt43vvcvf0jijd2.apps.googleusercontent.com
ENV CLIENT_SECRET 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
ENV REFRESH_TOKEN 1//04nCe270w6kwgCgYIARAAGAQSNwF-L9IrySxoEK4UafrvI1jRpXeoy4nBCO932Xj9L9kGyL2eL1KiluGs5w8u-ZX8NW6UwpRV30Q
ENV RAZORPAY_ID rzp_test_rVDuTAsVgSnmJi
ENV RAZORPAY_SECRET XqXgvXuBIqg4rWEvKh6sOsB1

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8000
CMD [ "node", "server.js" ]
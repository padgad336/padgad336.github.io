FROM node:14.19.3-alpine as builder
WORKDIR /opt/app
COPY ./package.json ./yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM nginx:1.15-alpine
RUN rm -rf /etc/nginx/conf.d
COPY docker/nginx /etc/nginx/conf.d
COPY --from=builder /opt/app/build /usr/share/nginx/html
EXPOSE 80
# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Make our shell script executable
RUN chmod +x env.sh
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]

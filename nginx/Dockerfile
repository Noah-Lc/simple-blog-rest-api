# The builder from node image
FROM node:alpine as builder

# build-time variables
RUN apk update && apk add --no-cache make git

# Move our files into directory name "app"
WORKDIR /frontend
COPY /frontend/package*.json /frontend/
RUN npm install
COPY ./frontend /frontend/

RUN npm run build -- --output-path=./dist/out


FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/nginx.conf
COPY --from=builder /frontend/dist/out/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

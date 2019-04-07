FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/nginx.conf
COPY backend/static /usr/src/app/static/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Build da aplicação
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Servindo os arquivos com Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
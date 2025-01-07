# Usar imagem oficial do Node.js
FROM node:22-slim

WORKDIR /app

# Copiar package.json e package-lock.json para o contêiner
COPY ./package*.json ./

# Instalar dependências do Node.js
RUN npm i

# Copiar o restante do código
COPY . .

# Definir a porta em que a aplicação vai rodar
EXPOSE 5137

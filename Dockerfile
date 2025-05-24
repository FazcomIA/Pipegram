# Usa imagem oficial do Node.js
FROM node:20-alpine

# Define diretório de trabalho no container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se houver)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todos os arquivos do projeto para o container
COPY . .

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a API
CMD ["node", "index.js"]

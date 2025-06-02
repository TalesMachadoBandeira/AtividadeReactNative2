# BirdWatcher - Observação de Aves

O BirdWatcher é um aplicativo móvel desenvolvido em React Native que permite aos usuários registrar e compartilhar suas observações de aves, incluindo fotos, áudios e informações detalhadas sobre cada avistamento.

## Requisitos do Sistema

- Node.js (versão 14 ou superior)
- MongoDB (versão 4.4 ou superior)
- Expo Go (Instalado no celular)

## Configuração do Ambiente

### 1. Instalação do MongoDB

1. Baixe e instale o MongoDB Community Server do [site oficial](https://www.mongodb.com/try/download/community)
2. Após a instalação, inicie o serviço do MongoDB
3. Crie uma nova database chamada `BirdWatcher`:
   ```bash
   mongosh
   use BirdWatcher
   db.createCollection('birds')
   ```

### 2. Configuração do Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor do backend
   ```bash
   node index.js
   ```
   
   O servidor estará rodando em `http://localhost:3000`

### 3. Configuração do Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd birdwatcher-app
   ```

2. Instale as dependências do React Native:
   ```bash
   npm install
   ```

3. **Importante**: No código, atualize a chamada de IP
   - Abra o arquivo `birdwatcher-app/screens/HomeScreen.js`
   - Localize a constante `API_URL`
   - Substitua o IP atual pelo IP da sua máquina na rede local
   - Exemplo: `const API_URL = 'http://192.168.1.100:3000'`

4. No terminal rode:
   ```bash
   npx expo start
   ```

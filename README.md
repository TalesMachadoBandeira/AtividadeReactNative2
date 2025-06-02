# BirdWatcher - Aplicativo de Observação de Aves

O BirdWatcher é um aplicativo móvel desenvolvido em React Native que permite aos usuários registrar e compartilhar suas observações de aves, incluindo fotos, áudios e informações detalhadas sobre cada avistamento.

## Requisitos do Sistema

- Node.js (versão 14 ou superior)
- MongoDB (versão 4.4 ou superior)
- React Native CLI
- Android Studio (para desenvolvimento Android)
- Xcode (para desenvolvimento iOS - apenas macOS)

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

3. Crie uma pasta `uploads` dentro do diretório backend:
   ```bash
   mkdir uploads
   ```

4. Inicie o servidor backend:
   ```bash
   npm start
   ```
   O servidor estará rodando em `http://localhost:3000`

### 3. Configuração do Frontend

1. Navegue até a pasta raiz do projeto:
   ```bash
   cd ..
   ```

2. Instale as dependências do React Native:
   ```bash
   npm install
   ```

3. **Importante**: Atualize o IP do backend
   - Abra o arquivo `src/screens/HomeScreen.js`
   - Localize a constante `API_URL`
   - Substitua o IP atual pelo IP da sua máquina na rede local
   - Exemplo: `const API_URL = 'http://192.168.1.100:3000'`

4. Para Android, execute:
   ```bash
   npx react-native run-android
   ```

5. Para iOS (apenas macOS):
   ```bash
   cd ios
   pod install
   cd ..
   npx react-native run-ios
   ```

## Estrutura do Projeto

```
BirdWatcher/
├── backend/
│   ├── index.js
│   ├── package.json
│   └── uploads/
├── src/
│   ├── screens/
│   ├── components/
│   └── ...
└── ...
```

## Funcionalidades

- Registro de avistamentos de aves
- Upload de fotos e áudios
- Geolocalização do avistamento
- Listagem de avistamentos
- Edição e exclusão de registros
- Visualização detalhada de cada avistamento

## Solução de Problemas

1. **Erro de conexão com o backend**
   - Verifique se o servidor backend está rodando
   - Confirme se o IP no `HomeScreen.js` está correto
   - Verifique se o MongoDB está em execução

2. **Erro ao fazer upload de arquivos**
   - Verifique se a pasta `uploads` existe no backend
   - Confirme as permissões da pasta

3. **Erro de conexão com o MongoDB**
   - Verifique se o MongoDB está rodando
   - Confirme se a database `BirdWatcher` foi criada
   - Verifique se a coleção `birds` existe

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 
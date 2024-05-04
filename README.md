# Silo API (silo-api)

O **Silo** é um aplicativo para fornecer informações mais rápido e eficiente dos processos e atividades realizadas no supercomputador, monitoradas pelo **Grupo de Produtos e Processos (PP)** do **CPTEC/INPE**.

## Instalação

1 - Instalar todas as dependências de uma só vez:

> npm install

2 - Ou instalar as dependências isoladamente:

> npm install express --save
> npm install sequelize sqlite3 --save
> npm install dotenv --save
> npm install body-parser --save

E também as dependências de desenvolvimento:

> npm install sequelize-cli --save-dev
> npm install nodemon --save-dev

## Variáveis de ambiente

Foi criado manualmente o arquivo _.env_ no root do projeto, e configurado as variáveis de ambiente:

> NODE_ENV=development
> PORT=3030

Ao alterar o ambiente para produção deve usar _NODE_ENV=production_. Os valores possíveis são: development, test ou production, conforme o arquivo _./config/config.json_ criado pelo sequelize.

## Arquivos do projeto

O projeto está dividido em diretórios e arquivos com responsabilidades diferentes.

silo-api/
├─ .git
├─ config/
│ └─ config.json
├─ controllers/
│ └─ users.controller.js
├─ database/
│ ├─ mer.png
│ └─ silo.sqlite
├─ middlewares/
│ └─ users.middlewares.js
├─ migrations/
├─ models/
├─ node_modules/
├─ seeders/
├─ .env
├─ .gitignore
├─ config.js
├─ index.js
├─ package.json
├─ README.md
└─ routes.js

1 - _index.js_

O arquivo _index.js_ contém os scripts para inicializar o servidor.

## Configuração do banco de dados

Sequelize CLI:

1 - Inicializar o sequelize, criando o arquivo _./config/config.json_ na raíz do projeto:

> npx sequelize-cli init

Em _./config/config.json_ alterar o development para:

> "development": {
> "database": "silo_development",
> "storage": "./database/silo.sqlite",
> "dialect": "sqlite"
> },

2 - Criar o banco de dados:

> npx sequelize-cli db:create

_Observação:_ Se o banco de dados for do tipo SQLite é preciso criar o arquivo _./database/silo.sqlite_ manualmente através do comando _touch silo.sqlite_ ou em novo arquivo no VSCode.

3 - Criar as entidades do banco de dados:

> npx sequelize-cli model:generate --name Users --attributes name:string,email:string,password_hash:string

_Observação:_ Insira vírgulas sem espaços.

4 - Executar as migrations para aplicar as alterações:

> npx sequelize-cli db:migrate

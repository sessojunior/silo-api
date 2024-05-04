# Silo API (silo-api)

O **Silo** é um aplicativo para fornecer informações mais rápido e eficiente dos processos e atividades realizadas no supercomputador, monitoradas pelo **Grupo de Produtos e Processos (PP)** do **CPTEC/INPE**.

A API será desenvolvida para dar suporte ao front-end do projeto.

![Login](./assets/img/frontend-1.png)
![Dashboard](./assets/img/frontend-2.png)
![Modal 1](./assets/img/frontend-3.png)
![Modal 2](./assets/img/frontend-4.png)

## Instalação

1 - Instalar todas as dependências de uma só vez:

```bash
> npm install
```

2 - Ou instalar as dependências isoladamente:

```bash
> npm install express --save
> npm install cors --save
> npm install body-parser --save
> npm install dotenv --save
> npm install sequelize sqlite3 --save
```

E também as dependências de desenvolvimento:

```bash
> npm install sequelize-cli --save-dev
> npm install nodemon --save-dev
```

## Variáveis de ambiente

Foi criado manualmente o arquivo _.env_ no root do projeto, e configurado as variáveis de ambiente:

```bash
NODE_ENV=development
PORT=3030
```

Ao alterar o ambiente para produção deve usar _NODE_ENV=production_. Os valores possíveis são: development, test ou production, conforme o arquivo _./config/config.json_ criado pelo sequelize.

## Arquivos do projeto

O projeto está dividido em diretórios e arquivos com responsabilidades diferentes.

```bash
silo-api/
├─ .git
├─ config/
│  └─ config.json
├─ controllers/
│  └─ users.controller.js
├─ database/
│  ├─ mer.png
│  └─ silo.sqlite
├─ middlewares/
│  └─ users.middlewares.js
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
```

A estrutura abaixo pode ser obtida inserindo o comando _tree_ no terminal do Windows.

1 - _index.js_

O arquivo _index.js_ contém os scripts para inicializar o servidor.

## Configuração do banco de dados

O Diagrama de Entidade Relacionamento (DER) a seguir descreve as entidades e relacionamentos do projeto.

![Diagrama de Entidade Relacionamento](./assets/img/der.png)

_Observação:_ O diagrama acima foi construído rapidamente usando o [brModelo](https://www.brmodeloweb.com/), ferramenta para modelagem de dados online e gratuita.

Sequelize CLI:

1 - Inicializar o sequelize, criando o arquivo _./config/config.json_ na raíz do projeto:

```bash
> npx sequelize-cli init
```

Em _./config/config.json_ alterar o development para:

```bash
"development": {
  "database": "silo_development",
  "storage": "./database/silo.sqlite",
  "dialect": "sqlite"
},
```

2 - Criar o banco de dados:

```bash
> npx sequelize-cli db:create
```

_Observação:_ Se o banco de dados for do tipo SQLite é preciso criar o arquivo _./database/silo.sqlite_ manualmente através do comando _touch silo.sqlite_ ou em novo arquivo no VSCode.

3 - Criar as entidades do banco de dados:

```bash
> npx sequelize-cli model:generate --name Users --attributes name:string,email:string,password_hash:string
> npx sequelize-cli model:generate --name Services --attributes name:string
```

_Observação:_ Insira vírgulas sem espaços.

4 - Executar as migrations para aplicar as alterações, toda vez que um model do Sequelize acima:

```bash
> npx sequelize-cli db:migrate
```

## Rotas

As rotas estão divididas da seguinte forma:

**Usuários: /users**

```bash
[GET]     /users      (Listar os usuários)
[GET]     /users?page=1&limit_per_page=10
[POST]    /users      (Cadastrar um novo usuário)
[GET]     /users/:id  (Obter dados de um usuário pelo ID)
[PUT]     /users/:id  (Alterar dados de um usuário pelo ID)
[DELETE]  /users/:id  (Apagar um usuário pelo ID)
```

Para cadastrar um novo usuário é necessário enviar por _body_:

```bash
{
  "name": "Mario",
  "email": "mario@test.com",
  "password": "123456"
}
```

É feito uma validação para cada coluna utilizando middlewares:

```bash
const schema = {
  name: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  password: yup.string().min(6).max(30).required(),
};
```

Isso também vale para as demais rotas.

**Serviços: /services**

```bash
[GET]     /services      (Listar os serviços)
[GET]     /services?page=1&limit_per_page=10
[POST]    /services      (Cadastrar um novo serviço)
[GET]     /services/:id  (Obter dados de um serviço pelo ID)
[PUT]     /services/:id  (Alterar dados de um serviço pelo ID)
[DELETE]  /services/:id  (Apagar um serviço pelo ID)
```

```bash
{
  "name": "BAM"
}
```

```bash
const schema = {
  name: yup.string().trim().required(),
};
```

Estou utilizando o _Insomnia_ para testar as rotas, mas utilize o _Postman_ se você quiser.

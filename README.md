# Silo API (silo-api)

O **Silo** é um aplicativo para fornecer informações mais rápido e eficiente dos processos e atividades realizadas no supercomputador, monitoradas pelo **Grupo de Produtos e Processos (PP)** do **CPTEC/INPE**.

A API será desenvolvida para dar suporte ao front-end do projeto.

![Login](./assets/img/frontend-1.png)
![Dashboard](./assets/img/frontend-2.png)
![Modal 1](./assets/img/frontend-3.png)
![Modal 2](./assets/img/frontend-4.png)

## Instalação

**1 - Instalar todas as dependências de uma só vez:**

```bash
> npm install
```

**2 - Ou instalar as dependências isoladamente:**

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
│  ├─ problems.controller.js
│  ├─ services.controller.js
│  ├─ tasks.controller.js
│  └─ users.controller.js
├─ database/
│  ├─ mer.png
│  └─ silo.sqlite
├─ middlewares/
│  ├─ problems.middlewares.js
│  ├─ services.middlewares.js
│  ├─ tasks.middlewares.js
│  └─ users.middlewares.js
├─ migrations/
├─ models/
│  ├─ index.js
│  ├─ services.js
│  ├─ tasks.js
│  └─ users.js
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

**1 - _index.js_**

O arquivo _index.js_ contém os scripts para inicializar o servidor.

## Configuração do banco de dados

O Diagrama de Entidade Relacionamento (DER) a seguir descreve as entidades e relacionamentos do projeto.

![Diagrama de Entidade Relacionamento](./assets/img/der.png)

_Observação:_ O diagrama acima foi construído rapidamente usando o [brModelo](https://www.brmodeloweb.com/), ferramenta para modelagem de dados online e gratuita.

### Sequelize CLI:

**1 - Inicializar o sequelize, criando o arquivo _./config/config.json_ na raíz do projeto:**

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

**2 - Criar o banco de dados:**

```bash
> npx sequelize-cli db:create
```

_Observação:_ Se o banco de dados for do tipo SQLite é preciso criar o arquivo _./database/silo.sqlite_ manualmente através do comando _touch silo.sqlite_ ou em novo arquivo no VSCode.

**3 - Criar as entidades do banco de dados:**

```bash
> npx sequelize-cli model:generate --name Users --attributes name:string,email:string,passwordHash:string
> npx sequelize-cli model:generate --name Services --attributes name:string
> npx sequelize-cli model:generate --name Tasks --attributes serviceId:integer,name:string,description:string
> npx sequelize-cli model:generate --name Problems --attributes taskId:integer,title:string,description:string
```

_Observação:_ Insira vírgulas sem espaços.

**4 - Executar as migrations para aplicar as alterações, toda vez que um model do Sequelize acima:**

```bash
> npx sequelize-cli db:migrate
```

**5 - Alterações e modificações em tabelas**

Se no futuro quiser **alterar a coluna de uma tabela**, criar uma nova migration com o comando, por exemplo:

```bash
> npx sequelize-cli migration:create --name alter-users
```

Depois editar o arquivo criado com o migration. Por exemplo, para fazer com que o arquivo _20240506121018-alter-users.js_ (criado pelo comando acima) altere a coluna _passwordHash_ para _password_hash_ na tabela _Users_, editar o arquivo para deixá-lo da seguinte forma:

```bash
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.renameColumn("Users", "passwordHash", "password_hash");
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.renameColumn("Users", "password_hash", "passwordHash");
  }
};
```

Depois rodar o comando abaixo para atualizar:

```bash
> npx sequelize-cli db:migrate
```

**6 - Para criar relacionamentos entre tabelas, editar por exemplo o arquivo criado com o comando _npx sequelize-cli model:generate ..._ e adicionar references. Por exemplo:**

```bash
      serviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Services",
          key: "id",
        },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
      },
```

Ficando assim, por exemplo no arquivo _20240506123928-create-tasks.js_:

```bash
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Services",
          key: "id",
        },
				onUpdate: "CASCADE",
				onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tasks");
  }
};
```

Por fim rodar o comando abaixo para atualizar:

```bash
> npx sequelize-cli db:migrate
```

Para **criar uma nova coluna em uma tabela** após a tabela já ter sido criada, rodar por exemplo, o seguinte comando para criar uma nova _migration_:

```bash
> npx sequelize-cli migration:create --name alter-tasks
```

O arquivo de migração ficaria assim:

```bash
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Tasks", "name", {
      type: Sequelize.STRING
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Tasks", "name");
  }
};
```

E então, execute para aplicar as alterações no banco de dados:

```bash
> npx sequelize-cli db:migrate
```

Acesse o link da documentação oficial da [Query Interface](https://sequelize.org/docs/v7/other-topics/query-interface/) do Sequelize para mais informações.

## Rotas

As rotas estão divididas da seguinte forma:

**Usuários: /users**

```bash
[GET]     /users      (Listar os usuários)
[GET]     /users?page=1&limit_per_page=10&order_by=id&order_sort=ASC&filter=mario
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

É feito uma validação com o construtor de schemas [Yup](https://github.com/jquense/yup) para cada coluna utilizando middlewares:

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
[GET]     /services?page=1&limit_per_page=30&order_by=id&order_sort=ASC&filter=brams
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

**Tarefas: /tasks**

```bash
[GET]     /tasks      (Listar as tarefas)
[GET]     /tasks?page=1&limit_per_page=30&order_by=id&order_sort=ASC&serviceId=1&filter=pos
[POST]    /tasks      (Cadastrar uma nova tarefa)
[GET]     /tasks/:id  (Obter dados de uma tarefa pelo ID)
[PUT]     /tasks/:id  (Alterar dados de uma tarefa pelo ID)
[DELETE]  /tasks/:id  (Apagar uma tarefa pelo ID)
```

**Informações: /problems**

```bash
[GET]     /problems
[GET]     /problems?page=1&limit_per_page=30&order_by=id&order_sort=ASC&taskId=1&filter=
[POST]    /problems      (Cadastrar um novo problema)
[GET]     /problems/:id  (Obter dados de um problema pelo ID)
[PUT]     /problems/:id  (Alterar dados de um problema pelo ID)
[DELETE]  /problems/:id  (Apagar um problema pelo ID)
```

Todas as rotas devem ser adicionadas no arquivo _./routes.js_.

Estou utilizando o [Insomnia](https://insomnia.rest/download) para testar as rotas, mas utilize o [Postman](https://www.postman.com/downloads/) se você quiser.

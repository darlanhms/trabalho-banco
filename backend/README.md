## Backend do trabalho

## Instruções

**Atenção: Neste ponto consideramos que você tenha o node intalado na sua máquina, caso não tenha instale em https://nodejs.org/en/**

#### `Instalação módulos do node`

Abra o terminal na pasta do backend do projeto e execute o seguinte comando

Com o npm: 

`npm i`

Com o yarn:

`yarn`

#### `Configurando o postgres`

**Para o trabalho utilizamos o banco de dados do postgres padrão que é criado, a database para a aplicação é criada quando o servidor é executado, então a unica dependencia necessária é informar a senha do banco geral**

O metódo utilizado foram as variáveis de ambiente do node, então:

- Crie um arquivo chamado `.env` na pasta do backend
- Dentro do arquivo insira uma variável `DB_PWD=SENHA` onde `SENHA` é a senha do banco de dados local

#### `Inciando o servidor`

No mesmo terminal executado anteriormente execute o seguinte comando

Com o npm: 

`npm run start`

Com o yarn:

`yarn start`

**Neste ponto a API já está utilizável no frontend, que conseguirá interagir de forma eficiente com as rotas criadas 🚀**

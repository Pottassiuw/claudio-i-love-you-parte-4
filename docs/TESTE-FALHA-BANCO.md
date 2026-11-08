# Teste: tratamento de falhas sem vazar credenciais

Objetivo: mostrar que, quando o banco falha, a API responde com uma mensagem genérica e
**não expõe** host, usuário, senha, SQL ou stack trace, nem na resposta HTTP nem no log.

## 1. Banco cai com a API no ar

Com a API rodando, o container do MySQL foi parado (`docker stop treinos-mysql`) e foram feitas três requisições:

```text
$ curl -s -w " [%{http_code}]" localhost:3000/saude
{"erro":"Erro interno ao acessar o banco de dados. Tente novamente mais tarde"} [500]

$ curl -s -w " [%{http_code}]" localhost:3000/jogadores
{"erro":"Erro interno ao acessar o banco de dados. Tente novamente mais tarde"} [500]

$ curl -s -w " [%{http_code}]" "localhost:3000/relatorios/semanal?data=2026-10-05"
{"erro":"Erro interno ao acessar o banco de dados. Tente novamente mais tarde"} [500]
```

Log do servidor no mesmo momento. Aparece apenas o **tipo** do erro:

```text
Conexão com o MySQL estabelecida.
API rodando em http://localhost:3000
Swagger em http://localhost:3000/api-docs
[erro de banco] SequelizeConnectionError
[erro de banco] SequelizeConnectionError
[erro de banco] SequelizeConnectionError
```

Depois de `docker start treinos-mysql`, a API voltou a responder sem precisar reiniciar:

```text
$ curl -s -w " [%{http_code}]" localhost:3000/saude
{"status":"ok","banco":"conectado"} [200]
```

## 2. Senha errada no `.env` ao iniciar

```text
$ DB_PASSWORD=senha_errada PORT=3999 node src/server.js
Não foi possível conectar ao banco de dados (SequelizeAccessDeniedError). Verifique o MySQL e o arquivo .env.
(processo encerrado com código 1)
```

A mensagem original do MySQL (`Access denied for user 'root'@'...' (using password: YES)`) **não** é exibida.

## Onde isso é tratado

- `src/middlewares/errorHandler.js`: converte `ConnectionError` / `DatabaseError` em HTTP 500 com mensagem genérica e registra só `err.name`.
- `src/server.js`: o `try/catch` em volta de `sequelize.authenticate()` imprime só o tipo do erro e encerra o processo.
- `src/config/database.js`: as credenciais vêm somente de variáveis de ambiente (`.env`, que está no `.gitignore`).

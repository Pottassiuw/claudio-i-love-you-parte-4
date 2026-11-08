# Sistema de Treinos Esportivos com Carga e Risco de Lesão

API REST para um clube de futebol registrar os treinos dos atletas, calcular a carga de cada sessão, acompanhar
a carga semanal e identificar atletas com **risco de sobrecarga**.

**Stack:** Node.js · Express · Sequelize (ORM) · MySQL · dotenv · Swagger UI

> O indicador de risco desta atividade é exclusivamente didático e não corresponde a diagnóstico ou predição clínica de lesão.

---

## Sumário

1. [Como executar](#1-como-executar)
2. [Estrutura do projeto](#2-estrutura-do-projeto)
3. [Modelagem e associações](#3-modelagem-e-associações)
4. [Estratégia de criação das tabelas](#4-estratégia-de-criação-das-tabelas)
5. [Regras de negócio](#5-regras-de-negócio)
6. [Endpoints](#6-endpoints)
7. [Relatório semanal](#7-relatório-semanal)
8. [Testes e evidências](#8-testes-e-evidências)
9. [Onde o Sequelize e o async/await foram usados](#9-onde-o-sequelize-e-o-asyncawait-foram-usados)

---

## 1. Como executar

### Pré-requisitos

- Node.js 18 ou superior (testado com Node 22)
- MySQL 8. Pode ser uma instalação local ou o container do `docker-compose.yml`

### Passo a passo

```bash
# 1. Instalar as dependências
npm install

# 2. Criar o .env a partir do exemplo e preencher a senha do seu MySQL
cp .env.example .env        # no Windows: copy .env.example .env

# 3. (Opcional) subir o MySQL com Docker, que usa DB_NAME / DB_PASSWORD / DB_PORT do .env
docker compose up -d

# 4. Criar o banco, as tabelas (migrations) e a massa de testes (seeders)
npm run db:create           # pule se o banco já existir (o Docker já cria)
npm run db:migrate
npm run db:seed

# 5. Iniciar a API
npm start                   # ou: npm run dev (com nodemon)
```

- API: <http://localhost:3000>
- **Swagger:** <http://localhost:3000/api-docs>

### Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm start` / `npm run dev` | Inicia a API (dev = reinicia ao salvar) |
| `npm run db:create` | Cria o banco definido em `DB_NAME` |
| `npm run db:migrate` | Cria as tabelas (migrations) |
| `npm run db:seed` | Insere a massa de testes |
| `npm run db:reset` | Apaga as tabelas, recria e popula de novo |
| `npm test` | Testes unitários das regras (cálculo de carga, risco, semana). Não precisa de banco |
| `npm run test:api` | Roda os 43 cenários obrigatórios contra a API e gera `docs/EVIDENCIAS.md` |

### Variáveis de ambiente (`.env`)

| Variável | Exemplo | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta da API |
| `DB_HOST` | `localhost` | Host do MySQL |
| `DB_PORT` | `3306` | Porta do MySQL |
| `DB_NAME` | `treinos_esportivos` | Nome do banco |
| `DB_USER` | `root` | Usuário |
| `DB_PASSWORD` | *(sua senha)* | Senha. **Nunca** versionar o `.env` |
| `DB_LOGGING` | `false` | `true` mostra no console o SQL gerado pelo Sequelize |

---

## 2. Estrutura do projeto

```
├── .sequelizerc               # diz ao Sequelize CLI onde estão config/models/migrations/seeders
├── .env.example               # modelo de variáveis (sem senha real)
├── docker-compose.yml         # MySQL 8 opcional
├── src/
│   ├── server.js              # testa a conexão (authenticate) e sobe o servidor
│   ├── app.js                 # Express, Swagger, rotas e tratamento de erros
│   ├── config/database.js     # configuração do Sequelize lida do .env
│   ├── models/                # Jogador, Treino, Configuracao + associações (index.js)
│   ├── migrations/            # criação das tabelas
│   ├── seeders/               # massa de testes (9 atletas, 22 treinos, limite 200)
│   ├── services/              # REGRAS DE NEGÓCIO e acesso a dados via Sequelize
│   │   ├── cargaService.js        # calcularCarga() e estaEmRisco()
│   │   ├── jogadorService.js      # cadastrar/listar/buscar/atualizar/desativar
│   │   ├── treinoService.js       # registrar/listar/excluir treinos
│   │   ├── configuracaoService.js # limite semanal
│   │   └── relatorioService.js    # gerarRelatorioSemanal() com agregações
│   ├── controllers/           # recebem req/res, chamam services, devolvem JSON + status
│   ├── routes/index.js        # mapeamento dos endpoints
│   ├── middlewares/errorHandler.js  # converte erros em 400/404/409/500 sem vazar detalhes
│   ├── utils/                 # AppError, datas (semana seg–dom), números
│   └── docs/openapi.js        # especificação Swagger/OpenAPI 3
├── scripts/testes-api.js      # testes de integração + geração das evidências
├── tests/regras.test.js       # testes unitários (node:test)
└── docs/
    ├── EVIDENCIAS.md          # requisições e respostas de todos os testes + comparativo das semanas
    ├── TESTE-FALHA-BANCO.md   # falha de banco sem vazar credenciais
    └── evidencias/*.png       # capturas de tela das requisições executadas no Swagger
```

O fluxo de uma requisição é **rota → controller → service → model (Sequelize) → MySQL**. Se algo dá errado,
o service lança um erro, o controller repassa com `next(err)` e o `errorHandler` escolhe o status HTTP.

---

## 3. Modelagem e associações

| Model (tabela) | Atributos |
|---|---|
| **Jogador** (`jogadores`) | `id` INTEGER PK · `nome` STRING(100) · `posicao` ENUM('G','Z','M','A') · `ativo` BOOLEAN (padrão `true`) |
| **Treino** (`treinos`) | `id` INTEGER PK · `codigo` STRING **UNIQUE** · `jogadorId` FK → jogadores.id · `dataTreino` DATE · `tipo` ENUM('F','T','E') · `duracaoMin` INTEGER · `intensidade` INTEGER · `carga` DECIMAL(10,2) |
| **Configuracao** (`configuracoes`) | `id` INTEGER PK · `cargaMaximaSemanal` DECIMAL(10,2) · `dataVigencia` DATE (opcional) |

Posições: **G** Goleiro · **Z** Zagueiro · **M** Meio-campo · **A** Atacante.
Tipos: **F** Físico · **T** Técnico · **E** Estratégico.

`dataTreino` e `dataVigencia` usam `DataTypes.DATEONLY`, que vira o tipo `DATE` do MySQL (só a data, sem horário).
Assim o corte da semana não muda por causa de fuso horário.

### Associações (1:N)

```js
// src/models/jogador.js
Jogador.hasMany(models.Treino, { foreignKey: 'jogadorId', as: 'treinos' });
// src/models/treino.js
Treino.belongsTo(models.Jogador, { foreignKey: 'jogadorId', as: 'jogador' });
```

- `belongsTo` permite `Treino.findAll({ include: [{ model: Jogador, as: 'jogador' }] })`, ou seja, cada treino vem com os dados do atleta.
- `hasMany` declara o lado "1 jogador tem N treinos".
- A FK foi criada com `ON DELETE RESTRICT`: o banco **impede** apagar um jogador que tenha treinos.

### Validações

| Regra | Onde |
|---|---|
| Intensidade inteira de 1 a 10 | `validate: { min: 1, max: 10 }` no model **e** `validarParametrosCarga()` no service → **400** |
| Duração positiva | `validate: { min: 1 }` no model e no service → **400** |
| Código único | `unique` no model + constraint UNIQUE na migration + `findOne` no service → **409** |
| Tipo e posição válidos | `ENUM` + `isIn` no model, também conferido no service → **400** |
| Treino só para atleta existente e ativo | `findByPk` no service → **404** (não existe) / **400** (inativo) |
| Datas no formato AAAA-MM-DD e reais | `utils/datas.js` (rejeita `2026-02-30`) → **400** |

A validação aparece em duas camadas de propósito. O service devolve **todas** as mensagens de uma vez e com texto claro.
O model é a última barreira, então o dado não entra errado no banco mesmo que outro trecho de código chame `create()`.

### Histórico preservado

Não existe `DELETE /jogadores`. A "remoção" de um atleta é **lógica**: `PATCH /jogadores/:id/desativar` só muda `ativo` para `false`.
Os treinos continuam no banco, aparecem em `GET /treinos/jogador/:id` e entram nos relatórios das semanas passadas.
Um atleta inativo apenas não pode receber **novos** treinos.

---

## 4. Estratégia de criação das tabelas

Usamos **migrations do Sequelize CLI**, que é a estratégia preferencial:

- `src/migrations/` tem um arquivo por tabela, com `up` (cria) e `down` (desfaz). A ordem é jogadores → treinos (FK) → configuracoes.
- A tabela `SequelizeMeta` guarda quais migrations já rodaram. `npm run db:migrate` só executa as pendentes e **não apaga dados**.
- A migration de treinos também cria a constraint UNIQUE de `codigo` e índices em `dataTreino` e `(jogadorId, dataTreino)`, que aceleram os filtros por período do relatório.
- **Não usamos `sequelize.sync()`**, muito menos `sync({ force: true })`, que apagaria as tabelas e os dados. O `server.js` só faz `sequelize.authenticate()` para testar a conexão.
- Os seeders (`src/seeders/`) inserem a massa de testes com `queryInterface.bulkInsert`. O seeder de treinos usa a mesma função `calcularCarga()` da API, então as cargas gravadas seguem a regra oficial.

---

## 5. Regras de negócio

### Carga do treino

```
carga = (duracaoMin / 10) × intensidade × multiplicador
```

| Tipo | Código | Multiplicador |
|---|---|---|
| Físico | F | 1,5 |
| Técnico | T | 1,2 |
| Estratégico | E | 1,0 |

Exemplo: físico, 60 min, intensidade 8 → (60 / 10) × 8 × 1,5 = **72 pontos**.

O cálculo fica em `calcularCarga()` (`src/services/cargaService.js`), uma função pura e reutilizável. A carga é
**calculada pela API** e gravada em `treinos.carga`. O cliente não envia a carga.

### Carga semanal e risco

- A semana vai de **segunda a domingo** e é a que contém a data consultada (`utils/datas.js → obterSemana()`).
- A carga semanal é a **soma** das cargas das sessões do atleta nessa semana (`SUM` no banco).
- **RISCO DE SOBRECARGA** só quando a carga semanal é **estritamente maior** que `cargaMaximaSemanal`.
  **Empate não é risco**. A comparação é feita em centésimos inteiros para evitar erro de ponto flutuante (`estaEmRisco()`).

---

## 6. Endpoints

| Método | Endpoint | Finalidade | Status |
|---|---|---|---|
| POST | `/jogadores` | Cadastrar atleta | 201, 400 |
| GET | `/jogadores?posicao=&ativo=` | Listar atletas (filtros opcionais) | 200, 400 |
| GET | `/jogadores/:id` | Consultar atleta | 200, 400, 404 |
| PUT | `/jogadores/:id` | Atualizar atleta (`nome`, `posicao`, `ativo`) | 200, 400, 404 |
| PATCH | `/jogadores/:id/desativar` | Desativar atleta (histórico preservado) | 200, 404 |
| GET | `/configuracao` | Consultar limite semanal | 200, 404 |
| PUT | `/configuracao` | Criar (201) ou atualizar (200) o limite | 200, 201, 400 |
| POST | `/treinos` | Registrar sessão (calcula a carga) | 201, 400, 404, 409 |
| GET | `/treinos?jogadorId=&tipo=&posicao=&dataInicio=&dataFim=` | Listar e filtrar sessões, com dados do atleta | 200, 400 |
| GET | `/treinos/jogador/:id` | Treinos do atleta | 200, 400, 404 |
| DELETE | `/treinos/:codigo` | Excluir sessão pelo código | 200, 404 |
| GET | `/relatorios/semanal?data=2026-10-05` | Relatório da semana | 200, 400 |
| GET | `/saude` | Verifica a conexão com o banco | 200, 500 |

Qualquer endpoint pode devolver **500** com mensagem genérica se o banco falhar.

### Exemplo: registrar treino

```http
POST /treinos
Content-Type: application/json

{ "codigo": "TR-100", "jogadorId": 1, "dataTreino": "2026-10-19", "tipo": "F", "duracaoMin": 60, "intensidade": 8 }
```

```json
201 Created
{ "id": 23, "codigo": "TR-100", "jogadorId": 1, "dataTreino": "2026-10-19", "tipo": "F",
  "duracaoMin": 60, "intensidade": 8, "carga": 72,
  "jogador": { "id": 1, "nome": "Carlos Henrique", "posicao": "G", "ativo": true } }
```

### Formato dos erros

```json
400 Bad Request
{ "erro": "Dados do treino inválidos", "detalhes": ["A intensidade deve estar entre 1 e 10"] }
```

A resposta nunca traz SQL, stack trace, host ou credenciais (veja `docs/TESTE-FALHA-BANCO.md`).

---

## 7. Relatório semanal

`GET /relatorios/semanal?data=AAAA-MM-DD` consolida a semana (segunda a domingo) que contém a data.

| Indicador | Campo da resposta | Como é obtido (Sequelize) |
|---|---|---|
| Total de treinos | `totalTreinos` | `Treino.count({ where })` |
| Por jogador: carga semanal e nº de treinos | `porJogador[]` | `findAll` + `fn('SUM')` + `fn('COUNT')` + `include: Jogador` + `group` |
| Maior carga semanal (nome, posição, total, qtd.) | `maiorCargaSemanal` | calculado sobre `porJogador` |
| Menor carga semanal (nome, posição, total) | `menorCargaSemanal` | calculado sobre `porJogador` |
| Jogadores em risco | `jogadoresEmRisco.quantidade` | `estaEmRisco()` para cada atleta |
| Carga média por tipo (F, T, E) | `mediaPorTipo[]` | `fn('AVG')` + `group: ['tipo']` |
| Por posição: treinos e carga média por sessão | `porPosicao[]` | `include` (sem atributos) + `fn('AVG')` + `group: ['jogador.posicao']` |

O filtro da semana é `where: { dataTreino: { [Op.between]: [segunda, domingo] } }`.

Trecho real (`src/services/relatorioService.js`):

```js
Treino.findAll({
  attributes: [
    'jogadorId',
    [fn('SUM', col('Treino.carga')), 'cargaSemanal'],
    [fn('COUNT', col('Treino.id')), 'quantidadeTreinos'],
  ],
  include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome', 'posicao', 'ativo'] }],
  where: { dataTreino: { [Op.between]: [inicio, fim] } },
  group: ['Treino.jogadorId', 'jogador.id'],
  raw: true,
  nest: true,
});
```

### Critérios (também devolvidos no próprio relatório, campo `criterios`)

- **Rankings:** maior e menor carga só consideram atletas com **pelo menos um treino na semana**. Quem não treinou não entra (caso contrário a menor carga seria sempre 0).
- **Empates:** se dois ou mais atletas empatam na maior ou menor carga, **todos** são listados e `empate: true`.
- **Risco:** só acima do limite. Quem está exatamente no limite aparece como `DENTRO DO LIMITE`.
- **Semana sem treinos:** retorna **200** com `totalTreinos: 0`, listas vazias, `maiorCargaSemanal` e `menorCargaSemanal` como `null`, um aviso em `avisos`, e tipos e posições com quantidade 0 e média `null`.
- **Sem limite configurado:** o relatório é gerado assim mesmo, com `jogadoresEmRisco.quantidade: null` e um aviso.
- `mediaPorTipo` e `porPosicao` sempre trazem os 3 tipos e as 4 posições, mesmo sem dados, o que facilita comparar semanas.

---

## 8. Testes e evidências

### Massa de dados (seeders)

- **9 atletas** cobrindo as 4 posições (2 G, 2 Z, 3 M, 2 A). O atleta 9 (Felipe Costa) está **inativo**.
- **22 treinos** dos 3 tipos em duas semanas, mais o limite semanal de **200**.

| Semana | Destaques planejados |
|---|---|
| 05/10 a 11/10/2026 | Diego 215,1 e Lucas 202,5 → **em risco** · Bruno **exatamente 200** → **não** é risco (empate com o limite) · André 156 · Carlos 56 · Mateus 24 (menor) · treino de Lucas no **domingo 11/10** entra na semana |
| 12/10 a 18/10/2026 | André 216 → **em risco** · Pedro 193,8 (treino na **segunda 12/10**) · Thiago 55,2 · Diego e Mateus 24 → **empate na menor carga** |

### Cobertura dos testes obrigatórios

| Teste obrigatório | Onde está |
|---|---|
| ≥ 6 atletas nas 4 posições e ≥ 20 treinos dos 3 tipos | Seeders · `EVIDENCIAS.md` 2.1 e 4.1 |
| Limite com atleta acima e abaixo | Seeder de configuração (200) · 7.1 e 7.2 |
| Validação manual da carga x API | `EVIDENCIAS.md` 5.1 (60/10 × 8 × 1,5 = 72) · captura `09-…png` |
| Código duplicado, intensidade inválida, duração não positiva | 5.2 a 5.8 · capturas `10` a `12` |
| Treino para atleta inexistente / inativo | 5.9, 5.10 e 6.2 · capturas `13` e `14` |
| Duas semanas comparadas por atleta, tipo e posição | 7.1, 7.2 e a seção **Comparativo** no topo de `EVIDENCIAS.md` · capturas `18` e `19` |
| Falhas sem vazar credenciais | `docs/TESTE-FALHA-BANCO.md` · 5.11 (JSON malformado) |

### Como reproduzir

```bash
npm test                    # 7 testes unitários das regras
npm run db:reset            # deixa o banco no estado inicial
npm start                   # em outro terminal
npm run test:api            # 43 cenários; regrava docs/EVIDENCIAS.md
```

As capturas em `docs/evidencias/` mostram as mesmas requisições executadas pelo **Swagger** (*Try it out → Execute*).
No `POST /treinos` do Swagger há exemplos prontos (válido, intensidade inválida, duração zero, código duplicado,
atleta inexistente e atleta inativo) no seletor **Examples**.

---

## 9. Onde o Sequelize e o async/await foram usados

### Sequelize

| Recurso | Onde |
|---|---|
| Conexão e dialeto `mysql` | `src/models/index.js` (`new Sequelize(...)`) com a config de `src/config/database.js` |
| `define` com `DataTypes` e `validate` | `src/models/*.js` |
| `hasMany` / `belongsTo` | `Jogador.associate` / `Treino.associate` |
| `create()` | `cadastrarJogador()`, `registrarTreino()`, `definirConfiguracao()` |
| `findAll()` com `where`, `include`, `order` | `listarJogadores()`, `listarTreinos()` (inclui `include.where` para filtrar por posição) |
| `findByPk()` / `findOne()` | `buscarJogador()`, verificação de atleta e de código duplicado em `registrarTreino()`, `excluirTreino()` |
| `instancia.update()` | `atualizarJogador()`, `desativarJogador()`, `definirConfiguracao()` |
| `instancia.destroy()` | `excluirTreino()` |
| `count()`, `fn('SUM'|'COUNT'|'AVG')`, `col()`, `group` | `relatorioService.js` |
| Operadores `Op.between`, `Op.gte`, `Op.lte` | filtro de período em `listarTreinos()` e no relatório |
| Classes de erro (`ValidationError`, `UniqueConstraintError`, `ConnectionError`…) | `errorHandler.js` mapeia cada uma para 400 / 409 / 500 |
| Migrations e seeders (`queryInterface`) | `src/migrations`, `src/seeders` |

Nenhuma funcionalidade usa SQL escrito à mão. Todas as consultas são geradas pelo Sequelize.

### async/await

- **Services:** todas as funções que acessam o banco são `async` e usam `await` em cada operação do Sequelize. Por exemplo, `registrarTreino()` faz `await Jogador.findByPk()` → `await Treino.findOne()` → `await Treino.create()`. A ordem importa, porque cada verificação depende da anterior.
- **Controllers:** são `async (req, res, next)` com `try/catch`. O `await` espera o service, e se ele lançar erro (de negócio ou do banco) o `catch` repassa para o `errorHandler` com `next(err)`.
- **Relatório:** as 5 consultas de `gerarRelatorioSemanal()` não dependem umas das outras, então rodam **em paralelo** com `await Promise.all([...])`. O tempo total fica próximo ao da consulta mais lenta, e não à soma de todas.
- **Inicialização:** `server.js` faz `await sequelize.authenticate()` dentro de `try/catch` antes de `app.listen()`. Se o banco estiver fora, a API não sobe e mostra uma mensagem sem credenciais.
- **Migrations e seeders:** `async up()` / `async down()` com `await queryInterface...`.

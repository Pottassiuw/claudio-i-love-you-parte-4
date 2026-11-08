# Evidências de funcionamento da API

Gerado automaticamente por `npm run test:api` em 08/11/2026, 20:10:10 contra `http://localhost:3000`.
Os mesmos cenários podem ser executados manualmente no Swagger (`/api-docs`). Os exemplos de corpo de `POST /treinos` já estão cadastrados lá.

**Resultado: 43/43 verificações aprovadas.**

| # | Cenário | Requisição | Esperado | Recebido | OK |
|---|---|---|---|---|---|
| 1.1 | API e banco conectados | `GET /saude` | 200 | 200 | ✅ |
| 2.1 | Listar atletas (seed: 9 atletas, 4 posições, 1 inativo) | `GET /jogadores` | 200 | 200 | ✅ |
| 2.2 | Cadastrar atleta | `POST /jogadores` | 201 | 201 | ✅ |
| 2.3 | Cadastrar atleta com posição inválida | `POST /jogadores` | 400 | 400 | ✅ |
| 2.4 | Cadastrar atleta sem nome | `POST /jogadores` | 400 | 400 | ✅ |
| 2.5 | Consultar atleta por id | `GET /jogadores/3` | 200 | 200 | ✅ |
| 2.6 | Consultar atleta inexistente | `GET /jogadores/999` | 404 | 404 | ✅ |
| 2.7 | Consultar com id inválido | `GET /jogadores/abc` | 400 | 400 | ✅ |
| 2.8 | Atualizar atleta | `PUT /jogadores/10` | 200 | 200 | ✅ |
| 2.9 | Filtrar atletas por posição | `GET /jogadores?posicao=Z` | 200 | 200 | ✅ |
| 3.1 | Consultar limite (seed = 200) | `GET /configuracao` | 200 | 200 | ✅ |
| 3.2 | Atualizar limite para 200 (mantém o cenário de teste) | `PUT /configuracao` | 200 | 200 | ✅ |
| 3.3 | Limite negativo | `PUT /configuracao` | 400 | 400 | ✅ |
| 3.4 | Limite não numérico | `PUT /configuracao` | 400 | 400 | ✅ |
| 4.1 | Listar todos os treinos (seed: 22 treinos, tipos F/T/E) com dados do jogador | `GET /treinos` | 200 | 200 | ✅ |
| 4.2 | Filtrar por tipo e período (físicos da semana 05/10 a 11/10) | `GET /treinos?tipo=F&dataInicio=2026-10-05&dataFim=2026-10-11` | 200 | 200 | ✅ |
| 4.3 | Filtrar por atleta | `GET /treinos?jogadorId=4` | 200 | 200 | ✅ |
| 4.4 | Filtrar por posição do atleta (include com where) | `GET /treinos?posicao=G` | 200 | 200 | ✅ |
| 4.5 | Filtro com tipo inválido | `GET /treinos?tipo=X` | 400 | 400 | ✅ |
| 4.6 | Treinos do atleta | `GET /treinos/jogador/3` | 200 | 200 | ✅ |
| 4.7 | Treinos de atleta inexistente | `GET /treinos/jogador/999` | 404 | 404 | ✅ |
| 5.1 | Registrar treino e conferir a carga calculada | `POST /treinos` | 201 | 201 | ✅ |
| 5.2 | Código duplicado | `POST /treinos` | 409 | 409 | ✅ |
| 5.3 | Intensidade acima de 10 | `POST /treinos` | 400 | 400 | ✅ |
| 5.4 | Intensidade zero | `POST /treinos` | 400 | 400 | ✅ |
| 5.5 | Duração zero | `POST /treinos` | 400 | 400 | ✅ |
| 5.6 | Duração negativa | `POST /treinos` | 400 | 400 | ✅ |
| 5.7 | Tipo inválido | `POST /treinos` | 400 | 400 | ✅ |
| 5.8 | Vários campos inválidos ao mesmo tempo | `POST /treinos` | 400 | 400 | ✅ |
| 5.9 | Atleta inexistente | `POST /treinos` | 404 | 404 | ✅ |
| 5.10 | Atleta inativo (seed: Felipe Costa, id 9) | `POST /treinos` | 400 | 400 | ✅ |
| 5.11 | JSON malformado | `POST /treinos` | 400 | 400 | ✅ |
| 6.1 | Desativar o atleta cadastrado no teste | `PATCH /jogadores/10/desativar` | 200 | 200 | ✅ |
| 6.2 | Registrar treino para o atleta recém-desativado | `POST /treinos` | 400 | 400 | ✅ |
| 6.3 | Histórico do atleta desativado continua disponível | `GET /treinos/jogador/10` | 200 | 200 | ✅ |
| 7.1 | Semana 1 (data=2026-10-05 → 05/10 a 11/10) | `GET /relatorios/semanal?data=2026-10-05` | 200 | 200 | ✅ |
| 7.2 | Semana 2 (data=2026-10-14 → 12/10 a 18/10) | `GET /relatorios/semanal?data=2026-10-14` | 200 | 200 | ✅ |
| 7.3 | Semana sem treinos (data=2026-11-02) | `GET /relatorios/semanal?data=2026-11-02` | 200 | 200 | ✅ |
| 7.4 | Relatório sem o parâmetro data | `GET /relatorios/semanal` | 400 | 400 | ✅ |
| 7.5 | Relatório com data inexistente | `GET /relatorios/semanal?data=2026-02-30` | 400 | 400 | ✅ |
| 8.1 | Excluir treino pelo código | `DELETE /treinos/TR-T01` | 200 | 200 | ✅ |
| 8.2 | Excluir treino inexistente | `DELETE /treinos/TR-T01` | 404 | 404 | ✅ |
| 9.1 | Rota não mapeada | `GET /nao-existe` | 404 | 404 | ✅ |

## Comparativo entre as semanas 2026-10-05 e 2026-10-12

Montado a partir das duas respostas de `GET /relatorios/semanal` acima.

| Indicador | Semana 1 | Semana 2 |
|---|---|---|
| Período | 2026-10-05 a 2026-10-11 | 2026-10-12 a 2026-10-18 |
| Total de treinos | 13 | 9 |
| Jogadores com treino | 6 | 5 |
| Maior carga | Diego Souza (M) – 215,1 | André Lima (A) – 216 |
| Menor carga | Mateus Rocha (M) – 24 | Diego Souza (M), Mateus Rocha (M) – 24 (empate) |
| Jogadores em risco | 2 | 1 |

**Por atleta (carga semanal / nº de treinos / situação)**

| Atleta | Posição | Semana 1 | Semana 2 |
|---|---|---|---|
| Carlos Henrique | G | 56 / 2 / DENTRO DO LIMITE | sem treino |
| Bruno Alves | Z | 200 / 2 / DENTRO DO LIMITE | sem treino |
| Diego Souza | M | 215,1 / 3 / RISCO DE SOBRECARGA | 24 / 1 / DENTRO DO LIMITE |
| André Lima | A | 156 / 3 / DENTRO DO LIMITE | 216 / 2 / RISCO DE SOBRECARGA |
| Lucas Pereira | Z | 202,5 / 2 / RISCO DE SOBRECARGA | sem treino |
| Mateus Rocha | M | 24 / 1 / DENTRO DO LIMITE | 24 / 1 / DENTRO DO LIMITE |
| Pedro Santos | A | sem treino | 193,8 / 3 / DENTRO DO LIMITE |
| Thiago Martins | G | sem treino | 55,2 / 2 / DENTRO DO LIMITE |

**Carga média por tipo de sessão (quantidade / média)**

| Tipo | Semana 1 | Semana 2 |
|---|---|---|
| F - Físico | 5 / 85,2 | 3 / 93 |
| T - Técnico | 4 / 63,9 | 3 / 48 |
| E - Estratégico | 4 / 43 | 3 / 30 |

**Por posição (treinos / carga média por sessão)**

| Posição | Semana 1 | Semana 2 |
|---|---|---|
| G - Goleiro | 2 / 28 | 2 / 27,6 |
| Z - Zagueiro | 4 / 100,63 | 0 / - |
| M - Meio-campo | 4 / 59,78 | 2 / 24 |
| A - Atacante | 3 / 52 | 5 / 81,96 |

## 1. Saúde da API

### 1.1. API e banco conectados ✅

**Requisição:** `GET /saude`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "status": "ok",
  "banco": "conectado"
}
```

## 2. Jogadores

### 2.1. Listar atletas (seed: 9 atletas, 4 posições, 1 inativo) ✅

**Requisição:** `GET /jogadores`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
[
  {
    "id": 4,
    "nome": "André Lima",
    "posicao": "A",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 2,
    "nome": "Bruno Alves",
    "posicao": "Z",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 1,
    "nome": "Carlos Henrique",
    "posicao": "G",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 3,
    "nome": "Diego Souza",
    "posicao": "M",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 9,
    "nome": "Felipe Costa",
    "posicao": "M",
    "ativo": false,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 5,
    "nome": "Lucas Pereira",
    "posicao": "Z",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 6,
    "nome": "Mateus Rocha",
    "posicao": "M",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 7,
    "nome": "Pedro Santos",
    "posicao": "A",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 8,
    "nome": "Thiago Martins",
    "posicao": "G",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  }
]
```

### 2.2. Cadastrar atleta ✅

**Requisição:** `POST /jogadores`  
**Status esperado:** 201 · **Status recebido:** 201

Corpo enviado:
```json
{
  "nome": "Rafael Gomes",
  "posicao": "A"
}
```
Resposta:
```json
{
  "ativo": true,
  "id": 10,
  "nome": "Rafael Gomes",
  "posicao": "A",
  "updatedAt": "2026-11-08T23:10:09.855Z",
  "createdAt": "2026-11-08T23:10:09.855Z"
}
```

### 2.3. Cadastrar atleta com posição inválida ✅

**Requisição:** `POST /jogadores`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "nome": "Teste",
  "posicao": "X"
}
```
Resposta:
```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "Posição inválida. Use G, Z, M ou A"
  ]
}
```

### 2.4. Cadastrar atleta sem nome ✅

**Requisição:** `POST /jogadores`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "posicao": "G"
}
```
Resposta:
```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    "O nome é obrigatório"
  ]
}
```

### 2.5. Consultar atleta por id ✅

**Requisição:** `GET /jogadores/3`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "id": 3,
  "nome": "Diego Souza",
  "posicao": "M",
  "ativo": true,
  "createdAt": "2026-11-08T23:10:09.000Z",
  "updatedAt": "2026-11-08T23:10:09.000Z"
}
```

### 2.6. Consultar atleta inexistente ✅

**Requisição:** `GET /jogadores/999`  
**Status esperado:** 404 · **Status recebido:** 404

Resposta:
```json
{
  "erro": "Jogador não encontrado"
}
```

### 2.7. Consultar com id inválido ✅

**Requisição:** `GET /jogadores/abc`  
**Status esperado:** 400 · **Status recebido:** 400

Resposta:
```json
{
  "erro": "O id do jogador deve ser um número inteiro positivo"
}
```

### 2.8. Atualizar atleta ✅

**Requisição:** `PUT /jogadores/10`  
**Status esperado:** 200 · **Status recebido:** 200

Corpo enviado:
```json
{
  "nome": "Rafael Gomes Filho",
  "posicao": "M"
}
```
Resposta:
```json
{
  "id": 10,
  "nome": "Rafael Gomes Filho",
  "posicao": "M",
  "ativo": true,
  "createdAt": "2026-11-08T23:10:09.000Z",
  "updatedAt": "2026-11-08T23:10:09.881Z"
}
```

### 2.9. Filtrar atletas por posição ✅

**Requisição:** `GET /jogadores?posicao=Z`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
[
  {
    "id": 2,
    "nome": "Bruno Alves",
    "posicao": "Z",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  },
  {
    "id": 5,
    "nome": "Lucas Pereira",
    "posicao": "Z",
    "ativo": true,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  }
]
```

## 3. Configuração do limite semanal

### 3.1. Consultar limite (seed = 200) ✅

**Requisição:** `GET /configuracao`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "id": 1,
  "cargaMaximaSemanal": 200,
  "dataVigencia": "2026-10-01",
  "createdAt": "2026-11-08T23:10:09.000Z",
  "updatedAt": "2026-11-08T23:10:09.000Z"
}
```

### 3.2. Atualizar limite para 200 (mantém o cenário de teste) ✅

**Requisição:** `PUT /configuracao`  
**Status esperado:** 200 · **Status recebido:** 200

Corpo enviado:
```json
{
  "cargaMaximaSemanal": 200,
  "dataVigencia": "2026-10-01"
}
```
Resposta:
```json
{
  "id": 1,
  "cargaMaximaSemanal": 200,
  "dataVigencia": "2026-10-01",
  "createdAt": "2026-11-08T23:10:09.000Z",
  "updatedAt": "2026-11-08T23:10:09.000Z"
}
```

### 3.3. Limite negativo ✅

**Requisição:** `PUT /configuracao`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "cargaMaximaSemanal": -5
}
```
Resposta:
```json
{
  "erro": "cargaMaximaSemanal deve ser maior que zero"
}
```

### 3.4. Limite não numérico ✅

**Requisição:** `PUT /configuracao`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "cargaMaximaSemanal": "abc"
}
```
Resposta:
```json
{
  "erro": "cargaMaximaSemanal é obrigatória e deve ser numérica"
}
```

## 4. Treinos - listagem e filtros

### 4.1. Listar todos os treinos (seed: 22 treinos, tipos F/T/E) com dados do jogador ✅

**Requisição:** `GET /treinos`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "total": 22,
  "treinos": [
    {
      "id": 1,
      "codigo": "TR-001",
      "jogadorId": 3,
      "dataTreino": "2026-10-05",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 8,
      "carga": 72,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 4,
      "codigo": "TR-004",
      "jogadorId": 4,
      "dataTreino": "2026-10-05",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 8,
      "carga": 72,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 5,
      "codigo": "TR-005",
      "jogadorId": 4,
      "dataTreino": "2026-10-06",
      "tipo": "E",
      "duracaoMin": 80,
      "intensidade": 6,
      "carga": 48,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 7,
      "codigo": "TR-007",
      "jogadorId": 2,
      "dataTreino": "2026-10-06",
      "tipo": "F",
      "duracaoMin": 80,
      "intensidade": 10,
      "carga": 120,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 2,
        "nome": "Bruno Alves",
        "posicao": "Z",
        "ativo": true
      }
    },
    {
      "id": 11,
      "codigo": "TR-011",
      "jogadorId": 5,
      "dataTreino": "2026-10-06",
      "tipo": "F",
      "duracaoMin": 70,
      "intensidade": 9,
      "carga": 94.5,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 5,
        "nome": "Lucas Pereira",
        "posicao": "Z",
        "ativo": true
      }
    },
    {
      "id": 2,
      "codigo": "TR-002",
      "jogadorId": 3,
      "dataTreino": "2026-10-07",
      "tipo": "T",
      "duracaoMin": 90,
      "intensidade": 7,
      "carga": 75.6,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 9,
      "codigo": "TR-009",
      "jogadorId": 1,
      "dataTreino": "2026-10-07",
      "tipo": "T",
      "duracaoMin": 50,
      "intensidade": 6,
      "carga": 36,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 1,
        "nome": "Carlos Henrique",
        "posicao": "G",
        "ativo": true
      }
    },
    {
      "id": 6,
      "codigo": "TR-006",
      "jogadorId": 4,
      "dataTreino": "2026-10-08",
      "tipo": "T",
      "duracaoMin": 60,
      "intensidade": 5,
      "carga": 36,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 8,
      "codigo": "TR-008",
      "jogadorId": 2,
      "dataTreino": "2026-10-08",
      "tipo": "E",
      "duracaoMin": 80,
      "intensidade": 10,
      "carga": 80,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 2,
        "nome": "Bruno Alves",
        "posicao": "Z",
        "ativo": true
      }
    },
    {
      "id": 3,
      "codigo": "TR-003",
      "jogadorId": 3,
      "dataTreino": "2026-10-09",
      "tipo": "F",
      "duracaoMin": 50,
      "intensidade": 9,
      "carga": 67.5,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 10,
      "codigo": "TR-010",
      "jogadorId": 1,
      "dataTreino": "2026-10-09",
      "tipo": "E",
      "duracaoMin": 40,
      "intensidade": 5,
      "carga": 20,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 1,
        "nome": "Carlos Henrique",
        "posicao": "G",
        "ativo": true
      }
    },
    {
      "id": 13,
      "codigo": "TR-013",
      "jogadorId": 6,
      "dataTreino": "2026-10-10",
      "tipo": "E",
      "duracaoMin": 60,
      "intensidade": 4,
      "carga": 24,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 6,
        "nome": "Mateus Rocha",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 12,
      "codigo": "TR-012",
      "jogadorId": 5,
      "dataTreino": "2026-10-11",
      "tipo": "T",
      "duracaoMin": 100,
      "intensidade": 9,
      "carga": 108,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 5,
        "nome": "Lucas Pereira",
        "posicao": "Z",
        "ativo": true
      }
    },
    {
      "id": 14,
      "codigo": "TR-014",
      "jogadorId": 7,
      "dataTreino": "2026-10-12",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 7,
      "carga": 63,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 7,
        "nome": "Pedro Santos",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 17,
      "codigo": "TR-017",
      "jogadorId": 8,
      "dataTreino": "2026-10-13",
      "tipo": "T",
      "duracaoMin": 60,
      "intensidade": 6,
      "carga": 43.2,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 8,
        "nome": "Thiago Martins",
        "posicao": "G",
        "ativo": true
      }
    },
    {
      "id": 20,
      "codigo": "TR-020",
      "jogadorId": 4,
      "dataTreino": "2026-10-13",
      "tipo": "F",
      "duracaoMin": 90,
      "intensidade": 10,
      "carga": 135,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 15,
      "codigo": "TR-015",
      "jogadorId": 7,
      "dataTreino": "2026-10-14",
      "tipo": "T",
      "duracaoMin": 80,
      "intensidade": 8,
      "carga": 76.8,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 7,
        "nome": "Pedro Santos",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 19,
      "codigo": "TR-019",
      "jogadorId": 3,
      "dataTreino": "2026-10-14",
      "tipo": "T",
      "duracaoMin": 40,
      "intensidade": 5,
      "carga": 24,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 18,
      "codigo": "TR-018",
      "jogadorId": 8,
      "dataTreino": "2026-10-15",
      "tipo": "E",
      "duracaoMin": 40,
      "intensidade": 3,
      "carga": 12,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 8,
        "nome": "Thiago Martins",
        "posicao": "G",
        "ativo": true
      }
    },
    {
      "id": 16,
      "codigo": "TR-016",
      "jogadorId": 7,
      "dataTreino": "2026-10-16",
      "tipo": "E",
      "duracaoMin": 90,
      "intensidade": 6,
      "carga": 54,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 7,
        "nome": "Pedro Santos",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 21,
      "codigo": "TR-021",
      "jogadorId": 4,
      "dataTreino": "2026-10-17",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 9,
      "carga": 81,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 22,
      "codigo": "TR-022",
      "jogadorId": 6,
      "dataTreino": "2026-10-18",
      "tipo": "E",
      "duracaoMin": 60,
      "intensidade": 4,
      "carga": 24,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 6,
        "nome": "Mateus Rocha",
        "posicao": "M",
        "ativo": true
      }
    }
  ]
}
```

### 4.2. Filtrar por tipo e período (físicos da semana 05/10 a 11/10) ✅

**Requisição:** `GET /treinos?tipo=F&dataInicio=2026-10-05&dataFim=2026-10-11`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "total": 5,
  "treinos": [
    {
      "id": 1,
      "codigo": "TR-001",
      "jogadorId": 3,
      "dataTreino": "2026-10-05",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 8,
      "carga": 72,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 4,
      "codigo": "TR-004",
      "jogadorId": 4,
      "dataTreino": "2026-10-05",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 8,
      "carga": 72,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 7,
      "codigo": "TR-007",
      "jogadorId": 2,
      "dataTreino": "2026-10-06",
      "tipo": "F",
      "duracaoMin": 80,
      "intensidade": 10,
      "carga": 120,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 2,
        "nome": "Bruno Alves",
        "posicao": "Z",
        "ativo": true
      }
    },
    {
      "id": 11,
      "codigo": "TR-011",
      "jogadorId": 5,
      "dataTreino": "2026-10-06",
      "tipo": "F",
      "duracaoMin": 70,
      "intensidade": 9,
      "carga": 94.5,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 5,
        "nome": "Lucas Pereira",
        "posicao": "Z",
        "ativo": true
      }
    },
    {
      "id": 3,
      "codigo": "TR-003",
      "jogadorId": 3,
      "dataTreino": "2026-10-09",
      "tipo": "F",
      "duracaoMin": 50,
      "intensidade": 9,
      "carga": 67.5,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    }
  ]
}
```

### 4.3. Filtrar por atleta ✅

**Requisição:** `GET /treinos?jogadorId=4`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "total": 5,
  "treinos": [
    {
      "id": 4,
      "codigo": "TR-004",
      "jogadorId": 4,
      "dataTreino": "2026-10-05",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 8,
      "carga": 72,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 5,
      "codigo": "TR-005",
      "jogadorId": 4,
      "dataTreino": "2026-10-06",
      "tipo": "E",
      "duracaoMin": 80,
      "intensidade": 6,
      "carga": 48,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 6,
      "codigo": "TR-006",
      "jogadorId": 4,
      "dataTreino": "2026-10-08",
      "tipo": "T",
      "duracaoMin": 60,
      "intensidade": 5,
      "carga": 36,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 20,
      "codigo": "TR-020",
      "jogadorId": 4,
      "dataTreino": "2026-10-13",
      "tipo": "F",
      "duracaoMin": 90,
      "intensidade": 10,
      "carga": 135,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    },
    {
      "id": 21,
      "codigo": "TR-021",
      "jogadorId": 4,
      "dataTreino": "2026-10-17",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 9,
      "carga": 81,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 4,
        "nome": "André Lima",
        "posicao": "A",
        "ativo": true
      }
    }
  ]
}
```

### 4.4. Filtrar por posição do atleta (include com where) ✅

**Requisição:** `GET /treinos?posicao=G`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "total": 4,
  "treinos": [
    {
      "id": 9,
      "codigo": "TR-009",
      "jogadorId": 1,
      "dataTreino": "2026-10-07",
      "tipo": "T",
      "duracaoMin": 50,
      "intensidade": 6,
      "carga": 36,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 1,
        "nome": "Carlos Henrique",
        "posicao": "G",
        "ativo": true
      }
    },
    {
      "id": 10,
      "codigo": "TR-010",
      "jogadorId": 1,
      "dataTreino": "2026-10-09",
      "tipo": "E",
      "duracaoMin": 40,
      "intensidade": 5,
      "carga": 20,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 1,
        "nome": "Carlos Henrique",
        "posicao": "G",
        "ativo": true
      }
    },
    {
      "id": 17,
      "codigo": "TR-017",
      "jogadorId": 8,
      "dataTreino": "2026-10-13",
      "tipo": "T",
      "duracaoMin": 60,
      "intensidade": 6,
      "carga": 43.2,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 8,
        "nome": "Thiago Martins",
        "posicao": "G",
        "ativo": true
      }
    },
    {
      "id": 18,
      "codigo": "TR-018",
      "jogadorId": 8,
      "dataTreino": "2026-10-15",
      "tipo": "E",
      "duracaoMin": 40,
      "intensidade": 3,
      "carga": 12,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 8,
        "nome": "Thiago Martins",
        "posicao": "G",
        "ativo": true
      }
    }
  ]
}
```

### 4.5. Filtro com tipo inválido ✅

**Requisição:** `GET /treinos?tipo=X`  
**Status esperado:** 400 · **Status recebido:** 400

Resposta:
```json
{
  "erro": "Tipo inválido. Use F, T ou E"
}
```

### 4.6. Treinos do atleta ✅

**Requisição:** `GET /treinos/jogador/3`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "jogador": {
    "id": 3,
    "nome": "Diego Souza",
    "posicao": "M",
    "ativo": true
  },
  "total": 4,
  "treinos": [
    {
      "id": 1,
      "codigo": "TR-001",
      "jogadorId": 3,
      "dataTreino": "2026-10-05",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 8,
      "carga": 72,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 2,
      "codigo": "TR-002",
      "jogadorId": 3,
      "dataTreino": "2026-10-07",
      "tipo": "T",
      "duracaoMin": 90,
      "intensidade": 7,
      "carga": 75.6,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 3,
      "codigo": "TR-003",
      "jogadorId": 3,
      "dataTreino": "2026-10-09",
      "tipo": "F",
      "duracaoMin": 50,
      "intensidade": 9,
      "carga": 67.5,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    },
    {
      "id": 19,
      "codigo": "TR-019",
      "jogadorId": 3,
      "dataTreino": "2026-10-14",
      "tipo": "T",
      "duracaoMin": 40,
      "intensidade": 5,
      "carga": 24,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "ativo": true
      }
    }
  ]
}
```

### 4.7. Treinos de atleta inexistente ✅

**Requisição:** `GET /treinos/jogador/999`  
**Status esperado:** 404 · **Status recebido:** 404

Resposta:
```json
{
  "erro": "Jogador não encontrado"
}
```

## 5. Treinos - registro, cálculo de carga e validações

### 5.1. Registrar treino e conferir a carga calculada ✅

**Validação manual:** treino físico (F, multiplicador 1,5), 60 minutos, intensidade 8 → (60 / 10) × 8 × 1,5 = 6 × 8 × 1,5 = **72 pontos**. A API deve devolver `carga: 72`.

**Requisição:** `POST /treinos`  
**Status esperado:** 201 · **Status recebido:** 201

Corpo enviado:
```json
{
  "codigo": "TR-T01",
  "jogadorId": 10,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 8
}
```
Resposta:
```json
{
  "id": 23,
  "codigo": "TR-T01",
  "jogadorId": 10,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 8,
  "carga": 72,
  "createdAt": "2026-11-08T23:10:09.000Z",
  "updatedAt": "2026-11-08T23:10:09.000Z",
  "jogador": {
    "id": 10,
    "nome": "Rafael Gomes Filho",
    "posicao": "M",
    "ativo": true
  }
}
```

### 5.2. Código duplicado ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 409 · **Status recebido:** 409

Corpo enviado:
```json
{
  "codigo": "TR-001",
  "jogadorId": 1,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 8
}
```
Resposta:
```json
{
  "erro": "Já existe um treino com o código \"TR-001\""
}
```

### 5.3. Intensidade acima de 10 ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 1,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 11
}
```
Resposta:
```json
{
  "erro": "Dados do treino inválidos",
  "detalhes": [
    "A intensidade deve estar entre 1 e 10"
  ]
}
```

### 5.4. Intensidade zero ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 1,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 0
}
```
Resposta:
```json
{
  "erro": "Dados do treino inválidos",
  "detalhes": [
    "A intensidade deve estar entre 1 e 10"
  ]
}
```

### 5.5. Duração zero ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 1,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 0,
  "intensidade": 8
}
```
Resposta:
```json
{
  "erro": "Dados do treino inválidos",
  "detalhes": [
    "A duração deve ser positiva (maior que zero)"
  ]
}
```

### 5.6. Duração negativa ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 1,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": -30,
  "intensidade": 8
}
```
Resposta:
```json
{
  "erro": "Dados do treino inválidos",
  "detalhes": [
    "A duração deve ser positiva (maior que zero)"
  ]
}
```

### 5.7. Tipo inválido ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 1,
  "dataTreino": "2026-10-19",
  "tipo": "X",
  "duracaoMin": 60,
  "intensidade": 8
}
```
Resposta:
```json
{
  "erro": "Dados do treino inválidos",
  "detalhes": [
    "Tipo inválido. Use F (Físico), T (Técnico) ou E (Estratégico)"
  ]
}
```

### 5.8. Vários campos inválidos ao mesmo tempo ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "",
  "jogadorId": 1,
  "dataTreino": "2026-13-40",
  "tipo": "Z",
  "duracaoMin": -1,
  "intensidade": 50
}
```
Resposta:
```json
{
  "erro": "Dados do treino inválidos",
  "detalhes": [
    "O código é obrigatório",
    "A data do treino (dataTreino) é obrigatória no formato AAAA-MM-DD",
    "A duração deve ser positiva (maior que zero)",
    "A intensidade deve estar entre 1 e 10",
    "Tipo inválido. Use F (Físico), T (Técnico) ou E (Estratégico)"
  ]
}
```

### 5.9. Atleta inexistente ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 404 · **Status recebido:** 404

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 999,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 8
}
```
Resposta:
```json
{
  "erro": "Jogador não encontrado"
}
```

### 5.10. Atleta inativo (seed: Felipe Costa, id 9) ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 9,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 8
}
```
Resposta:
```json
{
  "erro": "Não é possível registrar treino para um jogador inativo"
}
```

### 5.11. JSON malformado ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{"codigo": "TR-T03", 
```
Resposta:
```json
{
  "erro": "JSON inválido no corpo da requisição"
}
```

## 6. Desativação preserva o histórico

### 6.1. Desativar o atleta cadastrado no teste ✅

**Requisição:** `PATCH /jogadores/10/desativar`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "mensagem": "Jogador desativado com sucesso. O histórico de treinos foi preservado",
  "jogador": {
    "id": 10,
    "nome": "Rafael Gomes Filho",
    "posicao": "M",
    "ativo": false,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.966Z"
  }
}
```

### 6.2. Registrar treino para o atleta recém-desativado ✅

**Requisição:** `POST /treinos`  
**Status esperado:** 400 · **Status recebido:** 400

Corpo enviado:
```json
{
  "codigo": "TR-T02",
  "jogadorId": 10,
  "dataTreino": "2026-10-19",
  "tipo": "F",
  "duracaoMin": 60,
  "intensidade": 8
}
```
Resposta:
```json
{
  "erro": "Não é possível registrar treino para um jogador inativo"
}
```

### 6.3. Histórico do atleta desativado continua disponível ✅

**Requisição:** `GET /treinos/jogador/10`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "jogador": {
    "id": 10,
    "nome": "Rafael Gomes Filho",
    "posicao": "M",
    "ativo": false
  },
  "total": 1,
  "treinos": [
    {
      "id": 23,
      "codigo": "TR-T01",
      "jogadorId": 10,
      "dataTreino": "2026-10-19",
      "tipo": "F",
      "duracaoMin": 60,
      "intensidade": 8,
      "carga": 72,
      "createdAt": "2026-11-08T23:10:09.000Z",
      "updatedAt": "2026-11-08T23:10:09.000Z",
      "jogador": {
        "id": 10,
        "nome": "Rafael Gomes Filho",
        "posicao": "M",
        "ativo": false
      }
    }
  ]
}
```

## 7. Relatórios semanais

### 7.1. Semana 1 (data=2026-10-05 → 05/10 a 11/10) ✅

Esperado: 13 treinos; Diego (215,1) e Lucas (202,5) em risco; Bruno com exatamente 200 **não** é risco (empate com o limite); maior carga Diego; menor carga Mateus (24); Pedro e Thiago sem treino ficam fora dos rankings.

**Requisição:** `GET /relatorios/semanal?data=2026-10-05`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "semana": {
    "referencia": "2026-10-05",
    "inicio": "2026-10-05",
    "fim": "2026-10-11"
  },
  "cargaMaximaSemanal": 200,
  "avisos": [],
  "criterios": {
    "semana": "A semana vai de segunda-feira a domingo e é aquela que contém a data informada.",
    "rankings": "Maior e menor carga consideram apenas jogadores com pelo menos um treino na semana. Jogadores sem treino na semana não aparecem nos rankings.",
    "empates": "Em caso de empate na maior ou menor carga, todos os jogadores empatados são listados (empate = true).",
    "risco": "RISCO DE SOBRECARGA somente quando a carga semanal é estritamente maior que a carga máxima configurada. Carga igual ao limite NÃO é risco.",
    "semTreinos": "Semanas sem treinos retornam totais zerados, listas vazias e rankings nulos (HTTP 200)."
  },
  "totalTreinos": 13,
  "jogadoresComTreino": 6,
  "porJogador": [
    {
      "jogadorId": 3,
      "nome": "Diego Souza",
      "posicao": "M",
      "ativo": true,
      "cargaSemanal": 215.1,
      "quantidadeTreinos": 3,
      "situacao": "RISCO DE SOBRECARGA",
      "emRisco": true
    },
    {
      "jogadorId": 5,
      "nome": "Lucas Pereira",
      "posicao": "Z",
      "ativo": true,
      "cargaSemanal": 202.5,
      "quantidadeTreinos": 2,
      "situacao": "RISCO DE SOBRECARGA",
      "emRisco": true
    },
    {
      "jogadorId": 2,
      "nome": "Bruno Alves",
      "posicao": "Z",
      "ativo": true,
      "cargaSemanal": 200,
      "quantidadeTreinos": 2,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    },
    {
      "jogadorId": 4,
      "nome": "André Lima",
      "posicao": "A",
      "ativo": true,
      "cargaSemanal": 156,
      "quantidadeTreinos": 3,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    },
    {
      "jogadorId": 1,
      "nome": "Carlos Henrique",
      "posicao": "G",
      "ativo": true,
      "cargaSemanal": 56,
      "quantidadeTreinos": 2,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    },
    {
      "jogadorId": 6,
      "nome": "Mateus Rocha",
      "posicao": "M",
      "ativo": true,
      "cargaSemanal": 24,
      "quantidadeTreinos": 1,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    }
  ],
  "maiorCargaSemanal": {
    "cargaSemanal": 215.1,
    "empate": false,
    "jogadores": [
      {
        "jogadorId": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "cargaSemanal": 215.1,
        "quantidadeTreinos": 3
      }
    ]
  },
  "menorCargaSemanal": {
    "cargaSemanal": 24,
    "empate": false,
    "jogadores": [
      {
        "jogadorId": 6,
        "nome": "Mateus Rocha",
        "posicao": "M",
        "cargaSemanal": 24,
        "quantidadeTreinos": 1
      }
    ]
  },
  "jogadoresEmRisco": {
    "quantidade": 2,
    "jogadores": [
      {
        "jogadorId": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "cargaSemanal": 215.1,
        "excedente": 15.1
      },
      {
        "jogadorId": 5,
        "nome": "Lucas Pereira",
        "posicao": "Z",
        "cargaSemanal": 202.5,
        "excedente": 2.5
      }
    ]
  },
  "mediaPorTipo": [
    {
      "tipo": "F",
      "descricao": "Físico",
      "quantidadeTreinos": 5,
      "cargaMedia": 85.2
    },
    {
      "tipo": "T",
      "descricao": "Técnico",
      "quantidadeTreinos": 4,
      "cargaMedia": 63.9
    },
    {
      "tipo": "E",
      "descricao": "Estratégico",
      "quantidadeTreinos": 4,
      "cargaMedia": 43
    }
  ],
  "porPosicao": [
    {
      "posicao": "G",
      "descricao": "Goleiro",
      "quantidadeTreinos": 2,
      "cargaMediaPorSessao": 28
    },
    {
      "posicao": "Z",
      "descricao": "Zagueiro",
      "quantidadeTreinos": 4,
      "cargaMediaPorSessao": 100.63
    },
    {
      "posicao": "M",
      "descricao": "Meio-campo",
      "quantidadeTreinos": 4,
      "cargaMediaPorSessao": 59.78
    },
    {
      "posicao": "A",
      "descricao": "Atacante",
      "quantidadeTreinos": 3,
      "cargaMediaPorSessao": 52
    }
  ]
}
```

### 7.2. Semana 2 (data=2026-10-14 → 12/10 a 18/10) ✅

Esperado: 9 treinos (o treino TR-T01 de 19/10 fica fora); André (216) em risco; menor carga com **empate** entre Diego e Mateus (24).

**Requisição:** `GET /relatorios/semanal?data=2026-10-14`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "semana": {
    "referencia": "2026-10-14",
    "inicio": "2026-10-12",
    "fim": "2026-10-18"
  },
  "cargaMaximaSemanal": 200,
  "avisos": [],
  "criterios": {
    "semana": "A semana vai de segunda-feira a domingo e é aquela que contém a data informada.",
    "rankings": "Maior e menor carga consideram apenas jogadores com pelo menos um treino na semana. Jogadores sem treino na semana não aparecem nos rankings.",
    "empates": "Em caso de empate na maior ou menor carga, todos os jogadores empatados são listados (empate = true).",
    "risco": "RISCO DE SOBRECARGA somente quando a carga semanal é estritamente maior que a carga máxima configurada. Carga igual ao limite NÃO é risco.",
    "semTreinos": "Semanas sem treinos retornam totais zerados, listas vazias e rankings nulos (HTTP 200)."
  },
  "totalTreinos": 9,
  "jogadoresComTreino": 5,
  "porJogador": [
    {
      "jogadorId": 4,
      "nome": "André Lima",
      "posicao": "A",
      "ativo": true,
      "cargaSemanal": 216,
      "quantidadeTreinos": 2,
      "situacao": "RISCO DE SOBRECARGA",
      "emRisco": true
    },
    {
      "jogadorId": 7,
      "nome": "Pedro Santos",
      "posicao": "A",
      "ativo": true,
      "cargaSemanal": 193.8,
      "quantidadeTreinos": 3,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    },
    {
      "jogadorId": 8,
      "nome": "Thiago Martins",
      "posicao": "G",
      "ativo": true,
      "cargaSemanal": 55.2,
      "quantidadeTreinos": 2,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    },
    {
      "jogadorId": 3,
      "nome": "Diego Souza",
      "posicao": "M",
      "ativo": true,
      "cargaSemanal": 24,
      "quantidadeTreinos": 1,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    },
    {
      "jogadorId": 6,
      "nome": "Mateus Rocha",
      "posicao": "M",
      "ativo": true,
      "cargaSemanal": 24,
      "quantidadeTreinos": 1,
      "situacao": "DENTRO DO LIMITE",
      "emRisco": false
    }
  ],
  "maiorCargaSemanal": {
    "cargaSemanal": 216,
    "empate": false,
    "jogadores": [
      {
        "jogadorId": 4,
        "nome": "André Lima",
        "posicao": "A",
        "cargaSemanal": 216,
        "quantidadeTreinos": 2
      }
    ]
  },
  "menorCargaSemanal": {
    "cargaSemanal": 24,
    "empate": true,
    "jogadores": [
      {
        "jogadorId": 3,
        "nome": "Diego Souza",
        "posicao": "M",
        "cargaSemanal": 24,
        "quantidadeTreinos": 1
      },
      {
        "jogadorId": 6,
        "nome": "Mateus Rocha",
        "posicao": "M",
        "cargaSemanal": 24,
        "quantidadeTreinos": 1
      }
    ]
  },
  "jogadoresEmRisco": {
    "quantidade": 1,
    "jogadores": [
      {
        "jogadorId": 4,
        "nome": "André Lima",
        "posicao": "A",
        "cargaSemanal": 216,
        "excedente": 16
      }
    ]
  },
  "mediaPorTipo": [
    {
      "tipo": "F",
      "descricao": "Físico",
      "quantidadeTreinos": 3,
      "cargaMedia": 93
    },
    {
      "tipo": "T",
      "descricao": "Técnico",
      "quantidadeTreinos": 3,
      "cargaMedia": 48
    },
    {
      "tipo": "E",
      "descricao": "Estratégico",
      "quantidadeTreinos": 3,
      "cargaMedia": 30
    }
  ],
  "porPosicao": [
    {
      "posicao": "G",
      "descricao": "Goleiro",
      "quantidadeTreinos": 2,
      "cargaMediaPorSessao": 27.6
    },
    {
      "posicao": "Z",
      "descricao": "Zagueiro",
      "quantidadeTreinos": 0,
      "cargaMediaPorSessao": null
    },
    {
      "posicao": "M",
      "descricao": "Meio-campo",
      "quantidadeTreinos": 2,
      "cargaMediaPorSessao": 24
    },
    {
      "posicao": "A",
      "descricao": "Atacante",
      "quantidadeTreinos": 5,
      "cargaMediaPorSessao": 81.96
    }
  ]
}
```

### 7.3. Semana sem treinos (data=2026-11-02) ✅

**Requisição:** `GET /relatorios/semanal?data=2026-11-02`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "semana": {
    "referencia": "2026-11-02",
    "inicio": "2026-11-02",
    "fim": "2026-11-08"
  },
  "cargaMaximaSemanal": 200,
  "avisos": [
    "Nenhum treino registrado nesta semana."
  ],
  "criterios": {
    "semana": "A semana vai de segunda-feira a domingo e é aquela que contém a data informada.",
    "rankings": "Maior e menor carga consideram apenas jogadores com pelo menos um treino na semana. Jogadores sem treino na semana não aparecem nos rankings.",
    "empates": "Em caso de empate na maior ou menor carga, todos os jogadores empatados são listados (empate = true).",
    "risco": "RISCO DE SOBRECARGA somente quando a carga semanal é estritamente maior que a carga máxima configurada. Carga igual ao limite NÃO é risco.",
    "semTreinos": "Semanas sem treinos retornam totais zerados, listas vazias e rankings nulos (HTTP 200)."
  },
  "totalTreinos": 0,
  "jogadoresComTreino": 0,
  "porJogador": [],
  "maiorCargaSemanal": null,
  "menorCargaSemanal": null,
  "jogadoresEmRisco": {
    "quantidade": 0,
    "jogadores": []
  },
  "mediaPorTipo": [
    {
      "tipo": "F",
      "descricao": "Físico",
      "quantidadeTreinos": 0,
      "cargaMedia": null
    },
    {
      "tipo": "T",
      "descricao": "Técnico",
      "quantidadeTreinos": 0,
      "cargaMedia": null
    },
    {
      "tipo": "E",
      "descricao": "Estratégico",
      "quantidadeTreinos": 0,
      "cargaMedia": null
    }
  ],
  "porPosicao": [
    {
      "posicao": "G",
      "descricao": "Goleiro",
      "quantidadeTreinos": 0,
      "cargaMediaPorSessao": null
    },
    {
      "posicao": "Z",
      "descricao": "Zagueiro",
      "quantidadeTreinos": 0,
      "cargaMediaPorSessao": null
    },
    {
      "posicao": "M",
      "descricao": "Meio-campo",
      "quantidadeTreinos": 0,
      "cargaMediaPorSessao": null
    },
    {
      "posicao": "A",
      "descricao": "Atacante",
      "quantidadeTreinos": 0,
      "cargaMediaPorSessao": null
    }
  ]
}
```

### 7.4. Relatório sem o parâmetro data ✅

**Requisição:** `GET /relatorios/semanal`  
**Status esperado:** 400 · **Status recebido:** 400

Resposta:
```json
{
  "erro": "Parâmetro \"data\" inválido. Use o formato AAAA-MM-DD (ex.: 2026-10-05)"
}
```

### 7.5. Relatório com data inexistente ✅

**Requisição:** `GET /relatorios/semanal?data=2026-02-30`  
**Status esperado:** 400 · **Status recebido:** 400

Resposta:
```json
{
  "erro": "Parâmetro \"data\" inválido. Use o formato AAAA-MM-DD (ex.: 2026-10-05)"
}
```

## 8. Exclusão de treino

### 8.1. Excluir treino pelo código ✅

**Requisição:** `DELETE /treinos/TR-T01`  
**Status esperado:** 200 · **Status recebido:** 200

Resposta:
```json
{
  "mensagem": "Treino excluído com sucesso",
  "treino": {
    "id": 23,
    "codigo": "TR-T01",
    "jogadorId": 10,
    "dataTreino": "2026-10-19",
    "tipo": "F",
    "duracaoMin": 60,
    "intensidade": 8,
    "carga": 72,
    "createdAt": "2026-11-08T23:10:09.000Z",
    "updatedAt": "2026-11-08T23:10:09.000Z"
  }
}
```

### 8.2. Excluir treino inexistente ✅

**Requisição:** `DELETE /treinos/TR-T01`  
**Status esperado:** 404 · **Status recebido:** 404

Resposta:
```json
{
  "erro": "Treino com código \"TR-T01\" não encontrado"
}
```

## 9. Rota inexistente

### 9.1. Rota não mapeada ✅

**Requisição:** `GET /nao-existe`  
**Status esperado:** 404 · **Status recebido:** 404

Resposta:
```json
{
  "erro": "Rota GET /nao-existe não encontrada"
}
```

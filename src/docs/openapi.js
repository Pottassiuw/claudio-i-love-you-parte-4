// Especificação OpenAPI 3.0 usada pelo Swagger UI em /api-docs

const erro = (descricao, exemplo) => ({
  description: descricao,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' }, example: exemplo } },
});

const ERRO_500 = erro('Erro interno (sem detalhes do banco)', { erro: 'Erro interno ao acessar o banco de dados. Tente novamente mais tarde' });

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
  example: 3,
};

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'API - Sistema de Treinos Esportivos com Carga e Risco de Lesão',
    version: '1.0.0',
    description:
      'API REST (Node.js + Express + Sequelize + MySQL) para cadastro de jogadores, registro de treinos, ' +
      'cálculo automático de carga e relatório semanal de performance.\n\n' +
      '**Carga** = (duração em minutos / 10) × intensidade × multiplicador (F = 1,5 · T = 1,2 · E = 1,0).\n\n' +
      '**Risco de sobrecarga**: carga semanal (segunda a domingo) **estritamente maior** que a carga máxima configurada.\n\n' +
      '_O indicador de risco é exclusivamente didático e não corresponde a diagnóstico ou predição clínica de lesão._',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  tags: [
    { name: 'Jogadores', description: 'Cadastro e gerenciamento de atletas' },
    { name: 'Configuração', description: 'Limite máximo de carga semanal' },
    { name: 'Treinos', description: 'Registro e consulta de sessões de treino' },
    { name: 'Relatórios', description: 'Relatório semanal de performance' },
    { name: 'Saúde', description: 'Status da API e do banco' },
  ],
  paths: {
    '/jogadores': {
      post: {
        tags: ['Jogadores'],
        summary: 'Cadastrar atleta',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JogadorInput' },
              example: { nome: 'Rafael Gomes', posicao: 'A' },
            },
          },
        },
        responses: {
          201: { description: 'Jogador criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogador' } } } },
          400: erro('Dados inválidos', { erro: 'Dados inválidos', detalhes: ['Posição inválida. Use G, Z, M ou A'] }),
          500: ERRO_500,
        },
      },
      get: {
        tags: ['Jogadores'],
        summary: 'Listar atletas',
        parameters: [
          { name: 'posicao', in: 'query', schema: { type: 'string', enum: ['G', 'Z', 'M', 'A'] } },
          { name: 'ativo', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          200: { description: 'Lista de jogadores', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Jogador' } } } } },
          400: erro('Filtro inválido', { erro: 'Posição inválida. Use G, Z, M ou A' }),
          500: ERRO_500,
        },
      },
    },
    '/jogadores/{id}': {
      get: {
        tags: ['Jogadores'],
        summary: 'Consultar atleta',
        parameters: [idParam],
        responses: {
          200: { description: 'Jogador', content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogador' } } } },
          400: erro('Id inválido', { erro: 'O id do jogador deve ser um número inteiro positivo' }),
          404: erro('Não encontrado', { erro: 'Jogador não encontrado' }),
          500: ERRO_500,
        },
      },
      put: {
        tags: ['Jogadores'],
        summary: 'Atualizar atleta',
        parameters: [idParam],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JogadorUpdate' },
              example: { nome: 'Diego Souza Jr.', posicao: 'M' },
            },
          },
        },
        responses: {
          200: { description: 'Jogador atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Jogador' } } } },
          400: erro('Dados inválidos', { erro: 'Dados inválidos', detalhes: ['O nome deve ter entre 2 e 100 caracteres'] }),
          404: erro('Não encontrado', { erro: 'Jogador não encontrado' }),
          500: ERRO_500,
        },
      },
    },
    '/jogadores/{id}/desativar': {
      patch: {
        tags: ['Jogadores'],
        summary: 'Desativar atleta (exclusão lógica: ativo = false, histórico preservado)',
        parameters: [idParam],
        responses: {
          200: {
            description: 'Jogador desativado',
            content: {
              'application/json': {
                example: {
                  mensagem: 'Jogador desativado com sucesso. O histórico de treinos foi preservado',
                  jogador: { id: 3, nome: 'Diego Souza', posicao: 'M', ativo: false },
                },
              },
            },
          },
          404: erro('Não encontrado', { erro: 'Jogador não encontrado' }),
          500: ERRO_500,
        },
      },
    },
    '/configuracao': {
      get: {
        tags: ['Configuração'],
        summary: 'Consultar limite de carga semanal',
        responses: {
          200: { description: 'Configuração atual', content: { 'application/json': { schema: { $ref: '#/components/schemas/Configuracao' } } } },
          404: erro('Ainda não configurado', { erro: 'Nenhum limite de carga semanal foi configurado ainda. Use PUT /configuracao' }),
          500: ERRO_500,
        },
      },
      put: {
        tags: ['Configuração'],
        summary: 'Cadastrar (201) ou atualizar (200) limite de carga semanal',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConfiguracaoInput' },
              example: { cargaMaximaSemanal: 200, dataVigencia: '2026-10-01' },
            },
          },
        },
        responses: {
          200: { description: 'Configuração atualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Configuracao' } } } },
          201: { description: 'Configuração criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Configuracao' } } } },
          400: erro('Valor inválido', { erro: 'cargaMaximaSemanal deve ser maior que zero' }),
          500: ERRO_500,
        },
      },
    },
    '/treinos': {
      post: {
        tags: ['Treinos'],
        summary: 'Registrar sessão (a carga é calculada pela API)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TreinoInput' },
              examples: {
                valido: { summary: 'Treino físico 60 min, intensidade 8 (carga 72)', value: { codigo: 'TR-100', jogadorId: 1, dataTreino: '2026-10-19', tipo: 'F', duracaoMin: 60, intensidade: 8 } },
                intensidadeInvalida: { summary: 'Intensidade 11 (400)', value: { codigo: 'TR-101', jogadorId: 1, dataTreino: '2026-10-19', tipo: 'T', duracaoMin: 60, intensidade: 11 } },
                duracaoZero: { summary: 'Duração 0 (400)', value: { codigo: 'TR-102', jogadorId: 1, dataTreino: '2026-10-19', tipo: 'E', duracaoMin: 0, intensidade: 5 } },
                codigoDuplicado: { summary: 'Código já existente (409)', value: { codigo: 'TR-001', jogadorId: 1, dataTreino: '2026-10-19', tipo: 'F', duracaoMin: 60, intensidade: 8 } },
                jogadorInexistente: { summary: 'Jogador inexistente (404)', value: { codigo: 'TR-103', jogadorId: 999, dataTreino: '2026-10-19', tipo: 'F', duracaoMin: 60, intensidade: 8 } },
                jogadorInativo: { summary: 'Jogador inativo (400)', value: { codigo: 'TR-104', jogadorId: 9, dataTreino: '2026-10-19', tipo: 'F', duracaoMin: 60, intensidade: 8 } },
              },
            },
          },
        },
        responses: {
          201: { description: 'Treino registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Treino' } } } },
          400: erro('Dados inválidos ou jogador inativo', { erro: 'Dados do treino inválidos', detalhes: ['A intensidade deve estar entre 1 e 10'] }),
          404: erro('Jogador não encontrado', { erro: 'Jogador não encontrado' }),
          409: erro('Código duplicado', { erro: 'Já existe um treino com o código "TR-001"' }),
          500: ERRO_500,
        },
      },
      get: {
        tags: ['Treinos'],
        summary: 'Listar e filtrar sessões (inclui dados do jogador)',
        parameters: [
          { name: 'jogadorId', in: 'query', schema: { type: 'integer' } },
          { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['F', 'T', 'E'] } },
          { name: 'posicao', in: 'query', schema: { type: 'string', enum: ['G', 'Z', 'M', 'A'] } },
          { name: 'dataInicio', in: 'query', schema: { type: 'string', format: 'date' }, example: '2026-10-05' },
          { name: 'dataFim', in: 'query', schema: { type: 'string', format: 'date' }, example: '2026-10-11' },
        ],
        responses: {
          200: {
            description: 'Treinos encontrados',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { total: { type: 'integer' }, treinos: { type: 'array', items: { $ref: '#/components/schemas/Treino' } } } },
              },
            },
          },
          400: erro('Filtro inválido', { erro: 'Tipo inválido. Use F, T ou E' }),
          500: ERRO_500,
        },
      },
    },
    '/treinos/jogador/{id}': {
      get: {
        tags: ['Treinos'],
        summary: 'Treinos do atleta',
        parameters: [
          idParam,
          { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['F', 'T', 'E'] } },
          { name: 'dataInicio', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'dataFim', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          200: { description: 'Jogador e seus treinos' },
          400: erro('Id inválido', { erro: 'O id do jogador deve ser um número inteiro positivo' }),
          404: erro('Jogador não encontrado', { erro: 'Jogador não encontrado' }),
          500: ERRO_500,
        },
      },
    },
    '/treinos/{codigo}': {
      delete: {
        tags: ['Treinos'],
        summary: 'Excluir sessão pelo código',
        parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' }, example: 'TR-100' }],
        responses: {
          200: { description: 'Treino excluído' },
          404: erro('Não encontrado', { erro: 'Treino com código "TR-999" não encontrado' }),
          500: ERRO_500,
        },
      },
    },
    '/relatorios/semanal': {
      get: {
        tags: ['Relatórios'],
        summary: 'Consolidar a semana (segunda a domingo) que contém a data informada',
        parameters: [
          { name: 'data', in: 'query', required: true, schema: { type: 'string', format: 'date' }, example: '2026-10-05' },
        ],
        responses: {
          200: { description: 'Relatório semanal', content: { 'application/json': { schema: { $ref: '#/components/schemas/RelatorioSemanal' } } } },
          400: erro('Data ausente ou inválida', { erro: 'Parâmetro "data" inválido. Use o formato AAAA-MM-DD (ex.: 2026-10-05)' }),
          500: ERRO_500,
        },
      },
    },
    '/saude': {
      get: {
        tags: ['Saúde'],
        summary: 'Verifica a conexão com o banco',
        responses: {
          200: { description: 'OK', content: { 'application/json': { example: { status: 'ok', banco: 'conectado' } } } },
          500: ERRO_500,
        },
      },
    },
  },
  components: {
    schemas: {
      Erro: {
        type: 'object',
        properties: { erro: { type: 'string' }, detalhes: { type: 'array', items: { type: 'string' } } },
      },
      JogadorInput: {
        type: 'object',
        required: ['nome', 'posicao'],
        properties: {
          nome: { type: 'string', minLength: 2, maxLength: 100 },
          posicao: { type: 'string', enum: ['G', 'Z', 'M', 'A'], description: 'G=Goleiro, Z=Zagueiro, M=Meio-campo, A=Atacante' },
          ativo: { type: 'boolean', default: true },
        },
      },
      JogadorUpdate: {
        type: 'object',
        properties: {
          nome: { type: 'string', minLength: 2, maxLength: 100 },
          posicao: { type: 'string', enum: ['G', 'Z', 'M', 'A'] },
          ativo: { type: 'boolean' },
        },
      },
      Jogador: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 3 },
          nome: { type: 'string', example: 'Diego Souza' },
          posicao: { type: 'string', enum: ['G', 'Z', 'M', 'A'], example: 'M' },
          ativo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TreinoInput: {
        type: 'object',
        required: ['codigo', 'jogadorId', 'dataTreino', 'tipo', 'duracaoMin', 'intensidade'],
        properties: {
          codigo: { type: 'string', example: 'TR-100' },
          jogadorId: { type: 'integer', example: 1 },
          dataTreino: { type: 'string', format: 'date', example: '2026-10-19' },
          tipo: { type: 'string', enum: ['F', 'T', 'E'], description: 'F=Físico (1,5), T=Técnico (1,2), E=Estratégico (1,0)' },
          duracaoMin: { type: 'integer', minimum: 1, example: 60 },
          intensidade: { type: 'integer', minimum: 1, maximum: 10, example: 8 },
        },
      },
      Treino: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 23 },
          codigo: { type: 'string', example: 'TR-100' },
          jogadorId: { type: 'integer', example: 1 },
          dataTreino: { type: 'string', format: 'date', example: '2026-10-19' },
          tipo: { type: 'string', enum: ['F', 'T', 'E'], example: 'F' },
          duracaoMin: { type: 'integer', example: 60 },
          intensidade: { type: 'integer', example: 8 },
          carga: { type: 'number', example: 72 },
          jogador: { type: 'object', properties: { id: { type: 'integer' }, nome: { type: 'string' }, posicao: { type: 'string' }, ativo: { type: 'boolean' } } },
        },
      },
      ConfiguracaoInput: {
        type: 'object',
        required: ['cargaMaximaSemanal'],
        properties: {
          cargaMaximaSemanal: { type: 'number', minimum: 0.01, example: 200 },
          dataVigencia: { type: 'string', format: 'date', nullable: true, example: '2026-10-01' },
        },
      },
      Configuracao: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          cargaMaximaSemanal: { type: 'number', example: 200 },
          dataVigencia: { type: 'string', format: 'date', nullable: true, example: '2026-10-01' },
        },
      },
      RelatorioSemanal: {
        type: 'object',
        properties: {
          semana: { type: 'object', example: { referencia: '2026-10-05', inicio: '2026-10-05', fim: '2026-10-11' } },
          cargaMaximaSemanal: { type: 'number', nullable: true, example: 200 },
          avisos: { type: 'array', items: { type: 'string' } },
          criterios: { type: 'object' },
          totalTreinos: { type: 'integer', example: 13 },
          jogadoresComTreino: { type: 'integer', example: 6 },
          porJogador: {
            type: 'array',
            items: {
              type: 'object',
              example: { jogadorId: 3, nome: 'Diego Souza', posicao: 'M', ativo: true, cargaSemanal: 215.1, quantidadeTreinos: 3, situacao: 'RISCO DE SOBRECARGA', emRisco: true },
            },
          },
          maiorCargaSemanal: { type: 'object', nullable: true },
          menorCargaSemanal: { type: 'object', nullable: true },
          jogadoresEmRisco: { type: 'object', example: { quantidade: 2, jogadores: [] } },
          mediaPorTipo: { type: 'array', items: { type: 'object', example: { tipo: 'F', descricao: 'Físico', quantidadeTreinos: 5, cargaMedia: 85.2 } } },
          porPosicao: { type: 'array', items: { type: 'object', example: { posicao: 'Z', descricao: 'Zagueiro', quantidadeTreinos: 4, cargaMediaPorSessao: 100.63 } } },
        },
      },
    },
  },
};

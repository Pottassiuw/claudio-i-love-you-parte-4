/**
 * Executa os testes obrigatórios da atividade contra a API em execução
 * e grava requisições/respostas em docs/EVIDENCIAS.md.
 *
 * Pré-requisitos: banco migrado + seeders (npm run db:reset) e API rodando (npm start).
 * Uso: npm run test:api   (ou API_URL=http://localhost:3000 node scripts/testes-api.js)
 */
const fs = require('fs');
const path = require('path');

const BASE = process.env.API_URL || 'http://localhost:3000';
const SAIDA = path.join(__dirname, '..', 'docs', 'EVIDENCIAS.md');

const resultados = [];
const md = [];

async function chamar(metodo, rota, corpo, corpoBruto) {
  const opcoes = { method: metodo, headers: {} };
  if (corpo !== undefined || corpoBruto !== undefined) {
    opcoes.headers['Content-Type'] = 'application/json';
    opcoes.body = corpoBruto !== undefined ? corpoBruto : JSON.stringify(corpo);
  }
  const resp = await fetch(BASE + rota, opcoes);
  const texto = await resp.text();
  let json;
  try {
    json = JSON.parse(texto);
  } catch {
    json = texto;
  }
  return { status: resp.status, body: json };
}

/**
 * Executa um passo, confere o status esperado e (opcional) uma verificação extra.
 * verificar(body) deve devolver null (ok) ou uma string descrevendo a falha.
 */
async function passo({ id, titulo, metodo, rota, corpo, corpoBruto, esperado, verificar, observacao }) {
  const { status, body } = await chamar(metodo, rota, corpo, corpoBruto);
  let falha = status !== esperado ? `status ${status}, esperado ${esperado}` : null;
  if (!falha && verificar) falha = verificar(body);
  const ok = !falha;
  resultados.push({ id, titulo, metodo, rota, esperado, status, ok, falha });

  md.push(`### ${id}. ${titulo} ${ok ? '✅' : '❌'}`);
  md.push('');
  if (observacao) md.push(`${observacao}\n`);
  md.push(`**Requisição:** \`${metodo} ${rota}\`  `);
  md.push(`**Status esperado:** ${esperado} · **Status recebido:** ${status}${falha ? ` · **Falha:** ${falha}` : ''}`);
  md.push('');
  if (corpo !== undefined || corpoBruto !== undefined) {
    md.push('Corpo enviado:');
    md.push('```json');
    md.push(corpoBruto !== undefined ? corpoBruto : JSON.stringify(corpo, null, 2));
    md.push('```');
  }
  md.push('Resposta:');
  md.push('```json');
  md.push(typeof body === 'string' ? body : JSON.stringify(body, null, 2));
  md.push('```');
  md.push('');
  return body;
}

function secao(titulo) {
  md.push(`## ${titulo}`);
  md.push('');
}

const n = (v) => (v === null || v === undefined ? '-' : String(v).replace('.', ','));

function comparativo(sem1, sem2) {
  const linhas = [];
  linhas.push(`## Comparativo entre as semanas ${sem1.semana.inicio} e ${sem2.semana.inicio}`);
  linhas.push('');
  linhas.push('Montado a partir das duas respostas de `GET /relatorios/semanal` acima.');
  linhas.push('');
  linhas.push('| Indicador | Semana 1 | Semana 2 |');
  linhas.push('|---|---|---|');
  linhas.push(`| Período | ${sem1.semana.inicio} a ${sem1.semana.fim} | ${sem2.semana.inicio} a ${sem2.semana.fim} |`);
  linhas.push(`| Total de treinos | ${sem1.totalTreinos} | ${sem2.totalTreinos} |`);
  linhas.push(`| Jogadores com treino | ${sem1.jogadoresComTreino} | ${sem2.jogadoresComTreino} |`);
  const nomes = (e) => (e ? `${e.jogadores.map((j) => `${j.nome} (${j.posicao})`).join(', ')} – ${n(e.cargaSemanal)}${e.empate ? ' (empate)' : ''}` : '-');
  linhas.push(`| Maior carga | ${nomes(sem1.maiorCargaSemanal)} | ${nomes(sem2.maiorCargaSemanal)} |`);
  linhas.push(`| Menor carga | ${nomes(sem1.menorCargaSemanal)} | ${nomes(sem2.menorCargaSemanal)} |`);
  linhas.push(`| Jogadores em risco | ${sem1.jogadoresEmRisco.quantidade} | ${sem2.jogadoresEmRisco.quantidade} |`);
  linhas.push('');

  linhas.push('**Por atleta (carga semanal / nº de treinos / situação)**');
  linhas.push('');
  linhas.push('| Atleta | Posição | Semana 1 | Semana 2 |');
  linhas.push('|---|---|---|---|');
  const todos = new Map();
  [...sem1.porJogador, ...sem2.porJogador].forEach((j) => todos.set(j.jogadorId, j));
  const cel = (sem, id) => {
    const j = sem.porJogador.find((x) => x.jogadorId === id);
    return j ? `${n(j.cargaSemanal)} / ${j.quantidadeTreinos} / ${j.situacao}` : 'sem treino';
  };
  [...todos.values()]
    .sort((a, b) => a.jogadorId - b.jogadorId)
    .forEach((j) => linhas.push(`| ${j.nome} | ${j.posicao} | ${cel(sem1, j.jogadorId)} | ${cel(sem2, j.jogadorId)} |`));
  linhas.push('');

  linhas.push('**Carga média por tipo de sessão (quantidade / média)**');
  linhas.push('');
  linhas.push('| Tipo | Semana 1 | Semana 2 |');
  linhas.push('|---|---|---|');
  sem1.mediaPorTipo.forEach((t, i) => {
    const t2 = sem2.mediaPorTipo[i];
    linhas.push(`| ${t.tipo} - ${t.descricao} | ${t.quantidadeTreinos} / ${n(t.cargaMedia)} | ${t2.quantidadeTreinos} / ${n(t2.cargaMedia)} |`);
  });
  linhas.push('');

  linhas.push('**Por posição (treinos / carga média por sessão)**');
  linhas.push('');
  linhas.push('| Posição | Semana 1 | Semana 2 |');
  linhas.push('|---|---|---|');
  sem1.porPosicao.forEach((p, i) => {
    const p2 = sem2.porPosicao[i];
    linhas.push(`| ${p.posicao} - ${p.descricao} | ${p.quantidadeTreinos} / ${n(p.cargaMediaPorSessao)} | ${p2.quantidadeTreinos} / ${n(p2.cargaMediaPorSessao)} |`);
  });
  linhas.push('');
  return linhas;
}

async function main() {
  // Limpeza de execuções anteriores interrompidas (não entra nas evidências)
  await chamar('DELETE', '/treinos/TR-T01').catch(() => {});

  const treinoBase = { jogadorId: 1, dataTreino: '2026-10-19', tipo: 'F', duracaoMin: 60, intensidade: 8 };

  secao('1. Saúde da API');
  await passo({ id: '1.1', titulo: 'API e banco conectados', metodo: 'GET', rota: '/saude', esperado: 200 });

  secao('2. Jogadores');
  await passo({
    id: '2.1',
    titulo: 'Listar atletas (seed: 9 atletas, 4 posições, 1 inativo)',
    metodo: 'GET',
    rota: '/jogadores',
    esperado: 200,
    verificar: (b) => {
      const posicoes = new Set(b.map((j) => j.posicao));
      if (b.length < 6) return 'menos de 6 atletas';
      if (posicoes.size < 4) return 'não cobre as 4 posições';
      return null;
    },
  });
  const novo = await passo({
    id: '2.2',
    titulo: 'Cadastrar atleta',
    metodo: 'POST',
    rota: '/jogadores',
    corpo: { nome: 'Rafael Gomes', posicao: 'A' },
    esperado: 201,
    verificar: (b) => (b.ativo === true ? null : 'atleta deveria nascer ativo'),
  });
  await passo({ id: '2.3', titulo: 'Cadastrar atleta com posição inválida', metodo: 'POST', rota: '/jogadores', corpo: { nome: 'Teste', posicao: 'X' }, esperado: 400 });
  await passo({ id: '2.4', titulo: 'Cadastrar atleta sem nome', metodo: 'POST', rota: '/jogadores', corpo: { posicao: 'G' }, esperado: 400 });
  await passo({ id: '2.5', titulo: 'Consultar atleta por id', metodo: 'GET', rota: '/jogadores/3', esperado: 200 });
  await passo({ id: '2.6', titulo: 'Consultar atleta inexistente', metodo: 'GET', rota: '/jogadores/999', esperado: 404 });
  await passo({ id: '2.7', titulo: 'Consultar com id inválido', metodo: 'GET', rota: '/jogadores/abc', esperado: 400 });
  await passo({
    id: '2.8',
    titulo: 'Atualizar atleta',
    metodo: 'PUT',
    rota: `/jogadores/${novo.id}`,
    corpo: { nome: 'Rafael Gomes Filho', posicao: 'M' },
    esperado: 200,
    verificar: (b) => (b.nome === 'Rafael Gomes Filho' && b.posicao === 'M' ? null : 'dados não atualizados'),
  });
  await passo({ id: '2.9', titulo: 'Filtrar atletas por posição', metodo: 'GET', rota: '/jogadores?posicao=Z', esperado: 200, verificar: (b) => (b.every((j) => j.posicao === 'Z') ? null : 'filtro falhou') });

  secao('3. Configuração do limite semanal');
  await passo({
    id: '3.1',
    titulo: 'Consultar limite (seed = 200)',
    metodo: 'GET',
    rota: '/configuracao',
    esperado: 200,
    verificar: (b) => (b.cargaMaximaSemanal === 200 ? null : 'limite diferente de 200'),
  });
  await passo({ id: '3.2', titulo: 'Atualizar limite para 200 (mantém o cenário de teste)', metodo: 'PUT', rota: '/configuracao', corpo: { cargaMaximaSemanal: 200, dataVigencia: '2026-10-01' }, esperado: 200 });
  await passo({ id: '3.3', titulo: 'Limite negativo', metodo: 'PUT', rota: '/configuracao', corpo: { cargaMaximaSemanal: -5 }, esperado: 400 });
  await passo({ id: '3.4', titulo: 'Limite não numérico', metodo: 'PUT', rota: '/configuracao', corpo: { cargaMaximaSemanal: 'abc' }, esperado: 400 });

  secao('4. Treinos - listagem e filtros');
  await passo({
    id: '4.1',
    titulo: 'Listar todos os treinos (seed: 22 treinos, tipos F/T/E) com dados do jogador',
    metodo: 'GET',
    rota: '/treinos',
    esperado: 200,
    verificar: (b) => {
      if (b.total < 20) return 'menos de 20 treinos';
      if (new Set(b.treinos.map((t) => t.tipo)).size < 3) return 'não cobre os 3 tipos';
      if (!b.treinos[0].jogador) return 'include do jogador ausente';
      return null;
    },
  });
  await passo({
    id: '4.2',
    titulo: 'Filtrar por tipo e período (físicos da semana 05/10 a 11/10)',
    metodo: 'GET',
    rota: '/treinos?tipo=F&dataInicio=2026-10-05&dataFim=2026-10-11',
    esperado: 200,
    verificar: (b) => (b.treinos.every((t) => t.tipo === 'F' && t.dataTreino >= '2026-10-05' && t.dataTreino <= '2026-10-11') && b.total === 5 ? null : 'filtro incorreto'),
  });
  await passo({ id: '4.3', titulo: 'Filtrar por atleta', metodo: 'GET', rota: '/treinos?jogadorId=4', esperado: 200, verificar: (b) => (b.total === 5 && b.treinos.every((t) => t.jogadorId === 4) ? null : 'filtro incorreto') });
  await passo({ id: '4.4', titulo: 'Filtrar por posição do atleta (include com where)', metodo: 'GET', rota: '/treinos?posicao=G', esperado: 200, verificar: (b) => (b.treinos.every((t) => t.jogador.posicao === 'G') ? null : 'filtro incorreto') });
  await passo({ id: '4.5', titulo: 'Filtro com tipo inválido', metodo: 'GET', rota: '/treinos?tipo=X', esperado: 400 });
  await passo({ id: '4.6', titulo: 'Treinos do atleta', metodo: 'GET', rota: '/treinos/jogador/3', esperado: 200, verificar: (b) => (b.total === 4 ? null : 'esperados 4 treinos') });
  await passo({ id: '4.7', titulo: 'Treinos de atleta inexistente', metodo: 'GET', rota: '/treinos/jogador/999', esperado: 404 });

  secao('5. Treinos - registro, cálculo de carga e validações');
  await passo({
    id: '5.1',
    titulo: 'Registrar treino e conferir a carga calculada',
    observacao: '**Validação manual:** treino físico (F, multiplicador 1,5), 60 minutos, intensidade 8 → (60 / 10) × 8 × 1,5 = 6 × 8 × 1,5 = **72 pontos**. A API deve devolver `carga: 72`.',
    metodo: 'POST',
    rota: '/treinos',
    corpo: { codigo: 'TR-T01', ...treinoBase, jogadorId: novo.id },
    esperado: 201,
    verificar: (b) => (b.carga === 72 ? null : `carga ${b.carga}, esperado 72`),
  });
  await passo({ id: '5.2', titulo: 'Código duplicado', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-001', ...treinoBase }, esperado: 409 });
  await passo({ id: '5.3', titulo: 'Intensidade acima de 10', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, intensidade: 11 }, esperado: 400 });
  await passo({ id: '5.4', titulo: 'Intensidade zero', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, intensidade: 0 }, esperado: 400 });
  await passo({ id: '5.5', titulo: 'Duração zero', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, duracaoMin: 0 }, esperado: 400 });
  await passo({ id: '5.6', titulo: 'Duração negativa', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, duracaoMin: -30 }, esperado: 400 });
  await passo({ id: '5.7', titulo: 'Tipo inválido', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, tipo: 'X' }, esperado: 400 });
  await passo({ id: '5.8', titulo: 'Vários campos inválidos ao mesmo tempo', metodo: 'POST', rota: '/treinos', corpo: { codigo: '', jogadorId: 1, dataTreino: '2026-13-40', tipo: 'Z', duracaoMin: -1, intensidade: 50 }, esperado: 400 });
  await passo({ id: '5.9', titulo: 'Atleta inexistente', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, jogadorId: 999 }, esperado: 404 });
  await passo({ id: '5.10', titulo: 'Atleta inativo (seed: Felipe Costa, id 9)', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, jogadorId: 9 }, esperado: 400 });
  await passo({ id: '5.11', titulo: 'JSON malformado', metodo: 'POST', rota: '/treinos', corpoBruto: '{"codigo": "TR-T03", ', esperado: 400 });

  secao('6. Desativação preserva o histórico');
  await passo({ id: '6.1', titulo: 'Desativar o atleta cadastrado no teste', metodo: 'PATCH', rota: `/jogadores/${novo.id}/desativar`, esperado: 200, verificar: (b) => (b.jogador.ativo === false ? null : 'continua ativo') });
  await passo({ id: '6.2', titulo: 'Registrar treino para o atleta recém-desativado', metodo: 'POST', rota: '/treinos', corpo: { codigo: 'TR-T02', ...treinoBase, jogadorId: novo.id }, esperado: 400 });
  await passo({
    id: '6.3',
    titulo: 'Histórico do atleta desativado continua disponível',
    metodo: 'GET',
    rota: `/treinos/jogador/${novo.id}`,
    esperado: 200,
    verificar: (b) => (b.total === 1 && b.treinos[0].codigo === 'TR-T01' ? null : 'histórico perdido'),
  });

  secao('7. Relatórios semanais');
  const sem1 = await passo({
    id: '7.1',
    titulo: 'Semana 1 (data=2026-10-05 → 05/10 a 11/10)',
    observacao:
      'Esperado: 13 treinos; Diego (215,1) e Lucas (202,5) em risco; Bruno com exatamente 200 **não** é risco (empate com o limite); ' +
      'maior carga Diego; menor carga Mateus (24); Pedro e Thiago sem treino ficam fora dos rankings.',
    metodo: 'GET',
    rota: '/relatorios/semanal?data=2026-10-05',
    esperado: 200,
    verificar: (b) => {
      if (b.totalTreinos !== 13) return `total ${b.totalTreinos}, esperado 13`;
      if (b.jogadoresEmRisco.quantidade !== 2) return 'esperados 2 em risco';
      const bruno = b.porJogador.find((j) => j.nome === 'Bruno Alves');
      if (!bruno || bruno.cargaSemanal !== 200 || bruno.emRisco) return 'Bruno (200) não deveria estar em risco';
      if (b.maiorCargaSemanal.jogadores[0].nome !== 'Diego Souza' || b.maiorCargaSemanal.cargaSemanal !== 215.1) return 'maior carga incorreta';
      if (b.menorCargaSemanal.jogadores[0].nome !== 'Mateus Rocha' || b.menorCargaSemanal.cargaSemanal !== 24) return 'menor carga incorreta';
      return null;
    },
  });
  const sem2 = await passo({
    id: '7.2',
    titulo: 'Semana 2 (data=2026-10-14 → 12/10 a 18/10)',
    observacao: 'Esperado: 9 treinos (o treino TR-T01 de 19/10 fica fora); André (216) em risco; menor carga com **empate** entre Diego e Mateus (24).',
    metodo: 'GET',
    rota: '/relatorios/semanal?data=2026-10-14',
    esperado: 200,
    verificar: (b) => {
      if (b.totalTreinos !== 9) return `total ${b.totalTreinos}, esperado 9`;
      if (b.jogadoresEmRisco.quantidade !== 1 || b.jogadoresEmRisco.jogadores[0].nome !== 'André Lima') return 'esperado apenas André em risco';
      if (!b.menorCargaSemanal.empate || b.menorCargaSemanal.jogadores.length !== 2) return 'empate na menor carga não detectado';
      return null;
    },
  });
  await passo({
    id: '7.3',
    titulo: 'Semana sem treinos (data=2026-11-02)',
    metodo: 'GET',
    rota: '/relatorios/semanal?data=2026-11-02',
    esperado: 200,
    verificar: (b) => (b.totalTreinos === 0 && b.maiorCargaSemanal === null && b.porJogador.length === 0 ? null : 'semana vazia mal tratada'),
  });
  await passo({ id: '7.4', titulo: 'Relatório sem o parâmetro data', metodo: 'GET', rota: '/relatorios/semanal', esperado: 400 });
  await passo({ id: '7.5', titulo: 'Relatório com data inexistente', metodo: 'GET', rota: '/relatorios/semanal?data=2026-02-30', esperado: 400 });

  secao('8. Exclusão de treino');
  await passo({ id: '8.1', titulo: 'Excluir treino pelo código', metodo: 'DELETE', rota: '/treinos/TR-T01', esperado: 200 });
  await passo({ id: '8.2', titulo: 'Excluir treino inexistente', metodo: 'DELETE', rota: '/treinos/TR-T01', esperado: 404 });

  secao('9. Rota inexistente');
  await passo({ id: '9.1', titulo: 'Rota não mapeada', metodo: 'GET', rota: '/nao-existe', esperado: 404 });

  // ---------- Gera o arquivo ----------
  const okCount = resultados.filter((r) => r.ok).length;
  const cabecalho = [
    '# Evidências de funcionamento da API',
    '',
    `Gerado automaticamente por \`npm run test:api\` em ${new Date().toLocaleString('pt-BR')} contra \`${BASE}\`.`,
    'Os mesmos cenários podem ser executados manualmente no Swagger (`/api-docs`). Os exemplos de corpo de `POST /treinos` já estão cadastrados lá.',
    '',
    `**Resultado: ${okCount}/${resultados.length} verificações aprovadas.**`,
    '',
    '| # | Cenário | Requisição | Esperado | Recebido | OK |',
    '|---|---|---|---|---|---|',
    ...resultados.map((r) => `| ${r.id} | ${r.titulo} | \`${r.metodo} ${r.rota}\` | ${r.esperado} | ${r.status} | ${r.ok ? '✅' : '❌'} |`),
    '',
  ];
  const conteudo = [...cabecalho, ...comparativo(sem1, sem2), ...md].join('\n');
  fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
  fs.writeFileSync(SAIDA, conteudo, 'utf8');

  resultados.forEach((r) => console.log(`${r.ok ? 'OK  ' : 'FALHA'} ${r.id} ${r.titulo}${r.falha ? ` -> ${r.falha}` : ''}`));
  console.log(`\n${okCount}/${resultados.length} aprovados. Evidências em ${path.relative(process.cwd(), SAIDA)}`);
  if (okCount !== resultados.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`Não foi possível executar os testes: ${err.message}. A API está rodando em ${BASE}?`);
  process.exitCode = 1;
});

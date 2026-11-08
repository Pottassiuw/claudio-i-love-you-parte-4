const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./docs/openapi');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(express.json());

// Documentação interativa (Swagger UI) e especificação OpenAPI em JSON
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'API Treinos Esportivos' }));
app.get('/api-docs.json', (req, res) => res.json(openapi));

app.get('/', (req, res) =>
  res.json({
    api: 'Sistema de Treinos Esportivos com Carga e Risco de Lesão',
    documentacao: '/api-docs',
  })
);

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

import fastify from 'fastify';
import { Routes } from './http/routes'

const app = fastify();

app.register(Routes)

app.listen({ port: 3333 }, (err, address) => {
  if (err) throw err;
  console.debug(`Servidor rodando na porta ${address}`)
})

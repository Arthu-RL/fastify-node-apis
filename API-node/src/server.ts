import Fastify from "fastify";
import { Routes } from "./http/routes";

const app = Fastify({
    logger: true
});

app.register(Routes);

app.listen({ port: 3333 }, (err, address) => {
    if (err) throw err;
    console.debug(`Server running on address ${address}`);
})

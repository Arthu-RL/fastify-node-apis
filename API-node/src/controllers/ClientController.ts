import { FastifyRequest, FastifyReply } from "fastify";
import { nclients, salesOrder } from "../lib/prisma";
import { z } from "zod";

const cities = ["VR", "BM", "BP", "R", "PH"]

class ClientController {
    async list(request: FastifyRequest, reply: FastifyReply) {
        const clients = await nclients.list();
        return reply.status(200).send(clients);
    }

    async listById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = paramsSchema.parse(request.params);
        // const { id } = request.params as { id: string }
        const nclientsId = await nclients.listById(id);
        return reply.status(200).send(nclientsId);
    }

    async listWithSalesOrders(request: FastifyRequest, reply: FastifyReply) {
        const clientsWithSalesOrders = await nclients.listWithSalesOrders();

        return reply.status(200).send(clientsWithSalesOrders.map((clientSaleOrder) => {
            return {
                id: clientSaleOrder.id,
                name: clientSaleOrder.name,
                salesOrder: clientSaleOrder.salesOrder.map((saleOrder) => {
                    return {
                        data_de_emissao: saleOrder.date_of_issue,
                        quantidade: Number(saleOrder.amount),
                        valor_unitario: Number(saleOrder.unitary_value),
                        valor_total: Number(saleOrder.amount) * Number(saleOrder.unitary_value)
                    }
                })
            }
        }));
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            name: z.string(),
            email: z.string(),
            cpf: z.string(),
            city: z.string()
        });

        const { name, email, cpf, city } = paramsSchema.parse(request.body);

        const emailExists = await nclients.listByEmail(email);

        if (emailExists) {
            return reply.status(409).send("E-mail já cadastrado.")
        }

        const cpfExists = await nclients.listByCpf(cpf);

        if (cpfExists) {
            return reply.status(409).send("CPF já existente.")
        }

        if (!cities.includes(city)) {
            return reply.status(500).send("Cidade inválida.")
        }

        const nclientsCreated = await nclients.create(name, email, cpf, city);
        return reply.status(200).send(nclientsCreated);
    }

    async deleteById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const nclientsExist = await nclients.listById(id);

        if (!nclientsExist) {
            return reply.status(500).send("Cliente não existe.")
        }

        const deletednclients = await nclients.deleteById(id);
        reply.status(200).send(deletednclients);
    }

    async modify(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const nclientsExist = await nclients.listById(id);

        if (!nclientsExist) {
            return reply.status(500).send("Cliente não existe.");
        }

        const paramsSchemaUpdate = z.object({
            name: z.string(),
            email: z.string(),
            cpf: z.string(),
            city: z.string()
        });

        const { name, email, cpf, city } = paramsSchemaUpdate.parse(request.body);

        if (email !== nclientsExist.email) {
            const nclientsExists = await nclients.listByEmail(email);

            if (nclientsExists) {
                return reply.status(409).send("E-mail já cadastrado.")
            }
        }

        if (cpf !== nclientsExist.cpf) {
            const nclientsExists = await nclients.listByCpf(cpf);

            if (nclientsExists) {
                return reply.status(409).send("CPF já existente.")
            }
        }

        if (!cities.includes(city)) {
            return reply.status(500).send("Cidade inválida.")
        }

        const nclientsUpdated = await nclients.modify(id, name, email, cpf, city);
        return reply.status(200).send(nclientsUpdated);
    }
};

export default ClientController;
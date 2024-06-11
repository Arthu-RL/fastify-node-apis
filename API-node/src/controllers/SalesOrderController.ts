import { FastifyRequest, FastifyReply } from "fastify";
import { salesOrder } from "../lib/prisma";
import { z } from "zod";

export class SalesOrderController {
    async list(request: FastifyRequest, reply: FastifyReply) {
        const players = await salesOrder.getOrders();
        return reply.status(200).send(players);
    }

    async listFiltered(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            unitary_price: z.number()
        });

        const { unitary_price } = paramsSchema.parse(request.params);

        const players = await salesOrder.getOrdersFiltered(unitary_price);
        return reply.status(200).send(players);
    }

    async listById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = paramsSchema.parse(request.params);
        // const { id } = request.params as { id: string }
        const salesOrderId = await salesOrder.getOrderById(id);
        return reply.status(200).send(salesOrderId);
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            date_of_issue: z.coerce.date(),
            amount: z.number(),
            unitary_price: z.number(),
            clientId: z.string().uuid(),
            productId: z.string().uuid()
        });

        const { date_of_issue, amount, unitary_price, clientId, productId } = paramsSchema.parse(request.body);
        
        const newOrder = await salesOrder.createOrder(date_of_issue, Number(amount), Number(unitary_price), clientId, productId);
        return reply.status(200).send(newOrder);
    }

    async deleteById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const orderExists = await salesOrder.getOrderById(id);

        if (!orderExists) {
            return reply.status(500).send("Pedido não existe.");
        }

        const deleteOrder = await salesOrder.deleteById(id);
        return reply.status(200).send(deleteOrder);
    }

    async modifyOrder(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const orderExists = await salesOrder.getOrderById(id);

        if (!orderExists) {
            return reply.status(500).send("Pedido não existe.");
        }
        
        const paramsSchemaUpdate = z.object({
            date_of_issue: z.coerce.date(),
            amount: z.number(),
            unitary_price: z.number(),
            clientId: z.string().uuid(),
            productId: z.string().uuid()
        });

        const { date_of_issue, amount, unitary_price, clientId, productId } = paramsSchemaUpdate.parse(request.body);
        
        const modifyOrder = await salesOrder.modifyOrder(id, date_of_issue, Number(amount), Number(unitary_price), clientId, productId);
        return reply.status(200).send(modifyOrder);
    }
};

export default SalesOrderController;
import { FastifyRequest, FastifyReply } from "fastify";
import { product } from "../lib/prisma";
import { z } from "zod";

// PA - Produto Acabado
// MP - Materia Prima
// PI - Produto Intermediário
// AT - Ativo

const gropes = ["PA", "MP", "PI", "AT"]

class ProductController {
    async list(request: FastifyRequest, reply: FastifyReply) {
        const players = await product.getProducts();
        return reply.status(200).send(players);
    }

    async listById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = paramsSchema.parse(request.params);
        // const { id } = request.params as { id: string }
        const productId = await product.getProductById(id);
        return reply.status(200).send(productId);
    }

    async createProduct(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            product_name: z.string(),
            grope_name: z.string(),
            amount: z.number(),
            price_unit: z.number()
        });

        const { product_name, grope_name, amount, price_unit } = paramsSchema.parse(request.body);

        const productExists = await product.getProductByName(product_name);

        if (productExists) {
            return reply.status(409).send("Produto já cadastrado.")
        }

        if (!gropes.includes(grope_name)) {
            return reply.status(500).send("Grope name inválido. ex: PA, MP, PI, AT")
        }

        const productCreated = await product.createProduct(product_name, grope_name, amount, price_unit);
        return reply.status(200).send(productCreated);
    }

    async deleteById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const productExist = await product.getProductById(id);

        if (!productExist) {
            return reply.status(500).send("Produto não existe.")
        }

        const deletedproduct = await product.deleteProductById(id);
        reply.status(200).send(deletedproduct);
    }

    async modify(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const productExist = await product.getProductById(id);

        if (!productExist) {
            return reply.status(500).send("Usuário não existe.");
        }

        const paramsSchemaUpdate = z.object({
            product_name: z.string(),
            grope_name: z.string(),
            amount: z.number(),
            price_unit:  z.number()
        });

        const { product_name, grope_name, amount, price_unit } = paramsSchemaUpdate.parse(request.body);

        if (product_name !== productExist.product_name) {
            const productExists = await product.getProductByName(product_name);

            if (productExists) {
                return reply.status(409).send("Produto já cadastrado.")
            }
        }

        if (!gropes.includes(grope_name)) {
            return reply.status(500).send("Grope name inválido. ex: PA, MP, PI, AT")
        }

        const productUpdated = await product.modifyProductById(id, product_name, grope_name, amount, price_unit);

        return reply.status(200).send(productUpdated);
    }
};

export default ProductController;
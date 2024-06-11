import { FastifyRequest, FastifyReply } from "fastify";
import { user } from "../lib/prisma";
import { z } from 'zod';

const cities = ["VR", "BM", "BP", "R", "PH"]

class UserController {
    async list(request: FastifyRequest, reply: FastifyReply) {
        const users = await user.getUsers();
        return reply.status(200).send(users);
    }

    async listById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = paramsSchema.parse(request.params);
        // const { id } = request.params as { id: string }
        const userId = await user.getUserById(id);
        return reply.status(200).send(userId);
    }

    async createUser(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            name: z.string(),
            email: z.string(),
            cpf: z.string(),
            city: z.string()
        });

        const { name, email, cpf, city } = paramsSchema.parse(request.body);

        const emailExists = await user.getUserByEmail(email);

        if (emailExists) {
            return reply.status(409).send("E-mail já cadastrado.")
        }

        const cpfExists = await user.getUserByCpf(cpf);

        if (cpfExists) {
            return reply.status(409).send("CPF já existente.")
        }

        if (!cities.includes(city)) {
            return reply.status(500).send("Cidade inválida.")
        }

        const userCreated = await user.createUser(name, email, cpf, city);
        return reply.status(200).send(userCreated);
    }

    async deleteById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const userExist = await user.getUserById(id);

        if (!userExist) {
            return reply.status(500).send("Usuário não existe.")
        }

        const deletedUser = await user.deleteUserById(id);
        reply.status(200).send(deletedUser);
    }

    async modify(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const userExist = await user.getUserById(id);

        if (!userExist) {
            return reply.status(500).send("Usuário não existe.");
        }

        const paramsSchemaUpdate = z.object({
            name: z.string(),
            email: z.string(),
            cpf: z.string(),
            city: z.string()
        });

        const { name, email, cpf, city } = paramsSchemaUpdate.parse(request.body);

        if (email !== userExist.email) {
            const userExists = await user.getUserByEmail(email);

            if (userExists) {
                return reply.status(409).send("E-mail já cadastrado.")
            }
        }

        if (cpf !== userExist.cpf) {
            const userExists = await user.getUserByCpf(cpf);

            if (userExists) {
                return reply.status(409).send("CPF já existente.")
            }
        }

        if (!cities.includes(city)) {
            return reply.status(500).send("Cidade inválida.")
        }

        const userUpdated = await user.modifyUserById(id, name, email, cpf, city);
        return reply.status(200).send(userUpdated);
    }
};

export default UserController;
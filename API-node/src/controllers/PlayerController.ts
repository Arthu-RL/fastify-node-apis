import { FastifyRequest, FastifyReply } from "fastify";
import { player } from "../lib/prisma";
import { user } from "../lib/prisma"
import { z } from 'zod';

class PlayerController {
    async list(request: FastifyRequest, reply: FastifyReply) {
        const players = await player.getPlayers();
        return reply.status(200).send(players);
    }

    async listById(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })
        const { id } = paramsSchema.parse(request.params)
        // const { id } = request.params as { id: string }
        const playerId = await player.getPlayerById(id)
        return reply.status(200).send(playerId);
    }

    async createPlayer(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const { id } = paramsSchema.parse(request.params);

        const userExists = await user.getUserById(id);

        if (!userExists) {
            return reply.status(500).send("Usuário não existe.");
        }

        const playerCreated = await player.createPlayer(id);
        return reply.status(200).send(playerCreated);
    }
};

export default PlayerController;
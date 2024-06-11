import { FastifyRequest, FastifyReply } from "fastify";
import { nclients, medics, especialities } from "../lib/prisma";
import { z } from "zod"

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

        const nclientsId = await nclients.listById(id);
        return reply.status(200).send(nclientsId);
    }

    async listWithSchedule(request: FastifyRequest, reply: FastifyReply) {
        const allEspecialitiesScheduled = await nclients.listWithSchedules();
        return reply.status(200).send(allEspecialitiesScheduled.map((especScheduled) => {
            return {
                ...especScheduled,
                schedules: especScheduled.schedules.map((schedule) => {
                    return {
                    ...schedule
                    }
                })
            };
        }));
    }

    async listWithScheduleCustomData(request: FastifyRequest, reply: FastifyReply) {
        const allClientsScheduled = await nclients.listWithSchedules();
        return reply.status(200).send(await Promise.all(allClientsScheduled.map(async (clientScheduled) => {
          return {
            name: clientScheduled.name,
            cellphone_number: clientScheduled.cellphone_number,
            schedules: await Promise.all(clientScheduled.schedules.map(async schedule => {
              const especiality = await especialities.listById(schedule.especiality_id);
              const medic = await medics.listById(schedule.medic_id);
              return {
                medic_name: medic?.medic,
                especiality: especiality?.especiality,
                schedule_date: schedule.schedule_date,
                consult_date: schedule.consult_date
              }
            }))
          };
        })));
      }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const paramsSchema = z.object({
            name: z.string(),
            cpf: z.string(),
            cellphone_number: z.string()
        });

        const { name, cpf, cellphone_number } = paramsSchema.parse(request.body);

        const cpfExists = await nclients.listByCpf(cpf);

        if (cpfExists) {
            return reply.status(409).send("CPF já existente.");
        }

        const nclientsCreated = await nclients.create(name, cpf, cellphone_number);
        return reply.status(200).send(nclientsCreated);
    }
};

export default ClientController;
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { especialities, nclients, medics } from '../lib/prisma'

class EspecialityController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const allEspecialities = await especialities.list();
    return reply.status(200).send(allEspecialities)
  }

  async listWithSchedule(request: FastifyRequest, reply: FastifyReply) {
    const allEspecialitiesScheduled = await especialities.listWithSchedules();
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
    const allEspecialitiesScheduled = await especialities.listWithSchedules();
    return reply.status(200).send(await Promise.all(allEspecialitiesScheduled.map(async (especScheduled) => {
      return {
        especiality: especScheduled.especiality,
        schedules: await Promise.all(especScheduled.schedules.map(async schedule => {
          const client = await nclients.listById(schedule.client_id);
          const medic = await medics.listById(schedule.medic_id);
          return {
            medic_name: medic?.medic,
            client_name: client?.name,
            cellphone_number: client?.cellphone_number,
            consult_date: schedule.consult_date,
            schedule_date: schedule.schedule_date
          }
        }))
      };
    })));
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      cod_especiality: z.string(),
      especiality: z.string()
    });

    const { cod_especiality, especiality } = bodySchema.parse(request.body);

    const alreadyExists = await especialities.listByCode(cod_especiality);

    if (alreadyExists) {
      return reply.status(409).send("Especialidade com o mesmo código já existe.");
    }

    const newEspeciality = await especialities.create(cod_especiality, especiality);

    return reply.status(200).send(newEspeciality);
  }
};

export default EspecialityController;
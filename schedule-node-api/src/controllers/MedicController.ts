import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { medics, nclients, especialities } from '../lib/prisma'

class MedicController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const allMedics = await medics.list();
    return reply.status(200).send(allMedics)
  }

  async listWithSchedule(request: FastifyRequest, reply: FastifyReply) {
    const allMedicsScheduled = await medics.listWithSchedules();
    return reply.status(200).send(allMedicsScheduled.map((medicScheduled) => {
      return {
        ...medicScheduled,
        schedules: medicScheduled.schedules.map((schedule) => {
          return {
            ...schedule
          }
        })
      };
    }));
  }

  async listWithScheduleCustomData(request: FastifyRequest, reply: FastifyReply) {
    const allMedicsScheduled = await medics.listWithSchedules();
    return reply.status(200).send(await Promise.all(allMedicsScheduled.map(async (medicScheduled) => {
      return {
        name: medicScheduled.medic,
        crm: medicScheduled.crm,
        schedules: await Promise.all(medicScheduled.schedules.map(async schedule => {
          const especiality = await especialities.listById(schedule.especiality_id);
          const client = await nclients.listById(schedule.client_id);
          return {
            especiality: especiality?.especiality,
            client_data: {name: client?.name, cellphone_number: client?.cellphone_number},
            consult_date: schedule.consult_date
          }
        }))
      };
    })));
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      medic: z.string(),
      crm: z.string()
    });

    const { medic, crm } = bodySchema.parse(request.body);

    const newMedic = await medics.create(medic, crm);

    return reply.status(200).send(newMedic)
  }
};

export default MedicController;
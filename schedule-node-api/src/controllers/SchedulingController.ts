import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { schedules } from '../lib/prisma'

class SchedulingController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const allSchedules = await schedules.list();
    return reply.status(200).send(allSchedules);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      schedule_date: z.coerce.date(),
      consult_date: z.coerce.date(),
      especiality_id: z.string(),
      medic_id: z.string(),
      client_id: z.string()
    })

    const { schedule_date, consult_date, especiality_id, medic_id, client_id } = bodySchema.parse(request.body)

    const newSchedule = await schedules.create(schedule_date, consult_date, especiality_id, medic_id, client_id);

    return reply.status(200).send(newSchedule);
  }
};

export default SchedulingController;
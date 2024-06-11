import { FastifyInstance } from "fastify";
import MedicController from "../controllers/MedicController";
import EspecialityController from "../controllers/EspecialityController";
import ClientController from "../controllers/ClientController";
import SchedulingController from "../controllers/SchedulingController";

const medicController = new MedicController();
const especialityController = new EspecialityController();
const clientController = new ClientController();
const schedulingController = new SchedulingController();

export async function Routes(app: FastifyInstance) {
  app.get('/medics', medicController.list);
  app.get('/medics/schedule', medicController.listWithSchedule);
  app.get('/medics/schedule/data', medicController.listWithScheduleCustomData);
  app.post('/medics', medicController.create);

  app.get('/especialities', especialityController.list);
  app.get('/especialities/schedule', especialityController.listWithSchedule);
  app.get('/especialities/schedule/data', especialityController.listWithScheduleCustomData);
  app.post('/especialities', especialityController.create);

  app.get('/clients', clientController.list);
  app.get('/clients/:id', clientController.listById);
  app.get('/clients/schedule', clientController.listWithSchedule);
  app.get('/clients/schedule/data', clientController.listWithScheduleCustomData);
  app.post('/clients', clientController.create);

  app.get('/schedules', schedulingController.list);
  app.post('/schedules', schedulingController.create);
}
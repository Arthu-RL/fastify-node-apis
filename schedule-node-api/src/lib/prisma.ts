import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export const prisma = new PrismaClient();


/////////////////////////////////////////
//////// ESPECIALITY
//////////////////////////////////////////
export namespace especialities {
  export async function list() {
    return await prisma.especiality.findMany();
  }

  export async function listById(eId: string) {
    return await prisma.especiality.findFirst({
      where: {
          id: eId
      },
    });
  }

  export async function listWithSchedules() {
    return await prisma.especiality.findMany({ 
      include: {
        schedules: true
      },
    });
  }

  export async function listByCode(eCode: string) {
    return await prisma.especiality.findFirst({
      where: {
          cod_especiality: eCode
      },
    });
  }

  export async function create(especialityCode: string, especiality: string) {
    return await prisma.especiality.create({ 
      data: {
        cod_especiality: especialityCode,
        especiality: especiality
      },
    });
  }
}


/////////////////////////////////////////
//////// MEDICS
//////////////////////////////////////////
export namespace medics {
  export async function list() {
    return await prisma.medic.findMany();
  }

  export async function listById(mId: string) {
    return await prisma.medic.findFirst({
      where: {
          id: mId
      },
    });
  }

  export async function listWithSchedules() {
    return await prisma.medic.findMany({ 
      include: {
        schedules: true
      },
    });
  }

  export async function create(mMedic: string, mCrm: string) {
    return await prisma.medic.create({
      data: {
        medic: mMedic,
        crm: mCrm
      },
    });
  }
}


/////////////////////////////////////////
//////// CLIENTS
//////////////////////////////////////////
export namespace nclients {
  export async function list() {
    return await prisma.client.findMany({
      orderBy: {
          name: "asc"
      },
    });
  }

  export async function listById(cId: string) {
      return await prisma.client.findFirst({
        where: {
            id: cId
        },
      });
  }

  export async function listByCpf(cCpf: string) {
    return await prisma.client.findFirst({
      where: {
          cpf: cCpf
      },
    });
  }

  export async function listWithSchedules() {
    return await prisma.client.findMany({ 
      include: {
        schedules: true
      }, 
    });
  }

  export async function create(cName: string, cCpf: string, cellNumber: string) {
    return await prisma.client.create({
      data: {
          name: cName,
          cpf: cCpf,
          cellphone_number: cellNumber
      },
    });
  }
}


/////////////////////////////////////////
//////// SHEDULES
//////////////////////////////////////////
export namespace schedules {
  export async function list() {
    return await prisma.schedule.findMany({
      orderBy: {
        consult_date: "asc"
      },
    });
  }

  export async function create(scheduleDate: Date, consultDate: Date, 
    especialityId: string, medicId: string, clientId: string) 
  {
    return await prisma.schedule.create({
      data: {
        schedule_date: dayjs(scheduleDate).toDate(),
        consult_date: dayjs(consultDate).toDate(),
        especiality_id: especialityId,
        medic_id: medicId,
        client_id: clientId
      },
    });
  }
}
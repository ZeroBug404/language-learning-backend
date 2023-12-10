import { Appointment } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Appointment): Promise<any> => {
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      date: data.date,
      slot: data.slot,
      studentId: data.studentId,
    },
  });

  if (existingAppointment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slot is already booked.');
  }

  const newAppointment = await prisma.appointment.create({
    data: {
      title: data.title,
      date: data.date,
      slot: data.slot,
      studentId: data.studentId,
      courseId: data.courseId,
    },
  });

  return newAppointment;
};

const getAllFromDB = async (): Promise<Appointment[]> => {
  const result = await prisma.appointment.findMany({
    include: {
      student: true,
      Course: true,
    },
  });

  return result;
};

const getByIdFromDB = async (id: string): Promise<Appointment | null> => {
  const result = await prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      student: true,
      Course: true,
    },
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Appointment> => {
    const result = await prisma.appointment.delete({
        where: {
            id
        }
    });
    return result;
};


export const AppointmentService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteByIdFromDB
};

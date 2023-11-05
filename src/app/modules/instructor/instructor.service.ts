import { Instructor, Prisma, UserRole } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { instructorSearchableFields } from './instructor.constants';
import { IInstructorFilterRequest } from './instructor.interface';

const insertIntoDB = async (instructorData: Instructor): Promise<Instructor> => {
  let result: Instructor | null = null;

  // Start a Prisma transaction
  await prisma.$transaction(async (prismaClient) => {
    // Create the instructor
    const instructorResult = await prismaClient.instructor.create({
      data: instructorData,
    });

    const userData = {
      email: instructorData.email,
      role: UserRole.instructor,
      instructorId: instructorResult?.id,
    };
  
    // Create the user
    await prismaClient.user.create({
      data: userData,
      include: {
        instructor: true,
      }
    });

    // Commit the transaction if both operations are successful
    result = instructorResult;
  });

  if (!result) {
    // Handle the case where the transaction failed
    throw new Error("Failed to insert instructor and user.");
  }

  return result;
};

const getAllFromDB = async (
  filters: IInstructorFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Instructor[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: instructorSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.InstructorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.instructor.findMany({
    // include: {
    // },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.instructor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Instructor | null> => {
  const result = await prisma.instructor.findFirst({
    where: {
      id,
    },
    include: {},
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<Instructor>
): Promise<Instructor> => {
  const result = await prisma.instructor.update({
    where: {
      id,
    },
    data: payload,
    // include: {

    // },
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<Instructor> => {
  const result = await prisma.instructor.delete({
    where: {
      id,
    },
    include: {},
  });
  return result;
};

export const InstructorService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};

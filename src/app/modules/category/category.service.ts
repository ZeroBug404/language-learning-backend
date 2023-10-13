import { Language, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { categorySearchableFields } from './category.constants';
import { ICategoryFilterRequest } from './category.interface';


const insertIntoDB = async (data: Language): Promise<any> => {

    console.log('course data', data);

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.language.create({
      data,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create category');
    }

    return result;
  });

  if (newCourse) {
    const responseData = await prisma.language.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {},
    });

    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create category');
};

const getAllFromDB = async (
  filters: ICategoryFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Language[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: categorySearchableFields.map((field: any) => ({
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

  const whereConditions: Prisma.LanguageWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.language.findMany({
    include: {},
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
  const total = await prisma.language.count({
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

const getByIdFromDB = async (id: string): Promise<Language | null> => {
  const result = await prisma.language.findUnique({
    where: {
      id,
    },
    include: {},
  });
  return result;
};

export const CategoryService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
};

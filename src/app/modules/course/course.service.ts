import { Course, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

import { courseSearchableFields } from './course.constants';
import { ICourseFilterRequest } from './course.interface';

const insertIntoDB = async (data: Course): Promise<any> => {

  const newCourse = await prisma.course.create({
    data,
    include: {
      language: true,
      instructor: true,
    },
  });

  if (!newCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
  }

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        language: true,
        instructor: true,
      },
    });

    return responseData;
  }

  return newCourse;
};

const getAllFromDB = async (
  filters: ICourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableFields.map(field => ({
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

  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.course.findMany({
    include: {
      language: true,
      instructor: true,
    },
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
  const total = await prisma.course.count({
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

const getByIdFromDB = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      language: true,
      instructor: true,
    },
  });
  return result;
};

// const updateOneInDB = async (
//     id: string,
//     payload: ICourseCreateData
// ): Promise<Course | null> => {
//     const { preRequisiteCourses, ...courseData } = payload;

//     await prisma.$transaction(async (transactionClient) => {
//         const result = await transactionClient.course.update({
//             where: {
//                 id
//             },
//             data: courseData
//         })

//         if (!result) {
//             throw new ApiError(httpStatus.BAD_REQUEST, "Unable to update course")
//         }

//         if (preRequisiteCourses && preRequisiteCourses.length > 0) {
//             const deletePrerequisite = preRequisiteCourses.filter(
//                 (coursePrerequisite) => coursePrerequisite.courseId && coursePrerequisite.isDeleted
//             )

//             const newPrerequisite = preRequisiteCourses.filter(
//                 (coursePrerequisite) => coursePrerequisite.courseId && !coursePrerequisite.isDeleted
//             )

//             await asyncForEach(
//                 deletePrerequisite,
//                 async (deletePreCourse: IPrerequisiteCourseRequest) => {
//                     await transactionClient.courseToPrerequisite.deleteMany({
//                         where: {
//                             AND: [
//                                 {
//                                     courseId: id
//                                 },
//                                 {
//                                     preRequisiteId: deletePreCourse.courseId
//                                 }
//                             ]
//                         }
//                     })
//                 }
//             )

//             await asyncForEach(
//                 newPrerequisite,
//                 async (insertPrerequisite: IPrerequisiteCourseRequest) => {
//                     await transactionClient.courseToPrerequisite.create({
//                         data: {
//                             courseId: id,
//                             preRequisiteId: insertPrerequisite.courseId
//                         }
//                     })
//                 }
//             )
//         }

//         return result;
//     })

//     const responseData = await prisma.course.findUnique({
//         where: {
//             id
//         },
//         include: {
//             preRequisite: {
//                 include: {
//                     preRequisite: true
//                 }
//             },
//             preRequisiteFor: {
//                 include: {
//                     course: true
//                 }
//             }
//         }
//     })

//     return responseData
// }

// const deleteByIdFromDB = async (id: string): Promise<Course> => {
//     await prisma.courseToPrerequisite.deleteMany({
//         where: {
//             OR: [
//                 {
//                     courseId: id
//                 },
//                 {
//                     preRequisiteId: id
//                 }
//             ]
//         }
//     });

//     const result = await prisma.course.delete({
//         where: {
//             id
//         }
//     });
//     return result;
// };

// const assignFaculies = async (
//     id: string,
//     payload: string[]
// ): Promise<CourseFaculty[]> => {
//     await prisma.courseFaculty.createMany({
//         data: payload.map((facultyId) => ({
//             courseId: id,
//             facultyId: facultyId
//         }))
//     })

//     const assignFacultiesData = await prisma.courseFaculty.findMany({
//         where: {
//             courseId: id
//         },
//         include: {
//             faculty: true
//         }
//     })

//     return assignFacultiesData;
// }

// const removeInstructors = async (
//     id: string,
//     payload: string[]
// ): Promise<CourseFaculty[] | null> => {
//     await prisma.courseFaculty.deleteMany({
//         where: {
//             courseId: id,
//             facultyId: {
//                 in: payload
//             }
//         }
//     })

//     const assignFacultiesData = await prisma.courseFaculty.findMany({
//         where: {
//             courseId: id
//         },
//         include: {
//             faculty: true
//         }
//     })

//     return assignFacultiesData
// }

export const CourseService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
};

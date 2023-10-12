
import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { studentRelationalFields, studentRelationalFieldsMapper, studentSearchableFields } from './student.constants';
import { IStudentFilterRequest } from './student.interface';

const insertIntoDB = async (data: Student): Promise<Student> => {
    const result = await prisma.student.create({
        data,
        // include: {

        // }
    });
    return result;
};

const getAllFromDB = async (
    filters: IStudentFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: studentSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                if (studentRelationalFields.includes(key)) {
                    return {
                        [studentRelationalFieldsMapper[key]]: {
                            id: (filterData as any)[key]
                        }
                    };
                } else {
                    return {
                        [key]: {
                            equals: (filterData as any)[key]
                        }
                    };
                }
            })
        });
    }

    const whereConditions: Prisma.StudentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.student.findMany({
        // include: {

        // },
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc'
                }
    });
    const total = await prisma.student.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

const getByIdFromDB = async (id: string): Promise<Student | null> => {
    const result = await prisma.student.findUnique({
        where: {
            id
        },
        // include: {

        // }
    });
    return result;
};

// const updateIntoDB = async (id: string, payload: Partial<Student>): Promise<Student> => {
//     const result = await prisma.student.update({
//         where: {
//             id
//         },
//         data: payload,
//         include: {
//             academicSemester: true,
//             academicDepartment: true,
//             academicFaculty: true
//         }
//     });
//     return result;
// }

const deleteFromDB = async (id: string): Promise<Student> => {
    const result = await prisma.student.delete({
        where: {
            id
        },
        // include: {

        // }
    })
    return result;
}

// const myCourses = async (
//     authUserId: string,
//     filter: {
//         courseId?: string | undefined,
//         academicSemesterId?: string | undefined
//     }
// ) => {
//     if (!filter.academicSemesterId) {
//         const currentSemester = await prisma.academicSemester.findFirst({
//             where: {
//                 isCurrent: true
//             }
//         });
//         filter.academicSemesterId = currentSemester?.id;
//     }

//     const result = await prisma.studentEnrolledCourse.findMany({
//         where: {
//             student: {
//                 studentId: authUserId
//             },
//             ...filter
//         },
//         include: {
//             course: true
//         }
//     });

//     return result;
// };


// const createStudentFromEvent = async (e: any) => {
//     const studentData: Partial<Student> = {
//         studentId: e.id,
//         firstName: e.name.firstName,
//         lastName: e.name.lastName,
//         middleName: e.name.middleName,
//         email: e.email,
//         contactNo: e.contactNo,
//         gender: e.gender,
//         bloodGroup: e.bloodGroup,
//         academicSemesterId: e.academicSemester.syncId,
//         academicDepartmentId: e.academicDepartment.syncId,
//         academicFacultyId: e.academicFaculty.syncId
//     };

//     await insertIntoDB(studentData as Student)
// }

// const updateStudentFromEvent = async (e: any): Promise<void> => {
//     const isExist = await prisma.student.findFirst({
//         where: {
//             studentId: e.id
//         }
//     });

//     if (!isExist) {
//         await createStudentFromEvent(e);
//         return;
//     } else {
//         const student: Partial<Student> = {
//             studentId: e.id,
//             firstName: e.name.firstName,
//             lastName: e.name.lastName,
//             middleName: e.name.middleName,
//             profileImage: e.profileImage,
//             email: e.email,
//             contactNo: e.contactNo,
//             gender: e.gender,
//             bloodGroup: e.bloodGroup,
//             academicDepartmentId: e.academicDepartment.syncId,
//             academicFacultyId: e.academicFaculty.syncId,
//             academicSemesterId: e.academicSemester.syncId
//         };
//         await prisma.student.updateMany({
//             where: {
//                 studentId: e.id
//             },
//             data: student as Student
//         });
//     }
// };

export const StudentService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
};
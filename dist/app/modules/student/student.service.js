"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const student_constants_1 = require("./student.constants");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.student.create({
        data,
        // include: {
        // }
    });
    return result;
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: student_constants_1.studentSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (student_constants_1.studentRelationalFields.includes(key)) {
                    return {
                        [student_constants_1.studentRelationalFieldsMapper[key]]: {
                            id: filterData[key],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.student.findMany({
        // include: {
        // },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.student.count({
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
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.student.findUnique({
        where: {
            id,
        },
        // include: {
        // }
    });
    return result;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.student.update({
        where: {
            id,
        },
        data: payload,
        include: {},
    });
    return result;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.student.delete({
        where: {
            id,
        },
        // include: {
        // }
    });
    return result;
});
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
exports.StudentService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB,
    updateIntoDB,
};

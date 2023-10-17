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
exports.CourseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const course_constants_1 = require("./course.constants");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // const { preRequisiteCourses, ...courseData } = data;
    // console.log('course data', data);
    // console.log("pre requisite course data: ", preRequisiteCourses)
    const newCourse = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transactionClient.course.create({
            data,
            include: {
                language: true,
                instructor: true,
            },
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to create course');
        }
        return result;
    }));
    if (newCourse) {
        const responseData = yield prisma_1.default.course.findUnique({
            where: {
                id: newCourse.id,
            },
            include: {},
        });
        return responseData;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to create course');
});
const getAllFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: course_constants_1.courseSearchableFields.map(field => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.course.findMany({
        include: {
            language: true,
            instructor: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
    });
    const total = yield prisma_1.default.course.count({
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
    const result = yield prisma_1.default.course.findUnique({
        where: {
            id,
        },
        include: {
            language: true,
            instructor: true,
        },
    });
    return result;
});
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
exports.CourseService = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
};

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {
        email: data.email,
        password: data.password,
        role: data.role,
    };
    const roleData = {
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage,
        email: data.email,
        contactNo: data.contactNo,
    };
    const createdUser = yield prisma_1.default.user.create({
        data: userData,
    });
    // Step 3: Determine Role
    if (userData.role === 'instructor') {
        // Step 4: Create Instructor
        const createdInstructor = yield prisma_1.default.instructor.create({
            data: Object.assign(Object.assign({}, roleData), { name: `${roleData.firstName} ${roleData.lastName}` }),
        });
        // Step 5: Associate User with Instructor
        yield prisma_1.default.user.update({
            where: { id: createdUser.id },
            data: { instructorId: createdInstructor.id },
        });
    }
    else if (userData.role === 'student') {
        // Step 4: Create Student
        const createdStudent = yield prisma_1.default.student.create({
            data: roleData,
        });
        // Step 5: Associate User with Student
        yield prisma_1.default.user.update({
            where: { id: createdUser.id },
            data: { studentId: createdStudent.id },
        });
    }
    // const { password, ...userData } = result;
    // return userData;
});
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(data);
    const { email, password } = data;
    const isUserExist = yield prisma_1.default.user.findFirst({
        where: {
            email: email,
        },
    });
    // console.log(isUserExist);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (isUserExist.password && isUserExist.password !== password) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ userId: isUserExist.id, role: isUserExist.role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
exports.AuthService = {
    insertIntoDB,
    loginUser,
};

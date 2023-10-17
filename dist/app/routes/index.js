"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const student_routes_1 = require("../modules/student/student.routes");
const instructor_routes_1 = require("../modules/instructor/instructor.routes");
const course_routes_1 = require("../modules/course/course.routes");
const category_routes_1 = require("../modules/category/category.routes");
const user_routes_1 = require("../modules/user/user.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_routes_1.authRoutes,
    },
    {
        path: '/students',
        route: student_routes_1.studentRoutes,
    },
    {
        path: '/instructors',
        route: instructor_routes_1.instructorRoutes,
    },
    {
        path: '/courses',
        route: course_routes_1.courseRoutes,
    },
    {
        path: '/categories',
        route: category_routes_1.categoryRoutes,
    },
    {
        path: '/users',
        route: user_routes_1.userRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;

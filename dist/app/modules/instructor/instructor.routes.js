"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const instructor_controller_1 = require("./instructor.controller");
const router = express_1.default.Router();
router.get('/', instructor_controller_1.InstructorController.getAllFromDB);
// router.get(
//     '/my-courses',
//     auth(ENUM_USER_ROLE.FACULTY),
//     FacultyController.myCourses
// );
router.get('/:id', instructor_controller_1.InstructorController.getByIdFromDB);
// router.get(
//     '/my-course-students',
//     auth(ENUM_USER_ROLE.FACULTY),
//     FacultyController.getMyCourseStudents
// );
router.post('/create-instructor', 
// validateRequest(FacultyValidation.create),
instructor_controller_1.InstructorController.insertIntoDB);
router.patch('/:id', 
// validateRequest(FacultyValidation.update),
(0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), instructor_controller_1.InstructorController.updateOneInDB);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), instructor_controller_1.InstructorController.deleteByIdFromDB);
exports.instructorRoutes = router;

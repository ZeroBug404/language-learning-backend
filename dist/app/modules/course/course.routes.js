"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const router = express_1.default.Router();
router.get('/', course_controller_1.CourseController.getAllFromDB);
router.get('/:id', course_controller_1.CourseController.getByIdFromDB);
router.post('/', 
// validateRequest(CourseValidation.create),
// auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
course_controller_1.CourseController.insertIntoDB);
// router.patch(
//   '/:id',
//   // validateRequest(CourseValidation.update),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   CourseController.updateOneInDB
// );
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   CourseController.deleteByIdFromDB
// );
// router.post(
//   '/:id/assign-instructors',
//   // validateRequest(CourseValidation.assignOrRemoveFaculties),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   CourseController.assignInstructors
// );
// router.delete(
//   '/:id/remove-faculties',
//   // validateRequest(CourseValidation.assignOrRemoveFaculties),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   CourseController.removeInstructors
// );
exports.courseRoutes = router;

import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { InstructorController } from './instructor.controller';

const router = express.Router();

router.get('/', InstructorController.getAllFromDB);

// router.get(
//     '/my-courses',
//     auth(ENUM_USER_ROLE.FACULTY),
//     FacultyController.myCourses
// );

router.get('/:id', InstructorController.getByIdFromDB);

// router.get(
//     '/my-course-students',
//     auth(ENUM_USER_ROLE.FACULTY),
//     FacultyController.getMyCourseStudents
// );

router.post(
  '/create-instructor',
  // validateRequest(FacultyValidation.create),
  InstructorController.insertIntoDB
);

router.patch(
  '/:id',
  // validateRequest(FacultyValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  InstructorController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  InstructorController.deleteByIdFromDB
);

export const instructorRoutes = router;

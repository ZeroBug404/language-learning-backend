import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.get('/', CourseController.getAllFromDB);

router.get('/:id', CourseController.getByIdFromDB);

router.post(
  '/',
  // validateRequest(CourseValidation.create),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.insertIntoDB
);

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

export const courseRoutes = router;

import express from 'express';
import { CategoryController } from './category.controller';

const router = express.Router();

router.get('/', CategoryController.getAllFromDB);

router.get('/:id', CategoryController.getByIdFromDB);

router.post(
  '/create-category',
  // validateRequest(CourseValidation.create),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CategoryController.insertIntoDB
);

export const categoryRoutes = router;

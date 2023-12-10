import express from 'express';
import { appointmentRoutes } from '../modules/appointment/appointment.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { courseRoutes } from '../modules/course/course.routes';
import { instructorRoutes } from '../modules/instructor/instructor.routes';
import { studentRoutes } from '../modules/student/student.routes';
import { userRoutes } from '../modules/user/user.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/instructors',
    route: instructorRoutes,
  },
  {
    path: '/courses',
    route: courseRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/appointments',
    route: appointmentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;

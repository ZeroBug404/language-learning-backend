import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { studentRoutes } from '../modules/student/student.routes';
import { instructorRoutes } from '../modules/instructor/instructor.routes';
import { courseRoutes } from '../modules/course/course.routes';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;

import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { studentRoutes } from '../modules/student/student.routes';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;

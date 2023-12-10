import express from 'express';
import { AppointmentController } from './appointment.controller';

const router = express.Router();

router.post('/', AppointmentController.insertIntoDB);

router.get('/', AppointmentController.getAllFromDB);

router.get('/:id', AppointmentController.getByIdFromDB);

router.delete(
  '/:id',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  AppointmentController.deleteByIdFromDB
);

export const appointmentRoutes = router;

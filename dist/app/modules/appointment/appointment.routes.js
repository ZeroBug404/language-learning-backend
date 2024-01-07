"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("./appointment.controller");
const router = express_1.default.Router();
router.post('/', appointment_controller_1.AppointmentController.insertIntoDB);
router.get('/', appointment_controller_1.AppointmentController.getAllFromDB);
router.get('/:id', appointment_controller_1.AppointmentController.getByIdFromDB);
router.delete('/:id', 
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
appointment_controller_1.AppointmentController.deleteByIdFromDB);
exports.appointmentRoutes = router;

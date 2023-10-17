"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_INSTRUCTOR_UPDATED = exports.EVENT_INSTRUCTOR_CREATED = exports.instructorRelationalFieldsMapper = exports.instructorRelationalFields = exports.instructorSearchableFields = exports.instructorFilterableFields = void 0;
exports.instructorFilterableFields = [
    'searchTerm',
    'instructorId',
    'email',
    'contactNo',
    'gender',
    'designation',
];
exports.instructorSearchableFields = [
    'firstName',
    'lastName',
    'email',
    'contactNo',
    'id',
];
exports.instructorRelationalFields = ['academicFacultyId', 'academicDepartmentId'];
exports.instructorRelationalFieldsMapper = {
    academicFacultyId: 'academicFaculty',
    academicDepartmentId: 'academicDepartment'
};
exports.EVENT_INSTRUCTOR_CREATED = 'instructor.created';
exports.EVENT_INSTRUCTOR_UPDATED = 'instructor.updated';

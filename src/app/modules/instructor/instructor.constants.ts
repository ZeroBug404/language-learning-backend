export const instructorFilterableFields: string[] = [
    'searchTerm',
    'instructorId',
    'email',
    'contactNo',
    'gender',
    'designation',
];

export const instructorSearchableFields: string[] = [
    'firstName',
    'lastName',
    'email',
    'contactNo',
    'id',
];

export const instructorRelationalFields: string[] = ['academicFacultyId', 'academicDepartmentId'];
export const instructorRelationalFieldsMapper: { [key: string]: string } = {
    academicFacultyId: 'academicFaculty',
    academicDepartmentId: 'academicDepartment'
};

export const EVENT_INSTRUCTOR_CREATED = 'instructor.created'
export const EVENT_INSTRUCTOR_UPDATED = 'instructor.updated'
export type IInstructorFilterRequest = {
    searchTerm?: string | undefined;
    id?: string | undefined;
    email?: string | undefined;
    contactNo?: string | undefined;
    gender?: string | undefined;
}


export type IInstructorMyCourseStudentsRequest = {
    academicSemesterId?: string | undefined;
    courseId?: string | undefined;
    offeredCourseSectionId?: string | undefined;
};

export type InstructorCreatedEvent = {
    id: string;
    name: {
        firstName: string;
        lastName: string;
        middleName?: string;
    };
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    designation: string;
    email: string;
    contactNo: string;
    profileImage: string;
};
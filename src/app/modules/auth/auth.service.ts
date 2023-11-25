/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@prisma/client';

import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: any) => {

  const userData = {
    email: data.email,
    password: data.password,
    role: data.role,
  };

  const roleData = {
    firstName: data.firstName,
    lastName: data.lastName,
    profileImage: data.profileImage,
    email: data.email,
    contactNo: data.contactNo,
  };

  const createdUser = await prisma.user.create({
    data: userData,
  });

  // Step 3: Determine Role
  if (userData.role === 'instructor') {
    // Step 4: Create Instructor
    const createdInstructor = await prisma.instructor.create({
      data: {
        ...roleData,
        name: `${roleData.firstName} ${roleData.lastName}`,
      },
    });

    // Step 5: Associate User with Instructor
    await prisma.user.update({
      where: { id: createdUser.id },
      data: { instructorId: createdInstructor.id },
    });
  } else if (userData.role === 'student') {
    // Step 4: Create Student
    const createdStudent = await prisma.student.create({
      data: roleData,
    });

    // Step 5: Associate User with Student
    await prisma.user.update({
      where: { id: createdUser.id },
      data: { studentId: createdStudent.id },
    });
  }

  // const { password, ...userData } = result;

  // return userData;
};

const loginUser = async (data: User) => {
  // console.log(data);

  const { email, password } = data;

  const isUserExist = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  // console.log(isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (isUserExist.password && isUserExist.password !== password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const accessToken = jwtHelpers.createToken(
    { userId: isUserExist.id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  insertIntoDB,
  loginUser,
};

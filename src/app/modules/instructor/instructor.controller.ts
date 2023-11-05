import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { instructorFilterableFields } from './instructor.constants';
import { InstructorService } from './instructor.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const instructorData = req.body

    const result = await InstructorService.insertIntoDB(instructorData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Instructor created successfully',
        data: result
    });
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, instructorFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await InstructorService.getAllFromDB(filters, options);

    console.log('result', result);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Instructors fetched successfully',
        meta: result.meta,
        data: result.data
    });
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await InstructorService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Instructor fetched successfully',
        data: result
    });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await InstructorService.updateOneInDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Instructor updated successfully',
        data: result
    });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await InstructorService.deleteByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Instructor delete successfully',
        data: result
    });
});

export const InstructorController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
};
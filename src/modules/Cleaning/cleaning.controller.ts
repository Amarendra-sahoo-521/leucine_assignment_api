import { Request, Response } from "express";
import { createNewCleaning, getCleaning, getCleaningByID, update_cleaning } from "./cleaning.service";
import { CreateCLDto, UpdateCLDto } from "./cleaning.dto";
import { formatPaginationResponse, parsePaginationParams } from "../../utils/pagination";

export const getAllCleaningByEqId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { page, limit } = parsePaginationParams(req.query);

        const { data, total } = await getCleaning(Number(id), Number(page), Number(limit))

        res.status(200).json(formatPaginationResponse(data, total || 0, page, limit, "Cleanings fetched successfully"));
    } catch (error: any) {
        console.log("error-->", error);

        res.status(error.status).json({
            data: null,
            message: error,
            status: false,
        });
    }

}

export const getAllCleaningById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await getCleaningByID(Number(id),)

        res.status(200).json(result);
    } catch (error: any) {
        res.status(error.status).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}

export const createCleaning = async (req: Request, res: Response) => {
    try {
        const dto: CreateCLDto = req.body;

        const result = await createNewCleaning(dto);
        res.status(result.status ? 201 : 400).json(result);
    } catch (error: any) {
        res.status(error.status).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}

export const updateCleaning = async (req: Request, res: Response) => {
    try {
        const dto: UpdateCLDto = req.body;
        const { id } = req.params
        const result = await update_cleaning(dto, Number(id));
        res.status(result.status ? 201 : 400).json(result);
    } catch (error: any) {
        console.log("err", error);

        res.status(error.status).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}
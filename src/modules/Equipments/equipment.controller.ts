import { formatPaginationResponse, parsePaginationParams } from "../../utils/pagination";
import { Request, Response } from "express";
import { createNewEquipment, delete_equipment, getEquipments, update_equipment } from "./equipment.service";
import { CreateEQDto } from "./equipment.dto";

export const getAllEquipments = async (req: Request, res: Response) => {
    try {
        const { page, limit } = parsePaginationParams(req.query);
        const active =
            req.query.active !== undefined
                ? req.query.active === "true"
                : undefined;
        const { data, total } = await getEquipments(Number(page), Number(limit),active)

        res.status(200).json(
            formatPaginationResponse(data, total || 0, page, limit, "Equipments fetched successfully"));
    } catch (error: any) {
        res.status(error.status).json({
            data: null,
            message: error,
            status: false,
        });
    }

}

export const createEquipment = async (req: Request, res: Response) => {
    try {
        const dto: CreateEQDto = req.body;

        const result = await createNewEquipment(dto);
        res.status(result.status ? 201 : 400).json(result);
    } catch (error: any) {
        res.status(error.status).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}

export const updateEquipment = async (req: Request, res: Response) => {
    try {
        const dto: CreateEQDto = req.body;
        const {id} = req.params

        const result = await update_equipment(Number(id),dto);
        res.status(result.status ? 201 : 400).json(result);
    } catch (error: any) {
        res.status(error.status).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}

export const deleteEquipment = async (req: Request, res: Response) => {
    try {
       
        const {id} = req.params

        const result = await delete_equipment(Number(id));
        res.status(result.status ? 201 : 400).json(result);
    } catch (error: any) {
        res.status(error.status).json({
            data: null,
            message: error.message,
            status: false,
        });
    }

}
import { ILike } from "typeorm";
import { AppDataSource } from "../../config/database";
import { Equipment } from "../../entities/equipment.entity";
import { CreateEQDto } from "./equipment.dto";
import { Status } from "../../enum/common.enum";

export const equipmentRepository = AppDataSource.getRepository(Equipment);


export const getEquipments = async (page: number, limit: number,active?: boolean) => {
    try {
        const skip = (page - 1) * limit;
        
         const where: any = {};

        if (active !== undefined) {
            where.status = active ? Status.ACTIVE : Status.INACTIVE;
        }
        
        const [equipments, total] = await equipmentRepository.findAndCount({where,
            skip,
            take: limit,
        });
        return {
            data: equipments,
            status: true,
            total,
        };
    } catch (err: any) {
        throw err
    }
}

export const createNewEquipment = async (data: CreateEQDto) => {
    try {
        const newRecord = equipmentRepository.create(data)

        const savedEquipment = await equipmentRepository.save(newRecord);

        return {
            data: savedEquipment,
            message: `Equipment created successfully`,
            status: true,
        };
    } catch (err: any) {
        throw err
    }
}

export const update_equipment = async (id:number,data: CreateEQDto) => {
    try {
        const existing = await equipmentRepository.findOneBy({id})
        if(!existing){
            throw new Error("Equipment not found");
        }

         await equipmentRepository.update(id,data);

        return {
            data: null,
            message: `Equipment Updated successfully`,
            status: true,
        };
    } catch (err: any) {
        throw err
    }
}

export const delete_equipment = async (id:number) => {
    try {
        const existing = await equipmentRepository.findOneBy({id})
        if(!existing){
            throw new Error("Equipment not found");
        }

        await equipmentRepository.delete(id);

        return {
            data: null,
            message: `Equipment deleted successfully`,
            status: true,
        };
    } catch (err: any) {
        throw err
    }
}
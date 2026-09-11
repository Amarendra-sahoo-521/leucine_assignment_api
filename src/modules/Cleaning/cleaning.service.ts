import { ILike } from "typeorm";
import { AppDataSource } from "../../config/database";

import { CreateCLDto, UpdateCLDto } from "./cleaning.dto";
import { Cleaning } from "../../entities/cleaning.entity";
import { Equipment } from "../../entities/equipment.entity";
import { Audit } from "../../entities/audit.entity";

const cleaningRepository = AppDataSource.getRepository(Cleaning);
const equipmentRepository = AppDataSource.getRepository(Equipment);
const auditRepository = AppDataSource.getRepository(Audit);


export const getCleaning = async (id: number, page: number, limit: number) => {
    try {
        const skip = (page - 1) * limit;


        const [Cleanings, total] = await cleaningRepository.findAndCount({
            where: { equipment: { id } },
            skip,
            take: limit,
        });
        return {
            data: Cleanings,
            status: true,
            total
        };
    } catch (err: any) {
        throw err
    }
}

export const getCleaningByID = async (id: number) => {
    try {
        const Cleanings = await cleaningRepository.findOne({
            where: { id }, relations: {
                audit: true,
            },
        });
        return {
            data: Cleanings,
            status: true,
            message:"Audit fetched successfully"
        };
    } catch (err: any) {
        throw err
    }
}

export const createNewCleaning = async (data: CreateCLDto) => {
    try {
        const { eq_id,status, ...rest } = data;
        const equipment: any = await equipmentRepository.findOneBy({ id: Number(eq_id) })

        if (!equipment) {
            throw new Error("Equipment not found");
        }
        const payload = { ...rest, equipment: equipment }

        const newRecord = cleaningRepository.create(payload)

        const savedCleaning: any = await cleaningRepository.save(newRecord);

        const { equipment: eq,
            createdAt,
            updatedAt, id,
            ...rst } = savedCleaning

        const auditRecords = [];

        for (const key in rst) {
            const auditPayload = {
                cleaning: savedCleaning,
                field_name: key,
                old_value: null,
                new_value: rst[key],
                changed_by: null,
                changed_at: null,
            };

            const audit = auditRepository.create(auditPayload);

            auditRecords.push(audit);
        }

        await auditRepository.save(auditRecords);

        return {
            data: savedCleaning,
            message: `Cleaning created successfully`,
            status: true,
        };
    } catch (err: any) {
        throw err
    }
}

export const update_cleaning = async (data: UpdateCLDto, id: number) => {
    try {
        const { notes, status, changed_by,...rest } = data;
        const existing: any = await cleaningRepository.findOneBy({ id })

        if (!existing) {
            throw new Error("Cleaning not found");
        }
        await cleaningRepository.update(id, {
            notes,
            status,...rest
        });

        const auditRecords = [];
        const obj: any = { notes, status };
        for (const key in obj) {
            const auditPayload = {
                cleaning: existing,
                field_name: key,
                old_value: existing[key],
                new_value: obj[key],
                changed_by: changed_by,
                changed_at: new Date().toISOString(),
            };

            const audit = auditRepository.create(auditPayload);

            auditRecords.push(audit);
        }

        await auditRepository.save(auditRecords);

        return {
            data: null,
            message: `Cleaning updated successfully`,
            status: true,
        };
    } catch (err: any) {
        throw err
    }
}
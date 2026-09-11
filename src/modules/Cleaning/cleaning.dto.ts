import { IsEnum, IsOptional, IsString } from "class-validator";
import { CleaningStatus, Status } from "../../enum/common.enum";


export class CreateCLDto {
    @IsString()
    cleanedBy!: string;

    @IsString()
    cleanedAt!: string;

    @IsString()
    method!: string;

    @IsString()
    notes!: string;

    @IsString()
    eq_id!: string;

    @IsEnum(CleaningStatus)
    status!: CleaningStatus;
}

export class UpdateCLDto {
    @IsString()
    cleanedBy!: string;

    @IsString()
    cleanedAt!: string;

    @IsString()
    method!: string;

    @IsString()
    notes!: string;

    @IsString()
    changed_by!: string;

    @IsEnum(CleaningStatus)
    status?: CleaningStatus;
}
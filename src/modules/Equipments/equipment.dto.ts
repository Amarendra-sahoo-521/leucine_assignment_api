import { IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "../../enum/common.enum";

export class CreateEQDto {
    @IsString()
    name!: string;

    @IsString()
    code!: string;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
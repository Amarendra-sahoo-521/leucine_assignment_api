import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "../../enum/common.enum";

export class CreateEQDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import { Status } from "../enum/common.enum";
import { Cleaning } from "./cleaning.entity";

@Entity()
export class Equipment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    code!: string;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.ACTIVE,

    })
    status!: Status;

    @OneToMany(() => Cleaning, (cl) => cl.equipment, { nullable: true })
    cleaning!: Cleaning[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { CleaningStatus, Status } from "../enum/common.enum";
import { ManyToOne } from "typeorm/browser";
import { Equipment } from "./equipment.entity";
import { Audit } from "./audit.entity";

@Entity()
export class Cleaning {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    cleanedBy!: string;

    @Column()
    cleanedAt!: string;

    @Column()
    method!: string;

    @Column()
    notes!: string;

    @ManyToOne(() => Equipment, (eq) => eq.cleaning, { onDelete: "CASCADE" })
    @JoinColumn({ name: "equipmentId" })
    equipment!: Equipment;

    @OneToMany(() => Audit, (cl) => cl.cleaning, { nullable: true })
    audit!: Audit[];

    @Column({
        type: "enum",
        enum: CleaningStatus,
        default: CleaningStatus.PENDING,
    })
    status!: CleaningStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
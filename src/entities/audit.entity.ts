import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import { Cleaning } from "./cleaning.entity";

@Entity()
export class Audit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: true })
  changed_by!: string | null;

  @Column({ type: "varchar", nullable: true })
  changed_at!: string | null;

  @Column({ type: "varchar" })
  field_name!: string;

  @Column({ type: "text", nullable: true })
  old_value!: string | null;

  @Column({ type: "text", nullable: true })
  new_value!: string | null;

  @ManyToOne(() => Cleaning, (cleaning) => cleaning.audit, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "recordId" })
  cleaning!: Cleaning;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
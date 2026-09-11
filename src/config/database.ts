import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Equipment } from "../entities/equipment.entity";
import { Cleaning } from "../entities/cleaning.entity";
import { Audit } from "../entities/audit.entity";

dotenv.config();

const entities = [
  Equipment, Cleaning, Audit
]

export const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: true,

  logging: false,

  entities: entities,
  subscribers: [],
});
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "admin",
  database: "stripe-db",
  synchronize: true,
  logging: false,
  entities: ["dist/entity/**/*.js"],
  migrations: ["dist/migration/**/*.js"],
  subscribers: ["dist/subscriber/**/*.js"],
});

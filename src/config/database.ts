import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/entities/user.entity";

require('dotenv').config()

export function getDatabaseConfig() {
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: process.env.DB_SOCK,
    entities: [User],
    synchronize: true,
  });
}
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "src/entities/user.entity";

import { CONFIG } from "src/utils/config";


export function getDatabaseConfig() {
  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: CONFIG.get('DB_HOST'),
    port: 3306,
    username: CONFIG.get('DB_USER'),
    password: CONFIG.get('DB_PASS'),
    database: CONFIG.get('DB_NAME'),
    socketPath: CONFIG.get('DB_SOCK'),
    entities: [User],
    synchronize: true,
  });
}
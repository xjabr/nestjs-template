import { User } from "src/entities/user.entity";

export interface IRequest extends Request {
	user: User; // should be User but get problems with where queries
}
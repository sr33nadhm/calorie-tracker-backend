import { Id } from "objection";
import Base from "./Base.model";

export class User extends Base {
  id!: Id;
  name!: string;
  email!: string;
  role!: string;
  calorieLimit!: number;
  spendLimit!: number;

  static tableName = "users";
}

export default User;

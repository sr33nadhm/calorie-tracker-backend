import { Id, RelationMappings } from "objection";
import { User } from "./User.model";
import Base from "./Base.model";

export class Meal extends Base {
  id!: Id;
  name!: string;
  date!: string;
  calorie!: number;
  price!: number;
  userId!: Id;
  user!: User;

  static tableName = "meals";

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Base.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "meals.userId",
          to: "appusers.id",
        },
      },
    };
  }
}

export default Meal;

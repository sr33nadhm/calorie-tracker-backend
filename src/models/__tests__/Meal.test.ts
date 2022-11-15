import User from "../User.model";
import Meal from "../Meal.model";

let user: User;
const now = new Date().toISOString();

beforeAll(async () => {
  user = await User.query().insert({
    name: "User2",
    email: "sample@test.com",
    role: "user",
  });
});

describe.each([
  ["Dosa", now, 50, 3],
  ["Biriyani", now, 1000, 20],
])("Meal %i x %i x %i", (name, date, calorie, price) => {
  let meal: Meal;

  beforeAll(async () => {
    meal = await Meal.query().insert({
      name,
      date,
      calorie,
      userId: user.id,
      price,
    });
  });

  it("should have relation mapping", () => {
    expect(Meal.relationMappings).toHaveProperty("user");
  });
});

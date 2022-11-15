import User from "../User.model";

const Users = [
  {
    name: "Test Admin",
    email: "admin@usertest.com",
    role: "admin",
  },
  {
    name: "Test User",
    email: "user@usertest.com",
    role: "user",
  },
];

describe.each([
  ["Admin defaults", Users[0]],
  ["User defaults", Users[1]],
])("User with %s", (_, UserData) => {
  let user: User;
  const { name, email, role } = UserData;

  beforeAll(async () => {
    user = await User.query().insertAndFetch({
      name,
      email,
      role,
    });
  });

  it("should have default spend limit", () => {
    expect(user.spendLimit).toBe(1000);
  });

  it("should have default calorie limit", () => {
    expect(user.calorieLimit).toBe(2100);
  });
});

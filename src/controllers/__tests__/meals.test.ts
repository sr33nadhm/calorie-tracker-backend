import { Id } from "objection";
import HttpStatus from "http-status-codes";
import request from "supertest";

import app from "../../app";
import { User, Meal } from "../../models";
import factories from "../../factories";
import urlJoin from "url-join";

const server = app.listen();

afterAll(() => server.close());

describe("meals get", () => {
  let userId: Id;
  let email: string;

  beforeEach(async () => {
    var dbEntry = await User.query().insert(factories.user.build());
    userId = dbEntry.id;
    email = dbEntry.email;
  });

  it("should get all meals for correct email", async () => {
    const [price, calorie] = [10, 200];
    const sampleSize = 3;
    const meals = factories.meal.buildList(sampleSize, {
      userId,
      price,
      calorie,
    });

    const ids = await Promise.all(
      meals.map(async ({ id, ...data }) => (await Meal.query().insert(data)).id)
    );

    const response = await request(server)
      .post("/meals")
      .send({ email: email, page: 0, limit: 10 });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.data.results.length).toBe(ids.length);

    response.body.data.results.forEach((meal: Meal) => {
      expect(meal.price).toBeDefined();
      expect(meal.calorie).toBeDefined();
      expect(meal.userId).toBe(userId);
    });
  });

  it("should get all not-found for wrong email", async () => {
    const response = await request(server)
      .post("/meals")
      .send({ email: "null", page: 0, limit: 10 });

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe("User not found");
  });

  it("should get by id", async () => {
    const meal = factories.meal.build({ userId, price: 10, calorie: 200 });
    const id = (await Meal.query().insert(meal)).id;

    const response = await request(server).get(
      urlJoin("/meals", id.toString())
    );

    expect(response.status).toBe(HttpStatus.OK);
    expect(typeof response.body.id).toBe("number");
    expect(response.body.id).toBe(id);
  });

  it("should return not-found if not found", async () => {
    const response = await request(server).get(urlJoin("/meals", "0"));
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});

describe("meal create", () => {
  let newUser: User;

  beforeEach(async () => {
    newUser = await User.query().insert(factories.user.build());
  });

  it("should succeed", async () => {
    const meal = factories.meal.build({
      price: 4,
      calorie: 400,
      email: newUser.email,
    });

    const response = await request(server).put("/meals").send(meal);
    expect(response.status).toBe(HttpStatus.CREATED);

    const fetchedMeal = await Meal.query()
      .findById(response.body.id)
      .withGraphFetched("user");

    if (!fetchedMeal) {
      throw new Error("Meal not found");
    }

    const { name, calorie, price, user } = fetchedMeal;

    expect(name).toBe(meal.name);
    expect(calorie).toBe(meal.calorie);
    expect(price).toBe(meal.price);
    expect(newUser.id).toBe(user?.id);
  });

  it("should return not-found because user does not exists", async () => {
    const meal = factories.meal.build({
      price: 4,
      calorie: 400,
      email: "null",
    });

    const response = await request(server).put("/meals").send(meal);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});

describe("meal update", () => {
  let user: User;
  let meal: Meal;
  const now = new Date();

  beforeEach(async () => {
    user = await User.query().insert(factories.user.build());
    meal = await Meal.query().insert(
      factories.meal.build({
        price: 4,
        calorie: 400,
        userID: user.id,
      })
    );
  });

  it("should succeed to update the meal", async () => {
    const [newName, newDate, newPrice, newCalorie] = [
      "New Pudding",
      now.toISOString(),
      5,
      500,
    ];
    const response = await request(server)
      .patch("/meals/" + meal.id)
      .send({
        name: newName,
        date: newDate,
        price: newPrice,
        calorie: newCalorie,
        email: user.email,
      });
    meal = response.body;
    expect(response.status).toBe(HttpStatus.OK);
    expect(meal.name).toBe(newName);
    expect(meal.date).toBe(newDate);
    expect(meal.price).toBe(newPrice);
    expect(meal.calorie).toBe(newCalorie);
    expect(meal.userId).toBe(user.id);
  });

  it("should fail to update if user not found", async () => {
    const [newName, newDate, newPrice, newCalorie] = [
      "New Pudding",
      now.toISOString(),
      5,
      500,
    ];
    const response = await request(server)
      .patch("/meals/" + meal.id)
      .send({
        name: newName,
        date: newDate,
        price: newPrice,
        calorie: newCalorie,
        email: "null",
      });
    var result = response.body;
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe("User not found");
  });

  it("should fail to update if meal not found", async () => {
    const [newName, newDate, newPrice, newCalorie] = [
      "New Pudding",
      now.toISOString(),
      5,
      500,
    ];
    const response = await request(server)
      .patch("/meals/" + 0)
      .send({
        name: newName,
        date: newDate,
        price: newPrice,
        calorie: newCalorie,
        email: user.email,
      });
    var result = response.body;
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe("Food item not found");
  });
});

describe("meal delete", () => {
  let user: User;
  let meal: Meal;

  beforeEach(async () => {
    user = await User.query().insert(factories.user.build());
    meal = await Meal.query().insert(
      factories.meal.build({
        price: 4,
        calorie: 400,
        userID: user.id,
      })
    );
  });

  it("should delete the meal", async () => {
    const response = await request(server).delete("/meals/" + meal.id);
    expect(response.status).toBe(HttpStatus.OK);
  });

  it("should not delete and return 404 status code when meal doesnt exists", async () => {
    const response = await request(server).delete("/meals/" + 0);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});

describe("meals check limit", () => {
  let userId: Id;
  let email: string;

  beforeEach(async () => {
    var dbEntry = await User.query().insert(factories.user.build());
    userId = dbEntry.id;
    email = dbEntry.email;
  });

  it("should get limits for correct email", async () => {
    const [price, calorie] = [10, 200];
    const sampleSize = 3;
    const meals = factories.meal.buildList(sampleSize, {
      userId,
      price,
      calorie,
    });

    const ids = await Promise.all(
      meals.map(async ({ id, ...data }) => await Meal.query().insert(data))
    );

    const totalCalories = ids.reduce((sum, curr) => {
      return (sum += curr.calorie);
    }, 0);

    const totalCost = ids.reduce((sum, curr) => {
      return (sum += curr.price);
    }, 0);

    const response = await request(server).post("/meals/limits").send({
      email: email,
      before: new Date().toISOString(),
      after: "2022-07-01T00:00:00.000Z",
    });

    const result = response.body;

    expect(response.status).toBe(HttpStatus.OK);
    expect(result.calories).toBe(totalCalories);
    expect(result.cost).toBe(totalCost);
  });

  it("should get all not-found for wrong email", async () => {
    const response = await request(server).post("/meals/limits").send({
      email: "null",
      before: new Date().toISOString(),
      after: "2022-07-01T00:00:00.000Z",
    });

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});

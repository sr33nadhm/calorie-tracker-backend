import HttpStatus from "http-status-codes";
import request from "supertest";

import app from "../../app";
import { User } from "../../models";
import factories from "../../factories";

const server = app.listen();

afterAll(() => server.close());

describe("user authenticate", () => {
  it("should authenticate if user exists", async () => {
    const user = factories.user.build();
    const dbEntry = await User.query().insertAndFetch(user);
    const response = await request(server)
      .post("/users/authenticate")
      .send({ checkOnly: false, ...user });

    expect(response.status).toBe(HttpStatus.OK);
    expect(typeof response.body.email).toBe("string");
    expect(response.body.email).toBe(dbEntry.email);
    expect(response.body.role).toBe(dbEntry.role);
  });

  it("should return user if user creation allowed", async () => {
    const user = factories.user.build();
    const response = await request(server)
      .post("/users/authenticate")
      .send({ checkOnly: false, ...user });
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(typeof response.body.email).toBe("string");
    expect(response.body.email).toBe(user.email);
    expect(response.body.role).toBe(user.role);
  });

  it("should return not-found if user creation blocked", async () => {
    const user = factories.user.build();
    const response = await request(server)
      .post("/users/authenticate")
      .send({ checkOnly: true, ...user });
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe("Unable to authenticate user");
  });
});

describe("user authenticate", () => {
  it("should return results for admin", async () => {
    const user = factories.user.build();
    user.role = "admin";
    await User.query().insertAndFetch(user);
    const response = await request(server)
      .post("/users/list")
      .send({ checkOnly: false, ...user });

    expect(response.status).toBe(HttpStatus.OK);
  });

  it("should return forbidden for user", async () => {
    const user = factories.user.build();
    await User.query().insertAndFetch(user);
    const response = await request(server)
      .post("/users/list")
      .send({ checkOnly: false, ...user });

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  it("should return not-found if user not present", async () => {
    const user = factories.user.build();
    user.email = "null";
    const response = await request(server)
      .post("/users/list")
      .send({ checkOnly: true, ...user });
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe("Unable to authenticate user");
  });
});

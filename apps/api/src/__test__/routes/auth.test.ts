import supertest from "supertest";
import { createServer } from "../../server.ts";
import { User, UserModel } from "@repo/types/mongo";
import { loadEnvConfig } from "../../util/config.ts";
import { connectMongoDB } from "../../db/mongodb.ts";
import mongoose from "mongoose";
import { Server } from "http";
import { RedisClientType } from "@redis/client";
import { Channel, Connection } from "amqplib";
import { createRedisClient } from "../../service/redis.ts";
import { connectRabbitMq } from "../../service/rabbitmq.ts";
import { hashPassword } from "../../util/crypto.ts";

describe("Test Auth Route", () => {
  let server: Server;
  let redis: RedisClientType;
  let rabbit: { channel: Channel; connection: Connection };
  const config = loadEnvConfig();

  beforeAll(async () => {
    // setup connectiion
    await connectMongoDB(config.MONGODB_URL);
    redis = await createRedisClient(config);
    rabbit = await connectRabbitMq(config);

    // start server
    const app = createServer(config, redis, rabbit);
    server = app.listen(4000);
  });

  afterAll(async () => {
    await redis.disconnect();
    await rabbit.connection.close();
    await mongoose.disconnect();
    server.close();
  });

  describe("Test user signup", () => {
    let reqBody: UserModel;
    beforeAll(async () => {
      reqBody = {
        fullname: "Test user signup",
        email: "usersignup@gmail.com",
        password: "usersignuppassword",
      };
    });
    afterAll(async () => {
      await User.deleteOne({
        fullname: reqBody.fullname,
        email: reqBody.email,
      });
    });
    test("signup", async () => {
      await supertest(server)
        .post(`/v1/auth/signup`)
        .send(reqBody)
        .expect("Content-Type", /json/)
        .expect(201)
        .then((res) => {
          expect(res.body.success).toEqual(true);
        });
    });
  });

  describe("Test user signin", () => {
    let reqBody: UserModel;
    beforeAll(async () => {
      reqBody = {
        fullname: "Test user signin",
        email: "usersignin@gmail.com",
        password: "usersigninpassword",
      };
      await User.create({
        fullname: reqBody.fullname,
        email: reqBody.email,
        password: await hashPassword(reqBody.password),
      });
    });
    afterAll(async () => {
      await User.deleteOne({
        fullname: reqBody.fullname,
        email: reqBody.email,
      });
    });
    test("", async () => {
      await supertest(server)
        .post(`/v1/auth/signin`)
        .send({ email: reqBody.email, password: reqBody.password })
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.success).toEqual(true);
        });
    });
  });
});

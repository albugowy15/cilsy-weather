import supertest from "supertest";
import { createServer } from "../../server.ts";
import { createJWTToken } from "../../util/token.ts";
import { Location, User } from "@repo/types/mongo";
import { loadEnvConfig } from "../../util/config.ts";
import { connectMongoDB } from "../../db/mongodb.ts";
import mongoose from "mongoose";
import { Server } from "http";
import { RedisClientType } from "@redis/client";
import { Channel, Connection } from "amqplib";
import { createRedisClient } from "../../service/redis.ts";
import { connectRabbitMq } from "../../service/rabbitmq.ts";

describe("Test Weather Route", () => {
  let token: string;
  let locationId: string;
  let userId: string;
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

    // test user
    const user = await User.create({
      fullname: "User test get weather",
      email: "randommail@gmail.com",
      password: "randompassword",
    });
    userId = user._id.toString();

    // jwt token
    token = createJWTToken(
      {
        email: user.email,
        id: user._id.toString(),
      },
      process.env.JWT_SECRET!,
      "1d",
    );

    // test location
    // Jakarta lon and lat: https://www.latlong.net/place/jakarta-indonesia-27575.html
    const location = await Location.create({
      country_code: "ID",
      city_name: "Jakarta",
      lat: -6.2,
      lon: 106.816666,
      user_id: user._id,
    });
    locationId = location._id.toString();
  });

  afterAll(async () => {
    await User.deleteOne({ _id: userId });
    await Location.deleteOne({ _id: locationId });
    await redis.disconnect();
    await rabbit.connection.close();
    await mongoose.disconnect();
    server.close();
  });

  test("fetch weather for specified location", async () => {
    await supertest(server)
      .get(`/v1/weathers/location/${locationId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.success).toEqual(true);
      });
  });

  test("refresh weather for specified location", async () => {
    await supertest(server)
      .post(`/v1/weathers/location/${locationId}/refresh`)
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.success).toEqual(true);
      });
  });

  test("refresh weather for all user saved locations", async () => {
    await supertest(server)
      .post(`/v1/weathers/refresh`)
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.success).toEqual(true);
      });
  });
});

import amqp from "amqplib";
import { Config } from "../util/config";

export async function connectRabbitMq(config: Config) {
  const connection = await amqp.connect(config.RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(config.REFRESH_WEATHER_QUEUE, { durable: false });
  return { channel, connection };
}

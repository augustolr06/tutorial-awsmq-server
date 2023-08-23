import express, { Request, Response } from "express";
import amqp from "amqplib";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function connect() {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.AMAZON_MQ_ENDPOINT,
      port: parseInt(process.env.AMAZON_MQ_PORT),
      username: process.env.AMAZON_MQ_USERNAME,
      password: process.env.AMAZON_MQ_PASSWORD,
    });

    const channel = await connection.createChannel();

    const queueName = "my_queue";
    await channel.assertQueue(queueName, { durable: false });

    console.log("Waiting for messages...");
    channel.consume(
      queueName,
      (msg) => {
        msg && console.log(`Received message: ${msg.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

connect();

import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

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

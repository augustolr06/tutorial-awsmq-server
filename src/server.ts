import amqp from "amqplib";
import dotenv from "dotenv";

const queue = "queue_test_1";

dotenv.config();

async function connect() {
  try {
    amqp.connect(
      {
        hostname: process.env.AMAZON_MQ_ENDPOINT,
        port: parseInt(process.env.AMAZON_MQ_PORT),
        username: process.env.AMAZON_MQ_USERNAME,
        password: process.env.AMAZON_MQ_PASSWORD,
      },
      (err: any, conn: any) => {
        if (err) throw err;

        // Listener
        conn.createChannel((err: any, ch2: any) => {
          if (err) throw err;

          ch2.assertQueue(queue);

          ch2.consume(queue, (msg: any) => {
            if (msg !== null) {
              console.log(msg.content.toString());
              ch2.ack(msg);
            } else {
              console.log("Consumer cancelled by server");
            }
          });
        });

        // Sender
        conn.createChannel((err: any, ch1: any) => {
          if (err) throw err;

          ch1.assertQueue(queue);

          setInterval(() => {
            ch1.sendToQueue(queue, Buffer.from("something to do"));
          }, 1000);
        });
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

connect();

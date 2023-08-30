import amqp from "amqplib/callback_api";
import dotenv from "dotenv";

amqp.connect(process.env.AMAZON_MQ_COMPLETE_URL, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = "hello";

    channel.assertQueue(queue, {
      durable: false,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(
      queue,
      function (msg) {
        console.log(" [x] Received %s", msg?.content.toString());
      },
      {
        noAck: true,
      }
    );
  });
});

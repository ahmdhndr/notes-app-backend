const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    // koneksi ke RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    // membuat channel
    const channel = await connection.createChannel();
    // membuat queue
    await channel.assertQueue(queue, {
      durable: true,
    });

    // kirim pesan dalam bentuk Buffer ke queue
    await channel.sendToQueue(queue, Buffer.from(message));

    // tutup koneksi setelah satu detik berlangsung dari pengiriman pesan
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;

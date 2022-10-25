exports.startConsuming = async ({ channel }, queueName, callback) => {
    await channel.consume(queueName, data => {
        let content = Buffer.from(data.content).toString();
        callback(JSON.parse(content));
        channel.ack(data);
    });
};

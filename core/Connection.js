const amqplib = require('amqplib');

class Connection
{
    async connect(url){
        this.connection = await amqplib.connect(url);
        this.channel    = await this.connection.createChannel();
        await this.channel.assertQueue("default");
        return {
            connection: this.connection,
            channel: this.channel
        };
    }
}

module.exports = {
    Connection,
};
  
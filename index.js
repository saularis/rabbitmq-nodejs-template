const express = require("express");
const amqp = require('amqplib');
const app = express();
const PORT = process.env.PORT || 3000;
const actions = require('./actions');

app.use(express.json());

var channel, connection;
async function connectQueue() {   
    try {
        connection = await amqp.connect("amqp://localhost");
        channel    = await connection.createChannel();
        await channel.assertQueue("queue1");

        channel.consume("queue1", data => {
            console.log('queue1');
            let content = Buffer.from(data.content);
            content = JSON.parse(content);
            actions[content.action](content);
            channel.ack(data);
        });

        await channel.assertQueue("default");
        channel.consume("default", data => {
            console.log('default');
            console.log(`${Buffer.from(data.content)}`);
            channel.ack(data);
        });

    } catch (error) {
        console.log(error);
    }
}

async function sendData (data) {
    // send data to queue
    let queueName = data.queueName ? data.queueName : 'default';
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    // `await channel.close();
    // await connection.close(); `
}

connectQueue();

app.get("/queue", (req, res) => {
    let data = {
        'queueName': 'queue1',
        'action': 'updateMT',
        'data': {
            'fileCode': 'sample_file_code',
            'languageCode': 'langCode',
            'clientId': 1,
        }
    };
    let data2 = {
        'action': 'action1',
        'data': {
            'fileCode': 'sample_file_code',
            'languageCode': 'langCode',
            'clientId': 1,
        }
    };
    sendData(data);
    sendData(data2);
    console.log('message sent to queue');
    res.send("Hello world");
});
app.listen(PORT, () => console.log("Server running at port " + PORT));
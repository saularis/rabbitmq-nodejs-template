const express = require("express");
const amqp = require('amqplib');
const app = express();
const PORT = process.env.PORT || 3000;
const actions = require('./actions');
const { Connection } = require( "./core/Connection" );

app.use(express.json());

async function sendData (q, data) {
    let queue = new Connection();
    let { connection, channel } = await queue.connect("amqp://localhost");
    try{
        await channel.sendToQueue(q, Buffer.from(JSON.stringify(data)));
    } catch(error){
        await channel.assertQueue(q);
        await channel.sendToQueue(q, Buffer.from(JSON.stringify(data)));
    }
    await channel.close();
    await connection.close();
}

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
        'queueName': 'queue2',
        'data': {
            'fileCode': 'sample_file_code_2',
            'languageCode': 'langCode_2',
            'clientId': 2,
        }
    };
    // sendData('default', data);
    sendData('queue20', data2);
    console.log('message sent to queue');
    res.send("Hello world");
});
app.listen(PORT, () => console.log("Server running at port " + PORT));
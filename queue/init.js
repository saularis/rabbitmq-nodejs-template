const { Connection } = require("../core/Connection");
const consumer = require("../consumer");

exports.init = async (actions) => {
    let queueConnection = new Connection();
    let q = await queueConnection.connect("amqp://localhost");
    for(let queue in actions){
        consumer.startConsuming(q, queue, actions[queue]);
    }
};
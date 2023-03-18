const mongoose = require('mongoose');
const mongoURI = "127.0.0.1:27017";

const database = 'gnotebook';

async function connectToMongo(){
    await mongoose.connect(`mongodb://${mongoURI}/${database}`);
    console.log('Connected Successfully');
}
module.exports = connectToMongo;
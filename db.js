const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://gnotedb:d1r54ev9l@gnotedb.nzssu1y.mongodb.net";

const database = 'gnotebook';

async function connectToMongo(){
    await mongoose.connect(`${mongoURI}/${database}`);
    console.log('Connected Successfully');
}
module.exports = connectToMongo;


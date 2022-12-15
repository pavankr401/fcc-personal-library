const { MongoClient } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

async function main(callback){
  try{
    await client.connect();
    console.log("connected to db");
    callback(client);
  }
  catch(e){
    console.error(e);
    throw new Error('unable to connect db');
  }
}

module.exports = main;
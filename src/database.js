const { MongoClient } = require("mongodb");

const CONNECTION_STRING =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const DB_NAME = "DynamiskWebbutveckling_Inlamning_2";

async function getDatabase() {
    const client = new MongoClient(CONNECTION_STRING);
    await client.connect();
    const db = await client.db(DB_NAME);
    return db;
}

module.exports = getDatabase;

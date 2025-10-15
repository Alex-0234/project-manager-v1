import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = MONGODB_URI;
const client = new MongoClient(uri);

export async function connectDB() {
    try {
        await client.connect();
        console.log('Connected');
        return client.db('ProjectManagerDB');
    }
    catch(err) {
        console.log('Connection failed: ', err);
    }
}
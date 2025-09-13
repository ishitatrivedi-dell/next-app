// app/lib/mongodb.js
import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/assignment?retryWrites=true&w=majority";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, { maxPoolSize: 10 });
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;

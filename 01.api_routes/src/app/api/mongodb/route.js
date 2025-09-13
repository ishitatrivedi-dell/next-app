import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/";
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("assignment");              // database name
    const coll = db.collection("companies");       // collection name

    const docs = await coll.find({}).toArray();

    // Convert ObjectId -> string so JSON can handle it
    const cleanDocs = docs.map(d => ({ ...d, _id: d._id.toString() }));

    return new Response(JSON.stringify(cleanDocs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in GET /api/companies:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}
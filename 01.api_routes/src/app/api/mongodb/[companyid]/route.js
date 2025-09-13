import { MongoClient } from "mongodb";

const uri =  "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/";
const client = new MongoClient(uri);

const dbName = "assignment";      // database name
const collName = "companies";     // collection name

async function getCollection() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db(dbName).collection(collName);
}

// GET: fetch company details by name
export async function GET(request, { params }) {
  try {
    const { companyName } = params;
    const coll = await getCollection();

    const doc = await coll.findOne({ name: companyName });

    if (!doc) {
      return new Response(JSON.stringify({ message: "Company not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert ObjectId
    doc._id = doc._id.toString();

    return new Response(JSON.stringify(doc), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in GET /api/mongodb/[companyName]:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

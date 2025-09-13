import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/" ; 
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    // Parse query params (?limit & ?page)
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 0; // 0 = no limit
    const page = parseInt(searchParams.get("page")) || 1;
    const skip = limit > 0 ? (page - 1) * limit : 0;

    await client.connect();
    const db = client.db("assignment"); // database name
    const coll = db.collection("companies"); // collection name

    // Query with pagination
    const cursor = coll.find({}).skip(skip);
    if (limit > 0) cursor.limit(limit);

    const docs = await cursor.toArray();

    // Convert ObjectId -> string
    const cleanDocs = docs.map((d) => ({ ...d, _id: d._id.toString() }));

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
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.location) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, location" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await client.connect();
    const db = client.db("assignment"); // your DB name
    const coll = db.collection("companies"); // your collection

    const result = await coll.insertOne(body);

    return new Response(
      JSON.stringify({
        message: "Company inserted successfully",
        id: result.insertedId.toString(),
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in POST /api/companies:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}
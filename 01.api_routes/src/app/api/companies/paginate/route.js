import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/assignment?retryWrites=true&w=majority"; // ✅ use env var
const client = new MongoClient(uri);

// ✅ GET /api/companies/paginate?page=1&limit=10
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract page & limit
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    await client.connect();
    const db = client.db("assignment");
    const coll = db.collection("companies");

    // Fetch paginated results
    const companies = await coll.find().skip(skip).limit(limit).toArray();
    const total = await coll.countDocuments();

    return new Response(
      JSON.stringify({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: companies,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in GET /api/companies/paginate:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

// ✅ POST /api/companies/bulk
export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return new Response(
        JSON.stringify({ error: "Request body must be a non-empty array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await client.connect();
    const db = client.db("assignment");
    const coll = db.collection("companies");

    const result = await coll.insertMany(body);

    return new Response(
      JSON.stringify({
        message: "Companies inserted successfully",
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in POST /api/companies/bulk:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

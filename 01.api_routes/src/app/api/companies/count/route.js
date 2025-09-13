import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/";
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    await client.connect();
    const db = client.db("assignment");
    const coll = db.collection("companies");

    const totalCount = await coll.countDocuments();

    let response = { totalCompanies: totalCount };

    if (location) {
      const locationCount = await coll.countDocuments({ location });
      response.location = location;
      response.locationCount = locationCount;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in GET /api/companies/count:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

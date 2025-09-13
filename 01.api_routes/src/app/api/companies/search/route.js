 import { MongoClient } from "mongodb";

const uri = "mongodb+srv://ishitatrivedi2401:ishitatrivedi061106@cluster0.j2rs8.mongodb.net/";
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const city = searchParams.get("city");
    const minBase = searchParams.get("minBase");
    const skill = searchParams.get("skill");

    // Build MongoDB query dynamically
    const query = {};

    if (city) {
      // try both "location" and "city" fields
      query.$or = [{ location: city }, { city: city }];
    }

    if (minBase) {
      // try both "baseSalary" and "base" fields
      query.$or = query.$or || [];
      query.$or.push({ baseSalary: { $gte: Number(minBase) } });
      query.$or.push({ base: { $gte: Number(minBase) } });
    }

    if (skill) {
      query.skills = { $in: [skill] };
    }

    console.log("🔍 Final MongoDB Query:", JSON.stringify(query, null, 2));

    await client.connect();
    const db = client.db("assignment"); // your DB
    const coll = db.collection("companies"); // your collection

    const results = await coll.find(query).toArray();

    const cleanResults = results.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return new Response(JSON.stringify(cleanResults), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in GET /api/companies/search:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

import clientPromise from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");
    const skill = url.searchParams.get("skill");

    if (!q && !skill) {
      return new Response(
        JSON.stringify({ error: "Please provide ?q= or ?skill=" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("assignment");
    const companies = db.collection("companies");

    let filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    if (skill) {
      filter["hiringCriteria.skills"] = { $regex: skill, $options: "i" };
    }

    const results = await companies.find(filter).toArray();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in text-search route:", error);

    // Return the actual error message to debug
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

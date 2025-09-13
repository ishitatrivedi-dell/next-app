import clientPromise from "@/app/lib/mongodb";

export async function POST(req) {
  try {
    // Parse JSON body
    const companies = await req.json();

    if (!Array.isArray(companies) || companies.length === 0) {
      return new Response(
        JSON.stringify({ error: "Request body must be a non-empty array" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("assignment");
    const companiesCollection = db.collection("companies");

    const result = await companiesCollection.insertMany(companies);

    return new Response(
      JSON.stringify({
        message: "Companies inserted successfully",
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error inserting companies:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// PATCH /api/companies/[id]/add-benefit
export async function PATCH(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing company id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { benefit } = body;

    if (!benefit || typeof benefit !== "string") {
      return new Response(JSON.stringify({ error: "Benefit must be a non-empty string" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("assignment");
    const coll = db.collection("companies");

    // $addToSet → avoids duplicates, $push → always inserts
    const result = await coll.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { benefits: benefit } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Benefit added successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in PATCH /api/companies/[id]/add-benefit:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

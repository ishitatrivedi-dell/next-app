import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

// PATCH /api/companies/[id]/push-round
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
    const { round, type } = body;

    if (!round || !type) {
      return new Response(
        JSON.stringify({ error: "Both round and type are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("assignment");
    const coll = db.collection("companies");

    const result = await coll.updateOne(
      { _id: new ObjectId(id) },
      { $push: { interviewRounds: { round, type } } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Interview round added successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in PATCH /api/companies/[id]/push-round:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

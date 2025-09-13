import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing company id" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // ✅ Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid company id" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const client = await clientPromise;
    const db = client.db("assignment");
    const coll = db.collection("companies");

    const company = await coll.findOne({ _id: new ObjectId(id) });

    if (!company) {
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(company), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Error in GET /api/companies/[id]:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

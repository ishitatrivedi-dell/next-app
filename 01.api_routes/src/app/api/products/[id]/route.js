let items = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mobile", price: 20000 },
  { id: 3, name: "Headphones", price: 3000 },
  {id: 4, name: "Tablet", price: 15000 },
  {id: 5, name: "Smartwatch", price: 8000 }
];

export async function GET(request,{params}) {
  const id = parseInt(params.id);
    const item = items.find((i) => i.id === id);

    if(!item){
        return new Response(JSON.stringify({ error: "Item not found" }), 
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(item), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

}
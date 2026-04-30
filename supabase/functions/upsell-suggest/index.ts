// Cart upsell suggestions — "frequently bought together"
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { addedItem, products } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const catalog = (products ?? [])
      .filter((p: any) => p.id !== addedItem.id)
      .map((p: any) => `#${p.id} | ${p.name} | ₹${p.price} | ${p.category}`)
      .join("\n");

    const system = `Recommend 3 complementary products that pair naturally with "${addedItem.name}" (₹${addedItem.price}, ${addedItem.category}).
Think "frequently bought together" — items that enhance the gift, complete the experience, or add value.
Use ONLY products from the catalog. Return JSON via the suggest tool.

CATALOG:
${catalog}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [{ role: "system", content: system }, { role: "user", content: `What pairs well with ${addedItem.name}?` }],
        tools: [{
          type: "function",
          function: {
            name: "suggest",
            description: "Return upsell suggestions",
            parameters: {
              type: "object",
              properties: {
                tagline: { type: "string", description: "e.g. 'People usually buy this with...'" },
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: { productId: { type: "number" }, reason: { type: "string", description: "Short reason this pairs well" } },
                    required: ["productId", "reason"],
                  },
                },
              },
              required: ["tagline", "suggestions"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "suggest" } },
      }),
    });

    if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!resp.ok) throw new Error(`AI error: ${resp.status}`);

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return new Response(args || '{"suggestions":[]}', { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("upsell error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

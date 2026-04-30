// Hybrid Copilot — refines a product grid via natural language (text or voice transcript)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, products, currentFilters } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const catalog = (products ?? [])
      .map((p: any) => `#${p.id} | ${p.name} | ₹${p.price} | ${p.category} | ${p.occasion} | for ${p.recipientType} | ★${p.rating}`)
      .join("\n");

    const system = `You are a hybrid voice+text shopping copilot. The user is browsing a product grid; refine it incrementally with natural conversation.

CURRENT FILTERS: ${JSON.stringify(currentFilters || {})}

Handle corrections like "show cheaper ones", "no, in black", "only for her" by UPDATING filters — never restart from scratch. Pick up to 12 product IDs that match the refined intent.

CATALOG:
${catalog}

Respond ONLY via the refine tool.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...messages],
        tools: [{
          type: "function",
          function: {
            name: "refine",
            description: "Update the product grid",
            parameters: {
              type: "object",
              properties: {
                reply: { type: "string", description: "Short conversational reply (1-2 sentences)" },
                productIds: { type: "array", items: { type: "number" }, description: "Up to 12 matching product IDs" },
                filters: {
                  type: "object",
                  properties: {
                    maxPrice: { type: "number" },
                    minPrice: { type: "number" },
                    category: { type: "string" },
                    recipient: { type: "string" },
                    keywords: { type: "array", items: { type: "string" } },
                  },
                },
              },
              required: ["reply", "productIds", "filters"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "refine" } },
      }),
    });

    if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!resp.ok) throw new Error(`AI error: ${resp.status}`);

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return new Response(args || '{"reply":"","productIds":[],"filters":{}}', { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("copilot-refine error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

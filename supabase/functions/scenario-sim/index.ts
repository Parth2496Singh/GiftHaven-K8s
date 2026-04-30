// Scenario-based product fit analysis
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { scenario, product, alternatives } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const altList = (alternatives ?? [])
      .filter((p: any) => p.id !== product.id)
      .map((p: any) => `#${p.id} | ${p.name} | ₹${p.price} | ${p.category}`)
      .join("\n");

    const system = `You evaluate whether a product fits a real-world scenario. Be honest, not salesy.

PRODUCT: ${product.name} — ₹${product.price} — ${product.category} — ${product.description}
USER SCENARIO: "${scenario}"

If the product is a poor fit, say so and suggest 1-2 better alternatives from the list. Return JSON via the evaluate tool.

ALTERNATIVES:
${altList}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, { role: "user", content: scenario }],
        tools: [{
          type: "function",
          function: {
            name: "evaluate",
            description: "Evaluate product-scenario fit",
            parameters: {
              type: "object",
              properties: {
                fit: { type: "string", enum: ["excellent", "good", "okay", "poor"] },
                verdict: { type: "string", description: "1-2 sentence honest answer" },
                pros: { type: "array", items: { type: "string" } },
                cons: { type: "array", items: { type: "string" } },
                alternatives: { type: "array", items: { type: "object", properties: { productId: { type: "number" }, reason: { type: "string" } }, required: ["productId", "reason"] } },
              },
              required: ["fit", "verdict", "pros", "cons", "alternatives"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "evaluate" } },
      }),
    });

    if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!resp.ok) throw new Error(`AI error: ${resp.status}`);

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    return new Response(args || "{}", { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("scenario-sim error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

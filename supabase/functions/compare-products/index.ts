// Human-centric product comparison
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, productA, productB } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const system = `You are a product advisor. Compare two products in HUMAN, lifestyle terms — never raw specs.

USER QUESTION: "${question || "Which is better overall?"}"

PRODUCT A: ${productA.name} — ₹${productA.price} — ${productA.category} — ${productA.description}
PRODUCT B: ${productB.name} — ₹${productB.price} — ${productB.category} — ${productB.description}

Respond with JSON via the compare tool. Each insight is 1 short sentence about real-world usability/lifestyle fit (NOT specs).`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, { role: "user", content: question || "Compare these." }],
        tools: [{
          type: "function",
          function: {
            name: "compare",
            description: "Return a human-centric comparison",
            parameters: {
              type: "object",
              properties: {
                productA: { type: "object", properties: { bestFor: { type: "array", items: { type: "string" } }, drawbacks: { type: "array", items: { type: "string" } } }, required: ["bestFor", "drawbacks"] },
                productB: { type: "object", properties: { bestFor: { type: "array", items: { type: "string" } }, drawbacks: { type: "array", items: { type: "string" } } }, required: ["bestFor", "drawbacks"] },
                verdict: { type: "string", description: "1-sentence recommendation answering the user's question" },
                winner: { type: "string", enum: ["A", "B", "tie"] },
              },
              required: ["productA", "productB", "verdict", "winner"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "compare" } },
      }),
    });

    if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!resp.ok) throw new Error(`AI error: ${resp.status}`);

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const result = args ? JSON.parse(args) : null;
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("compare error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

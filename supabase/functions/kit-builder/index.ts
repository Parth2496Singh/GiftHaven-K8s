// Goal-based "Build My Kit" — streams categorized product groups
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { goal, products } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const catalog = (products ?? [])
      .map((p: any) => `#${p.id} | ${p.name} | ₹${p.price} | ${p.category} | ${p.occasion} | for ${p.recipientType}`)
      .join("\n");

    const system = `You are KitBuilder — an AI shopping assistant that builds curated product kits from natural-language goals.

USER GOAL: "${goal}"

YOUR JOB:
1. Infer 3-5 logical CATEGORIES that suit the goal (e.g. "Beachwear", "Party Accessories", "Hangover Essentials" for a Goa bachelor party).
2. For each category, pick 2-4 BEST products from the CATALOG below.
3. Output ONLY the structure below — no preamble, no closing remarks.

OUTPUT FORMAT (strict, one category at a time):
## Category Name
[KIT id=PRODUCT_ID] short reason why it fits

Example:
## Beachwear
[KIT id=18] silk scarf for sunset photos
[KIT id=27] grooming kit for the beach trip

## Party Accessories
[KIT id=29] champagne for celebration

CATALOG:
${catalog}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: system }, { role: "user", content: goal }],
      }),
    });

    if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!resp.ok || !resp.body) throw new Error(`AI error: ${resp.status}`);

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("kit-builder error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

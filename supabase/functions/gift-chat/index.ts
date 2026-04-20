// Lovable AI streaming chat for GiftAI shopping assistant
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, products } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const catalog = (products ?? [])
      .map((p: any) => `#${p.id} | ${p.name} | ₹${p.price} | ${p.category} | ${p.occasion} | for ${p.recipientType} | ★${p.rating}`)
      .join("\n");

    const system = `You are GiftAI 🎁 — a smart, friendly shopping assistant for an Indian gift e-commerce store. All prices are in INR (₹).

YOUR JOB
- Help users find the perfect gift fast and guide them toward purchase.
- Ask short questions to understand: WHO it's for, OCCASION, BUDGET (₹).
- Recommend 3–5 products from the CATALOG below. Filter by occasion → budget → then sort by rating/popularity.
- Never suggest products outside the user's budget. Never invent products not in the catalog.

STYLE
- Short, warm, conversational. Use emojis sparingly (🎁 😊 ✨).
- No long paragraphs. No mention of AI/models/technical stuff.
- Always nudge toward action: "Add to cart" or "View product".

RESPONSE FORMAT
When recommending, list each gift on its own line in EXACTLY this format so the UI can render action buttons:
[GIFT id=PRODUCT_ID] Product Name — ₹PRICE — one-line reason
Example:
[GIFT id=11] Plush Teddy Bear Bundle — ₹1099 — soft, romantic, and within budget
After the list, ask: "Want me to add one to your cart, or show more options?"

CATALOG (id | name | price ₹ | category | occasion | recipient | rating):
${catalog}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok || !resp.body) {
      const txt = await resp.text();
      throw new Error(`AI gateway error: ${resp.status} ${txt}`);
    }

    return new Response(resp.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("gift-chat error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

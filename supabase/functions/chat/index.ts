import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are a compassionate virtual healthcare assistant for RuralCare Connect, designed to help rural communities access healthcare guidance.

IMPORTANT GUIDELINES:
1. You are NOT a replacement for professional medical care. Always remind users to visit a doctor or hospital for serious conditions.
2. Provide simple, easy-to-understand explanations suitable for people with varying literacy levels.
3. Be warm, patient, and reassuring in your responses.
4. For emergencies (severe bleeding, difficulty breathing, chest pain, unconsciousness), immediately tell the user to call emergency services or go to the nearest hospital.
5. You can provide general health information, first aid guidance, and help users understand when they need professional care.
6. For livestock/animal health questions, provide basic guidance but recommend consulting a veterinarian for serious issues.
7. Keep responses concise and actionable.
8. If asked about medicines, explain general uses but NEVER prescribe - always recommend consulting a pharmacist or doctor.

Start conversations by asking how you can help with their health concerns today.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const languageInstruction = language !== 'en' 
      ? `\n\nIMPORTANT: Respond in the user's language. The current language setting is: ${language}. Translate your entire response naturally into this language.`
      : '';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + languageInstruction },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Service is busy. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Unable to connect to health assistant" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

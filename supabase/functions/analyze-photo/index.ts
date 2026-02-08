import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are a healthcare visual analysis assistant for RuralCare Connect.

IMPORTANT DISCLAIMERS:
1. You are NOT a doctor and cannot diagnose conditions.
2. You provide general observations and guidance only.
3. Always recommend professional medical consultation for any concerning findings.

When analyzing an image:
1. Describe what you observe in simple, non-technical terms.
2. If it appears to be a health-related image (skin condition, wound, rash, etc.), provide:
   - Simple description of what you see
   - General first aid tips if applicable
   - Whether it looks like something that needs immediate medical attention
   - Whether it can wait for a scheduled doctor visit
3. For medicine labels/packaging, explain:
   - What the medicine is typically used for
   - General usage instructions visible on the label
   - Remind user to follow their doctor's prescription

EMERGENCY INDICATORS - Tell user to seek immediate help if you see:
- Severe bleeding
- Burns covering large areas
- Signs of serious infection (spreading redness, pus)
- Breathing difficulties
- Severe swelling

Keep responses concise, clear, and suitable for users with varying literacy levels.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64, imageUrl, type = 'human', language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!imageBase64 && !imageUrl) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contextNote = type === 'livestock' 
      ? '\n\nNote: This is a livestock/animal health image. Provide veterinary-appropriate guidance.'
      : '\n\nNote: This is a human health concern.';

    const languageInstruction = language !== 'en'
      ? `\n\nRespond in ${language} language.`
      : '';

    const imageContent = imageUrl 
      ? { type: "image_url", image_url: { url: imageUrl } }
      : { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextNote + languageInstruction },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Please analyze this image and provide health guidance." },
              imageContent
            ]
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vision API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Unable to analyze image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'Unable to analyze this image.';

    // Determine urgency level based on content
    const isEmergency = /emergency|immediate|urgent|severe|call.*ambulance|go.*hospital/i.test(analysis);
    const needsDoctor = /doctor|medical|professional|clinic|hospital|consult/i.test(analysis);

    return new Response(JSON.stringify({ 
      analysis,
      urgency: isEmergency ? 'emergency' : needsDoctor ? 'medical' : 'low',
      disclaimer: 'This is not a medical diagnosis. Please consult a healthcare professional for proper evaluation.'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Photo analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

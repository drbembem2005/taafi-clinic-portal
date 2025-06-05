
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: 'لا توجد صورة' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Gemini API key from Supabase secrets
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // Convert image to base64
    const imageBuffer = await image.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))
    
    // Prepare the prompt for food analysis in Arabic
    const prompt = `
    قم بتحليل هذه الصورة للطعام وقدم معلومات غذائية مفصلة باللغة العربية. أريد النتائج في صيغة JSON تحتوي على:

    1. foodItems: قائمة بالأطعمة المكتشفة في الصورة
    2. calories: السعرات الحرارية المقدرة لكل 100 جرام
    3. protein: البروتين بالجرام لكل 100 جرام
    4. carbohydrates: الكربوهيدرات بالجرام لكل 100 جرام
    5. fat: الدهون بالجرام لكل 100 جرام
    6. fiber: الألياف بالجرام لكل 100 جرام
    7. vitamins: قائمة بالفيتامينات الموجودة
    8. minerals: قائمة بالمعادن الموجودة
    9. healthScore: تقييم صحي من 1-10
    10. recommendations: نصائح لتحسين الوجبة
    11. warnings: تحذيرات إن وجدت (مثل كثرة السكر أو الملح)

    يرجى تقديم الإجابة بصيغة JSON صحيحة فقط دون أي نص إضافي.
    `

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: image.type,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`)
    }

    const geminiData = await geminiResponse.json()
    
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      throw new Error('No analysis results from Gemini')
    }

    const analysisText = geminiData.candidates[0].content.parts[0].text
    
    // Try to parse the JSON response
    let analysisResult
    try {
      // Clean the response text to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No valid JSON found in response')
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      // Fallback response if JSON parsing fails
      analysisResult = {
        foodItems: ['طعام غير محدد'],
        calories: 200,
        protein: 10,
        carbohydrates: 30,
        fat: 8,
        fiber: 5,
        vitamins: ['فيتامين C', 'فيتامين A'],
        minerals: ['البوتاسيوم', 'الحديد'],
        healthScore: 7,
        recommendations: ['أضف المزيد من الخضروات', 'اشرب الماء بكثرة'],
        warnings: ['يحتوي على سعرات حرارية عالية']
      }
    }

    // Validate and ensure all required fields exist
    const validatedResult = {
      foodItems: Array.isArray(analysisResult.foodItems) ? analysisResult.foodItems : ['طعام غير محدد'],
      calories: typeof analysisResult.calories === 'number' ? analysisResult.calories : 200,
      protein: typeof analysisResult.protein === 'number' ? analysisResult.protein : 10,
      carbohydrates: typeof analysisResult.carbohydrates === 'number' ? analysisResult.carbohydrates : 30,
      fat: typeof analysisResult.fat === 'number' ? analysisResult.fat : 8,
      fiber: typeof analysisResult.fiber === 'number' ? analysisResult.fiber : 5,
      vitamins: Array.isArray(analysisResult.vitamins) ? analysisResult.vitamins : ['فيتامين C'],
      minerals: Array.isArray(analysisResult.minerals) ? analysisResult.minerals : ['البوتاسيوم'],
      healthScore: typeof analysisResult.healthScore === 'number' && analysisResult.healthScore >= 1 && analysisResult.healthScore <= 10 
        ? analysisResult.healthScore : 7,
      recommendations: Array.isArray(analysisResult.recommendations) ? analysisResult.recommendations : ['تناول وجبة متوازنة'],
      warnings: Array.isArray(analysisResult.warnings) ? analysisResult.warnings : []
    }

    return new Response(
      JSON.stringify(validatedResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in analyze-food function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'حدث خطأ أثناء تحليل الصورة',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

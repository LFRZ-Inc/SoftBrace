import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Use the provided API key directly for immediate functionality
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || 're_3F6TrTJr_M9sjtY6tS2Bt3hG49HoPtESw'

serve(async (req) => {
  const { method } = req

  // Handle CORS for preflight requests
  if (method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { record } = await req.json()
    
    console.log('Received support message:', record)
    console.log('Using API key:', RESEND_API_KEY ? 'API key available' : 'API key missing')
    
    // Send email notification to admin
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SoftBrace Website <onboarding@resend.dev>',
        to: ['support@softbracestrips.com'],
        subject: `New Support Message: ${record.subject || record.inquiry_type}`,
        html: `
          <h2>🔔 New Support Message from SoftBraceStrips.com</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif;">
            <p><strong>👤 From:</strong> ${record.name}</p>
            <p><strong>📧 Email:</strong> ${record.email}</p>
            <p><strong>📋 Type:</strong> ${record.inquiry_type}</p>
            <p><strong>📝 Subject:</strong> ${record.subject}</p>
            <hr style="margin: 20px 0;">
            <p><strong>💬 Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #007bff;">
              ${record.message.replace(/\n/g, '<br>')}
            </div>
            <hr style="margin: 20px 0;">
            <p><strong>⏰ Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin-top: 20px;">
              <em>💡 Reply directly to ${record.email} to respond to this inquiry.</em>
            </p>
          </div>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Email API error:', emailResponse.status, errorText)
      throw new Error(`Email API error: ${emailResponse.statusText} - ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('✅ Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification sent successfully!', 
        emailId: emailResult.id 
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('❌ Error sending notification:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send email notification. Message saved to database.'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}) 
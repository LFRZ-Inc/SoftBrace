import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

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
    
    // Send email notification to admin
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SoftBrace Website <noreply@softbracestrips.com>',
        to: ['support@softbracestrips.com'],
        subject: `New Support Message: ${record.subject || record.inquiry_type}`,
        html: `
          <h2>New Support Message from SoftBraceStrips.com</h2>
          <p><strong>From:</strong> ${record.name} (${record.email})</p>
          <p><strong>Type:</strong> ${record.inquiry_type}</p>
          <p><strong>Subject:</strong> ${record.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${record.message.replace(/\n/g, '<br>')}
          </div>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p><em>Please respond directly to ${record.email}</em></p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      throw new Error(`Email API error: ${emailResponse.statusText}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
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
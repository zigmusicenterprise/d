import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-key')

export async function POST(request: Request) {
  try {
    const { email, code, username } = await request.json()

    console.log('📧 Send verification called with:', { email, code, username })

    if (!email || !code || !username) {
      console.error('❌ Missing required fields:', { email, code, username })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('📧 Sending email via Resend to:', email)
    console.log('📧 Resend API key configured:', !!process.env.RESEND_API_KEY)
    console.log('📧 Resend API key value:', process.env.RESEND_API_KEY?.substring(0, 10) + '...')

    // Verificar se a chave do Resend é válida
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder-key') {
      console.error('❌ Invalid Resend API key')
      return NextResponse.json(
        { error: 'Email service not configured', isTestMode: true },
        { status: 500 }
      )
    }

    // Enviar email
    const data = await resend.emails.send({
      from: 'ZIG Music <noreply@zigmusic.com>',
      to: email,
      subject: 'Verify your ZIG Music account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #FF4532 0%, #FF6B5B 100%);
                padding: 40px 20px;
                text-align: center;
              }
              .header h1 {
                color: #ffffff;
                margin: 0;
                font-size: 28px;
              }
              .content {
                padding: 40px 30px;
                text-align: center;
              }
              .content h2 {
                color: #333333;
                margin-bottom: 20px;
              }
              .content p {
                color: #666666;
                line-height: 1.6;
                margin-bottom: 30px;
              }
              .code-box {
                background-color: #f8f9fa;
                border: 2px dashed #FF4532;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
              }
              .code {
                font-size: 36px;
                font-weight: bold;
                color: #FF4532;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #999999;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎵 ZIG Music</h1>
              </div>
              <div class="content">
                <h2>Welcome, ${username}!</h2>
                <p>Thank you for signing up for ZIG Music. To complete your registration, please verify your email address using the code below:</p>
                
                <div class="code-box">
                  <div class="code">${code}</div>
                </div>
                
                <p>This code will expire in 10 minutes.</p>
                <p style="color: #999; font-size: 14px;">If you didn't create an account with ZIG Music, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                <p>© 2024 ZIG Music. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    console.log('✅ Resend API response:', data)

    // Verificar se houve erro do Resend (modo teste)
    if (data.error) {
      console.warn('⚠️ Resend error (test mode):', data.error.message)
      return NextResponse.json({ 
        success: false, 
        error: data.error.message,
        isTestMode: true 
      })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('❌ Send verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-key')

// Gerar código de 6 dígitos
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Validação
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email_verified, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      if (existingUser.email_verified) {
        // Se já tem conta verificada, não permite criar outra
        if (existingUser.username === username) {
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: 'Email already registered. Please login.' },
          { status: 400 }
        )
      }
      // Se existe mas não verificou, permite reenviar código
      console.log('⚠️ User exists but not verified, allowing re-registration')
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password)

    // Criar ou atualizar usuário (não verificado ainda)
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .upsert({
        username,
        email,
        password: hashedPassword,
        email_verified: false,
        two_factor_enabled: false,
        wallet_configured: false
      }, {
        onConflict: 'email'
      })
      .select()
      .single()

    if (userError) {
      console.error('Supabase error:', userError)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Gerar código de verificação
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

    // Salvar código no banco
    const { error: codeError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        code,
        type: 'registration',
        expires_at: expiresAt.toISOString()
      })

    if (codeError) {
      console.error('Failed to save verification code:', codeError)
      return NextResponse.json(
        { error: 'Failed to generate verification code' },
        { status: 500 }
      )
    }

    // Enviar email com código
    console.log('📧 Attempting to send verification email to:', email)
    console.log('📧 Verification code:', code)
    
    let emailSent = false
    
    try {
      // Enviar email diretamente usando Resend
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'placeholder-key') {
        const emailResult = await resend.emails.send({
          from: 'ZIG Music <noreply@zigmusic.com>',
          to: email,
          subject: 'Verify your ZIG Music account',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                  .header { background: linear-gradient(135deg, #FF4532 0%, #FF6B5B 100%); padding: 40px 20px; text-align: center; }
                  .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
                  .content { padding: 40px 30px; text-align: center; }
                  .content h2 { color: #333333; margin-bottom: 20px; }
                  .content p { color: #666666; line-height: 1.6; margin-bottom: 30px; }
                  .code-box { background-color: #f8f9fa; border: 2px dashed #FF4532; border-radius: 8px; padding: 20px; margin: 30px 0; }
                  .code { font-size: 36px; font-weight: bold; color: #FF4532; letter-spacing: 8px; font-family: 'Courier New', monospace; }
                  .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #999999; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header"><h1>🎵 ZIG Music</h1></div>
                  <div class="content">
                    <h2>Welcome, ${username}!</h2>
                    <p>Thank you for signing up for ZIG Music. To complete your registration, please verify your email address using the code below:</p>
                    <div class="code-box"><div class="code">${code}</div></div>
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
        
        if (emailResult.error) {
          console.error('❌ Resend error:', emailResult.error)
          emailSent = false
        } else {
          console.log('✅ Email sent successfully:', emailResult.data)
          emailSent = true
        }
      } else {
        console.warn('⚠️ Resend API key not configured')
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError)
      emailSent = false
    }

    // Retornar código em dev mode ou se email falhou
    const shouldShowCode = process.env.NODE_ENV === 'development' || !emailSent

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'Verification code sent to your email' 
        : 'Email service unavailable. Use the code shown below.',
      email,
      requiresVerification: true,
      devCode: shouldShowCode ? code : undefined,
      emailSent
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

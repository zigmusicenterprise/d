import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Buscar código de verificação
    const { data: verificationCode, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('type', 'registration')
      .eq('used', false)
      .single()

    if (codeError || !verificationCode) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Verificar se o código expirou
    if (new Date(verificationCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Marcar código como usado
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationCode.id)

    // Atualizar usuário como verificado
    const { data: user, error: userError } = await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('email', email)
      .select()
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Failed to verify user' },
        { status: 500 }
      )
    }

    // Gerar token
    const token = generateToken(user.id)

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: true
      }
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

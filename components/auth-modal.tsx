"use client"

import { useState, useEffect } from "react"
import { X, Mail, CheckCircle2 } from "lucide-react"
import emailjs from '@emailjs/browser'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showResetVerification, setShowResetVerification] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Gerar código de 6 dígitos
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Enviar email de verificação
  const sendVerificationEmail = async (userEmail: string, code: string, userName: string) => {
    setIsSendingEmail(true)
    try {
      // Configurar EmailJS (você precisa criar uma conta em emailjs.com)
      // Service ID, Template ID e Public Key devem ser configurados no .env
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_0vouyp9',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_74rxz0x',
        {
          to_email: userEmail,
          to_name: userName,
          verification_code: code,
          app_name: 'ZIG Music',
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'lsXzNq03yXuqsNLML'
      )
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!isLogin && !username) {
      setError("Please enter a username")
      return
    }
    
    if (isLogin) {
      // Handle login - Usar API do Supabase
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Login failed')
          return
        }

        // Salvar token e dados do usuário
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Login bem-sucedido
        window.location.href = "/dashboard"
      } catch (err) {
        setError("Login failed. Please try again.")
      }
    } else {
      // Handle register - Enviar código de verificação
      if (password.length < 8) {
        setError("Password must be at least 8 characters")
        return
      }
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Registration failed')
          return
        }

        // Log do código para desenvolvimento
        if (data.devCode) {
          console.log('🔑 Verification code:', data.devCode)
        }

        // Mostrar tela de verificação
        setShowVerification(true)
        
        // Mostrar mensagem apropriada
        if (data.devCode) {
          setSuccessMessage(`Your verification code: ${data.devCode}`)
        } else if (data.emailSent) {
          setSuccessMessage("Verification code sent! Check your email.")
        } else {
          setSuccessMessage("Check the code above and enter it below.")
        }
      } catch (err) {
        setError("Registration failed. Please try again.")
      }
    }
  }

  const handleVerifyCode = async () => {
    setIsVerifying(true)
    setError("")
    
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid verification code')
        setIsVerifying(false)
        return
      }

      // Salvar token e dados do usuário
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirecionar para dashboard
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } catch (err) {
      setError("Verification failed. Please try again.")
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setVerificationCode("")
    setError("")
    setSuccessMessage("")
    setIsSendingEmail(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })

      const data = await response.json()
      setIsSendingEmail(false)

      if (!response.ok) {
        setError(data.error || 'Failed to resend code')
        return
      }

      setSuccessMessage("New code sent! Check your email.")
    } catch (err) {
      setError("Failed to resend code. Please try again.")
      setIsSendingEmail(false)
    }
  }

  const handleForgotPassword = async () => {
    setError("")
    setSuccessMessage("")

    if (!resetEmail || !resetEmail.includes("@")) {
      setError("Please enter a valid email")
      return
    }

    // Verificar se o usuário existe
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      setError("No account found with this email")
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.email !== resetEmail) {
      setError("No account found with this email")
      return
    }

    // Gerar código de recuperação
    const code = generateVerificationCode()
    setGeneratedCode(code)
    setIsSendingEmail(true)

    // Enviar email
    const emailSent = await sendVerificationEmail(resetEmail, code, userData.username)
    setIsSendingEmail(false)

    if (emailSent) {
      setShowResetVerification(true)
      setSuccessMessage("Reset code sent! Check your email.")
    } else {
      setError("Failed to send reset code. Please try again.")
    }
  }

  const handleResetPassword = () => {
    setError("")

    if (resetCode !== generatedCode) {
      setError("Invalid verification code")
      return
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    // Atualizar senha
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      userData.password = newPassword
      localStorage.setItem("user", JSON.stringify(userData))
      
      setSuccessMessage("Password reset successfully!")
      setTimeout(() => {
        setShowForgotPassword(false)
        setShowResetVerification(false)
        setResetEmail("")
        setResetCode("")
        setNewPassword("")
        setIsLogin(true)
      }, 2000)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setEmail("")
    setPassword("")
    setUsername("")
    setShowVerification(false)
    setShowForgotPassword(false)
    setVerificationCode("")
    setGeneratedCode("")
    setResetEmail("")
    setResetCode("")
    setNewPassword("")
    setShowResetVerification(false)
  }

  return (
    <div 
      className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isOpen 
          ? "opacity-100 pointer-events-auto backdrop-blur-[10px] bg-black/40" 
          : "opacity-0 pointer-events-none backdrop-blur-0 bg-black/0"
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isOpen ? "scale-100" : "scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Container */}
        <div className="relative w-[1200px] h-[872px] bg-[rgba(230,243,255,0.9)] rounded-[33px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] scale-[0.85] origin-center max-h-[90vh] max-w-[95vw]">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 bg-[#f0f0f0] rounded-full flex items-center justify-center z-[100] transition-all duration-300 hover:rotate-90 hover:bg-[#FF4532] hover:text-white text-black"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side - Image */}
          <div className="absolute -left-[261px] top-0 w-[920px] h-[920px]">
            <img 
              src="/imagem0.png"
              alt="Login"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Content Frame */}
          <div className="absolute right-0 top-0 w-[720px] h-full bg-[#fcfeff] rounded-l-[21px]">
            
            {/* Forgot Password Screen */}
            {showForgotPassword ? (
              <div className="relative h-full px-[103px] pt-[106px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-[#e5524a]/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-[#e5524a]" />
                </div>
                
                <h2 className="text-black font-semibold text-[22px] font-['Poppins',sans-serif] mb-4 text-center">
                  Reset Your Password
                </h2>
                
                {!showResetVerification ? (
                  <>
                    <p className="text-[#7c838a] text-[15px] font-['Poppins',sans-serif] mb-8 text-center max-w-[400px]">
                      Enter your email address and we'll send you a code to reset your password
                    </p>

                    <div className="mb-6 w-full max-w-[400px]">
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full h-[55px] bg-[rgba(176,186,195,0.4)] rounded-[17px] border-none outline-none px-6 font-['Poppins',sans-serif] text-[17px] text-black placeholder:text-black/30"
                      />
                    </div>

                    {error && (
                      <p className="w-full max-w-[400px] text-center text-[#e5524a] font-medium text-[14px] font-['Poppins',sans-serif] mb-4">
                        {error}
                      </p>
                    )}

                    {successMessage && (
                      <p className="w-full max-w-[400px] text-center text-green-500 font-medium text-[14px] font-['Poppins',sans-serif] mb-4">
                        {successMessage}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={isSendingEmail}
                      className="w-[289px] h-[51px] bg-[#e5524a] hover:bg-[#d44a42] rounded-[9px] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                      <span className="text-black font-medium text-[22px] font-['Poppins',sans-serif]">
                        {isSendingEmail ? "Sending..." : "Send Reset Code"}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[#7c838a] text-[15px] font-['Poppins',sans-serif] mb-8 text-center max-w-[400px]">
                      Enter the code sent to <span className="font-semibold text-black">{resetEmail}</span> and your new password
                    </p>

                    <div className="space-y-4 w-full max-w-[400px] mb-6">
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="6-digit code"
                        maxLength={6}
                        className="w-full h-[55px] bg-[rgba(176,186,195,0.4)] rounded-[17px] border-none outline-none px-6 font-['Poppins',sans-serif] text-[24px] text-black placeholder:text-black/30 text-center tracking-[0.5em] font-bold"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="w-full h-[55px] bg-[rgba(176,186,195,0.4)] rounded-[17px] border-none outline-none px-6 font-['Poppins',sans-serif] text-[17px] text-black placeholder:text-black/30"
                      />
                    </div>

                    {error && (
                      <p className="w-full max-w-[400px] text-center text-[#e5524a] font-medium text-[14px] font-['Poppins',sans-serif] mb-4">
                        {error}
                      </p>
                    )}

                    {successMessage && (
                      <p className="w-full max-w-[400px] text-center text-green-500 font-medium text-[14px] font-['Poppins',sans-serif] mb-4">
                        {successMessage}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={resetCode.length !== 6 || !newPassword}
                      className="w-[289px] h-[51px] bg-[#e5524a] hover:bg-[#d44a42] rounded-[9px] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                    >
                      <span className="text-black font-medium text-[22px] font-['Poppins',sans-serif]">
                        Reset Password
                      </span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setShowResetVerification(false)
                    setResetEmail("")
                    setResetCode("")
                    setNewPassword("")
                    setError("")
                    setSuccessMessage("")
                  }}
                  className="text-[#7c838a] text-[15px] font-['Poppins',sans-serif] hover:underline mt-4"
                >
                  Back to login
                </button>
              </div>
            ) : showVerification ? (
              /* Verification Screen */
              <div className="relative h-full px-[103px] pt-[106px] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-[#e5524a]/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-10 h-10 text-[#e5524a]" />
                </div>
                
                <h2 className="text-black font-semibold text-[22px] font-['Poppins',sans-serif] mb-4 text-center">
                  Verify Your Email
                </h2>
                
                <p className="text-[#7c838a] text-[15px] font-['Poppins',sans-serif] mb-8 text-center max-w-[400px]">
                  We sent a 6-digit verification code to<br />
                  <span className="font-semibold text-black">{email}</span>
                </p>

                <div className="mb-6 w-full max-w-[400px]">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full h-[55px] bg-[rgba(176,186,195,0.4)] rounded-[17px] border-none outline-none px-6 font-['Poppins',sans-serif] text-[24px] text-black placeholder:text-black/30 text-center tracking-[0.5em] font-bold"
                  />
                </div>

                {error && (
                  <p className="w-full max-w-[400px] text-center text-[#e5524a] font-medium text-[14px] font-['Poppins',sans-serif] mb-4">
                    {error}
                  </p>
                )}

                {successMessage && (
                  <p className="w-full max-w-[400px] text-center text-green-500 font-medium text-[14px] font-['Poppins',sans-serif] mb-4">
                    {successMessage}
                  </p>
                )}

                {isVerifying && (
                  <div className="flex items-center gap-2 text-[#7c838a] text-[14px] mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse" />
                    <span>Verifying...</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || isVerifying || isSendingEmail}
                  className="w-[289px] h-[51px] bg-[#e5524a] hover:bg-[#d44a42] rounded-[9px] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  <span className="text-black font-medium text-[22px] font-['Poppins',sans-serif]">
                    {isVerifying ? "Verifying..." : "Verify Email"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSendingEmail}
                  className="text-[#e5524a] text-[15px] font-['Poppins',sans-serif] hover:underline disabled:opacity-50"
                >
                  {isSendingEmail ? "Sending..." : "Resend code"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowVerification(false)
                    setVerificationCode("")
                    setError("")
                  }}
                  className="text-[#7c838a] text-[15px] font-['Poppins',sans-serif] hover:underline mt-4"
                >
                  Back to registration
                </button>
              </div>
            ) : (
              /* Form Content */
              <form onSubmit={handleSubmit} className="relative h-full px-[103px] pt-[106px]">
              
              {/* Title */}
              <h2 className="text-black font-semibold text-[22px] font-['Poppins',sans-serif] mb-12">
                {isLogin ? "Welcome Back" : "Create your Free Account"}
              </h2>

              {/* Username Input (Register only) */}
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-[#7c838a] font-medium text-[17px] font-['Poppins',sans-serif] mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your Username here"
                    required
                    className="w-[511px] h-[55px] bg-[rgba(176,186,195,0.4)] rounded-[17px] border-none outline-none px-6 font-['Poppins',sans-serif] text-[17px] text-black placeholder:text-black/30 focus:ring-2 focus:ring-[#e5524a]"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="mb-6">
                <label className="block text-[#7c838a] font-medium text-[17px] font-['Poppins',sans-serif] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email here"
                  required
                  className="w-[511px] h-[55px] bg-[rgba(176,186,195,0.4)] rounded-[17px] border-none outline-none px-6 font-['Poppins',sans-serif] text-[17px] text-black placeholder:text-black/30 focus:ring-2 focus:ring-[#e5524a]"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-[#7c838a] font-medium text-[17px] font-['Poppins',sans-serif] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password here"
                  required
                  minLength={8}
                  className="w-[511px] h-[55px] bg-[rgba(176,186,195,0.4)] rounded-[17px] border-none outline-none px-6 font-['Poppins',sans-serif] text-[17px] text-black placeholder:text-black/30 focus:ring-2 focus:ring-[#e5524a]"
                />
                {!isLogin && (
                  <p className="mt-2 text-[#7c838a] text-[12px] font-['Poppins',sans-serif]">
                    Min 8 characters, 1 uppercase, 1 special character
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <p className="w-[511px] text-center text-[#e5524a] font-medium text-[14px] font-['Poppins',sans-serif] mb-4">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSendingEmail}
                className="w-[289px] h-[51px] bg-[#e5524a] hover:bg-[#d44a42] rounded-[9px] transition-all duration-300 cursor-pointer mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-black font-medium text-[22px] font-['Poppins',sans-serif]">
                  {isSendingEmail ? "Sending..." : isLogin ? "Log In" : "Create Account"}
                </span>
              </button>

              {/* Switch Mode Link */}
              <p className="w-[289px] text-center text-[15px] font-['Poppins',sans-serif] mt-6">
                <span className="text-[#7c838a]">
                  {isLogin ? "Don't have an account? " : "Already have a account? "}
                </span>
                <span 
                  onClick={switchMode}
                  className="text-[#e5524a] cursor-pointer hover:underline"
                >
                  {isLogin ? "Register" : "Log in"}
                </span>
              </p>

              {/* Forgot Password Link */}
              {isLogin && (
                <p className="w-[289px] text-center text-[15px] font-['Poppins',sans-serif] mt-2">
                  <span 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[#7c838a] cursor-pointer hover:text-[#e5524a] hover:underline"
                  >
                    Forgot password?
                  </span>
                </p>
              )}

              </form>
            )}
          </div>

          {/* Bottom Left Text */}
          <div className="absolute left-[67px] bottom-[150px] w-[170px] text-white text-[13px] leading-[1.4] font-['Inter',sans-serif]">
            <span>Shared rooms<br />collaborative playlists and </span>
            <span className="font-semibold">high-fidelity audio.</span>
          </div>

        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff,
  Check,
  X,
  Wallet,
  Gift,
  AlertCircle,
  Download
} from "lucide-react"
import { SecurityActivity } from "./security-activity"
import { PartnerInviteTab } from "./partner-invite-tab"

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("account")
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Account tab states
  const [newUsername, setNewUsername] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [emailVerificationCode, setEmailVerificationCode] = useState("")
  const [showEmailVerification, setShowEmailVerification] = useState(false)

  // Security tab states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 2FA tab states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [secretKey, setSecretKey] = useState("")
  const [showSecretKey, setShowSecretKey] = useState(false)

  // Wallet tab states
  const [apiKey, setApiKey] = useState("")
  const [secretKeyWallet, setSecretKeyWallet] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [showSecretKeyWallet, setShowSecretKeyWallet] = useState(false)

  // Load user data
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const parsed = JSON.parse(user)
      setUserData(parsed)
      setNewUsername(parsed.username || "")
      setNewEmail(parsed.email || "")
      setTwoFactorEnabled(parsed.twoFactorEnabled || false)
      setSecretKey(parsed.secretKey || "")
      setApiKey(parsed.apiKey || "")
      setSecretKeyWallet(parsed.secretKeyWallet || "")
    }
  }, [])

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const handleUsernameChange = () => {
    if (!newUsername || newUsername.trim().length === 0) {
      setError("Username cannot be empty")
      return
    }
    const updatedData = { ...userData, username: newUsername }
    localStorage.setItem("user", JSON.stringify(updatedData))
    setUserData(updatedData)
    setSuccess("Username updated successfully!")
  }

  const handleEmailChange = () => {
    if (!newEmail || newEmail.trim().length === 0) {
      setError("Email cannot be empty")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Invalid email format")
      return
    }
    setShowEmailVerification(true)
    setSuccess("Verification code sent to your new email!")
  }

  const handleEmailVerification = () => {
    if (emailVerificationCode === "123456") {
      const updatedData = { ...userData, email: newEmail, emailVerified: true }
      localStorage.setItem("user", JSON.stringify(updatedData))
      setUserData(updatedData)
      setShowEmailVerification(false)
      setEmailVerificationCode("")
      setSuccess("Email updated and verified!")
    } else {
      setError("Invalid verification code")
    }
  }

  const handlePasswordChange = () => {
    setError("")
    setSuccess("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required")
      return
    }

    if (currentPassword !== userData?.password) {
      setError("Current password is incorrect")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    const updatedData = { ...userData, password: newPassword }
    localStorage.setItem("user", JSON.stringify(updatedData))
    setUserData(updatedData)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setSuccess("Password changed successfully!")
  }

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      const newSecretKey = `ZIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      setSecretKey(newSecretKey)
      const updatedData = { ...userData, twoFactorEnabled: true, secretKey: newSecretKey }
      localStorage.setItem("user", JSON.stringify(updatedData))
      setUserData(updatedData)
      setTwoFactorEnabled(true)
      setSuccess("Two-factor authentication enabled!")
    } else {
      const updatedData = { ...userData, twoFactorEnabled: false, secretKey: "" }
      localStorage.setItem("user", JSON.stringify(updatedData))
      setUserData(updatedData)
      setTwoFactorEnabled(false)
      setSecretKey("")
      setSuccess("Two-factor authentication disabled!")
    }
  }

  const handleWalletSave = () => {
    setError("")
    setSuccess("")

    if (!apiKey || !secretKeyWallet) {
      setError("Both API Key and Secret Key are required")
      return
    }

    // Validate credentials
    const validApiKeys = [
      "ZIG_API_a1b2c3d4e5f6g7h8",
      "ZIG_API_x9y8z7w6v5u4t3s2",
      "ZIG_API_m1n2o3p4q5r6s7t8",
      "ZIG_API_k9l8m7n6o5p4q3r2"
    ]

    const validSecretKeys = [
      "ZIG_SECRET_1a2b3c4d5e6f7g8h9i0j",
      "ZIG_SECRET_9x8y7z6w5v4u3t2s1r0q",
      "ZIG_SECRET_5m4n3o2p1q0r9s8t7u6v",
      "ZIG_SECRET_3k2l1m0n9o8p7q6r5s4t"
    ]

    if (!validApiKeys.includes(apiKey)) {
      setError("Invalid API Key. Please check your ZIGpay dashboard.")
      return
    }

    if (!validSecretKeys.includes(secretKeyWallet)) {
      setError("Invalid Secret Key. Please check your ZIGpay dashboard.")
      return
    }

    const updatedData = { 
      ...userData, 
      apiKey, 
      secretKey: secretKeyWallet,
      walletConfigured: true,
      walletConfiguredAt: new Date().toISOString()
    }
    localStorage.setItem("user", JSON.stringify(updatedData))
    setUserData(updatedData)
    setSuccess("Wallet configured successfully!")
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
          <X className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: "account", label: "Account", icon: User },
          { id: "security", label: "Security", icon: Lock },
          { id: "2fa", label: "2FA", icon: Shield },
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "downloads", label: "Downloads", icon: Download },
          { id: "partner", label: "Partner Invite", icon: Gift },
        ].map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#FF4532] text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "account" && (
          <div className="space-y-6">
            {/* Username */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FF4532]/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#FF4532]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Change Username</h3>
                  <p className="text-white/50 text-sm">Update your display name</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">New Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50"
                  />
                </div>
                <button
                  onClick={handleUsernameChange}
                  className="w-full px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors"
                >
                  Save Username
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Change Email</h3>
                  <p className="text-white/50 text-sm">Update your email address (requires verification)</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">New Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={showEmailVerification}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50 disabled:opacity-50"
                  />
                </div>
                {showEmailVerification && (
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Verification Code</label>
                    <input
                      type="text"
                      value={emailVerificationCode}
                      onChange={(e) => setEmailVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50"
                    />
                  </div>
                )}
                <button
                  onClick={showEmailVerification ? handleEmailVerification : handleEmailChange}
                  className="w-full px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors"
                >
                  {showEmailVerification ? "Verify Email" : "Send Verification Code"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FF4532]/20 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#FF4532]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Change Password</h3>
                  <p className="text-white/50 text-sm">Update your account password</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50"
                    />
                    <button
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50"
                    />
                    <button
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="w-full px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Security Activity */}
            <SecurityActivity />
          </div>
        )}

        {activeTab === "2fa" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
                  <p className="text-white/50 text-sm">Add an extra layer of security to your account</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-white font-medium">2FA Status</p>
                    <p className="text-white/50 text-sm">
                      {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <button
                    onClick={handleToggle2FA}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      twoFactorEnabled
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {twoFactorEnabled ? "Disable" : "Enable"}
                  </button>
                </div>

                {twoFactorEnabled && secretKey && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Your Secret Key</label>
                      <div className="relative">
                        <input
                          type={showSecretKey ? "text" : "password"}
                          value={secretKey}
                          readOnly
                          className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white font-mono"
                        />
                        <button
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          {showSecretKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-white/40 text-xs mt-2">
                        Save this key in a secure location. You'll need it to set up your authenticator app.
                      </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-400 text-sm font-medium mb-1">Setup Instructions</p>
                          <ol className="text-blue-300/80 text-sm space-y-1 list-decimal list-inside">
                            <li>Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                            <li>Add a new account in the app</li>
                            <li>Enter the secret key shown above</li>
                            <li>Use the generated codes to log in</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">ZIGpay Wallet Configuration</h3>
                  <p className="text-white/50 text-sm">Connect your ZIGpay wallet to receive partner earnings</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="ZIG_API_xxxxxxxxxxxxxxxx"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50 font-mono"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Secret Key</label>
                  <div className="relative">
                    <input
                      type={showSecretKeyWallet ? "text" : "password"}
                      value={secretKeyWallet}
                      onChange={(e) => setSecretKeyWallet(e.target.value)}
                      placeholder="ZIG_SECRET_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50 font-mono"
                    />
                    <button
                      onClick={() => setShowSecretKeyWallet(!showSecretKeyWallet)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      {showSecretKeyWallet ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleWalletSave}
                  className="w-full px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors"
                >
                  Save Wallet Configuration
                </button>
              </div>
            </div>

            {/* Tutorial Section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">How to Get Your Credentials</h3>
                  <p className="text-white/50 text-sm">Follow these steps to configure your wallet</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Install ZIG Wallet</p>
                      <p className="text-white/60 text-sm">
                        Download and install the{" "}
                        <a
                          href="/cdn/ZigWallet.exe"
                          download
                          className="text-[#FF4532] hover:text-[#d44a42] underline transition-colors"
                        >
                          ZIG Wallet application
                        </a>
                        {" "}to manage your account
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium">Log in to ZIG Wallet</p>
                      <p className="text-white/60 text-sm">Open the application and log in with your ZIGpay credentials</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium">Navigate to API Settings</p>
                      <p className="text-white/60 text-sm">Go to Settings → API Keys in your wallet dashboard</p>
                      <img 
                        src="/Settings/Pagina de Inicial.png" 
                        alt="ZIGpay Dashboard" 
                        className="mt-3 rounded-xl border border-white/10 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      4
                    </div>
                    <div>
                      <p className="text-white font-medium">Generate New API Key</p>
                      <p className="text-white/60 text-sm">Click "Generate New Key" and save both keys securely</p>
                      <img 
                        src="/Settings/Pagina de Screet Key.png" 
                        alt="API Key Generation" 
                        className="mt-3 rounded-xl border border-white/10 w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      5
                    </div>
                    <div>
                      <p className="text-white font-medium">Copy Your Credentials</p>
                      <p className="text-white/60 text-sm">Copy the API Key and Secret Key from your wallet dashboard</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      6
                    </div>
                    <div>
                      <p className="text-white font-medium">Paste Here</p>
                      <p className="text-white/60 text-sm">Enter your credentials in the fields above and save</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-orange-400 text-sm font-medium mb-1">Important Security Note</p>
                      <p className="text-orange-300/80 text-sm">
                        Never share your API credentials with anyone. Keep them secure and only enter them on official ZIG Music pages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "downloads" && (
          <div className="space-y-6">
            {/* Desktop App Download */}
            <div className="bg-gradient-to-br from-[#FF4532]/20 to-[#FF867E]/10 border border-[#FF4532]/30 rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[#FF4532] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-2xl mb-2">ZIG Music Desktop App</h3>
                  <p className="text-white/70 text-base mb-6">
                    Download the official ZIG Music desktop application for the best listening experience. 
                    Enjoy high-quality audio, offline mode, and exclusive features.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-white font-medium">High-Quality Audio</span>
                      </div>
                      <p className="text-white/60 text-sm">Lossless streaming up to 320kbps</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-white font-medium">Offline Mode</span>
                      </div>
                      <p className="text-white/60 text-sm">Download and listen anywhere</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-white font-medium">No Ads</span>
                      </div>
                      <p className="text-white/60 text-sm">Uninterrupted music experience</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a
                      href="/cdn/ZigMusic-Setup.exe"
                      download
                      className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-white/90 transition-all hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                    >
                      <Download className="w-5 h-5" />
                      Download for Windows
                    </a>
                  </div>

                  <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-400 text-sm font-medium mb-1">System Requirements</p>
                        <ul className="text-blue-300/80 text-sm space-y-1">
                          <li>• Windows 10 or later (64-bit)</li>
                          <li>• 4GB RAM minimum (8GB recommended)</li>
                          <li>• 500MB free disk space</li>
                          <li>• Internet connection for streaming</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "partner" && (
          <PartnerInviteTab
            userData={userData}
            setUserData={setUserData}
            setError={setError}
            setSuccess={setSuccess}
          />
        )}
      </div>
    </div>
  )
}

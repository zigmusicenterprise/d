"use client"

import { useState } from "react"
import { 
  Gift, 
  Key, 
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Wallet
} from "lucide-react"

interface PartnerInviteTabProps {
  userData: any
  setUserData: (data: any) => void
  setError: (error: string) => void
  setSuccess: (success: string) => void
}

export function PartnerInviteTab({ userData, setUserData, setError, setSuccess }: PartnerInviteTabProps) {
  const [adminCode, setAdminCode] = useState("")
  const [isPartner, setIsPartner] = useState(userData?.isPartner || false)
  const [partnerSince, setPartnerSince] = useState(userData?.partnerSince || "")
  const [myInviteCode, setMyInviteCode] = useState(userData?.myInviteCode || "")
  const [inviteCount, setInviteCount] = useState(userData?.inviteCount || 0)
  const [totalEarnings, setTotalEarnings] = useState(userData?.totalEarnings || 0)

  const generateInviteCode = () => {
    const username = userData?.username || "USER"
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `${username.substring(0, 4).toUpperCase()}-${timestamp.substring(0, 4)}-${random}`
  }

  const handleActivatePartner = () => {
    setError("")
    setSuccess("")

    if (!adminCode || adminCode.trim().length === 0) {
      setError("Please enter an admin code")
      return
    }

    // Verificar se a wallet está configurada
    if (!userData?.apiKey || !userData?.secretKey) {
      setError("You must configure your wallet before becoming a partner. Go to Wallet tab first.")
      return
    }

    const validAdminCodes = ["ADMIN2024", "ZIGPARTNER", "PREMIUM2024", "VIP2024"]
    
    if (validAdminCodes.includes(adminCode.toUpperCase())) {
      const newInviteCode = generateInviteCode()
      const updatedData = {
        ...userData,
        isPartner: true,
        partnerSince: new Date().toISOString(),
        myInviteCode: newInviteCode,
        inviteCount: 0,
        totalEarnings: 0,
        adminCodeUsed: adminCode.toUpperCase()
      }
      localStorage.setItem("user", JSON.stringify(updatedData))
      setUserData(updatedData)
      setIsPartner(true)
      setPartnerSince(updatedData.partnerSince)
      setMyInviteCode(newInviteCode)
      setInviteCount(0)
      setTotalEarnings(0)
      setSuccess("Partner status activated! Your invite code has been generated.")
      setAdminCode("")
    } else {
      setError("Invalid admin code. Please contact an administrator.")
    }
  }

  const handleRegenerateInviteCode = () => {
    setError("")
    const newInviteCode = generateInviteCode()
    const updatedData = {
      ...userData,
      myInviteCode: newInviteCode
    }
    localStorage.setItem("user", JSON.stringify(updatedData))
    setUserData(updatedData)
    setMyInviteCode(newInviteCode)
    setSuccess("New invite code generated!")
    setTimeout(() => setSuccess(""), 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Copied to clipboard!")
    setTimeout(() => setSuccess(""), 2000)
  }

  if (!isPartner) {
    const walletConfigured = userData?.apiKey && userData?.secretKey
    
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500/20 to-[#FF4532]/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Become a Partner</h3>
              <p className="text-white/70 text-sm">Earn $2 for each person who uses your invite link</p>
            </div>
          </div>
        </div>

        {/* Wallet Requirement Warning */}
        {!walletConfigured && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">Wallet Configuration Required</h3>
                <p className="text-orange-300/80 text-sm mb-3">
                  You must configure your ZIGpay wallet before becoming a partner. This is required to receive your earnings.
                </p>
                <button
                  onClick={() => {
                    // Trigger tab change to wallet
                    const walletTab = document.querySelector('[data-tab="wallet"]') as HTMLButtonElement
                    if (walletTab) walletTab.click()
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Configure Wallet Now
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FF4532]/20 rounded-full flex items-center justify-center">
              <Key className="w-5 h-5 text-[#FF4532]" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Activate Partner Status</h3>
              <p className="text-white/50 text-sm">Enter the code provided by an administrator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Administrator Code</label>
              <input
                type="text"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value.toUpperCase())}
                placeholder="Enter admin code"
                disabled={!walletConfigured}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50 uppercase font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-white/40 text-xs mt-2">
                Example: ADMIN2024, ZIGPARTNER, PREMIUM2024
              </p>
            </div>

            <button
              onClick={handleActivatePartner}
              disabled={!adminCode || !walletConfigured}
              className="w-full px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              Activate Partner Status
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Partner Benefits</h3>
              <p className="text-white/50 text-sm">What you get as a partner</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">$2 per Invite</p>
                <p className="text-white/60 text-sm">Earn $2 every time someone uses your link</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Personalized Link</p>
                <p className="text-white/60 text-sm">Generate your own unique invite code</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Statistics Dashboard</p>
                <p className="text-white/60 text-sm">Track your invites and earnings in real-time</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Priority Support</p>
                <p className="text-white/60 text-sm">24/7 priority customer service</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">How to get a code?</p>
              <p className="text-blue-300/80 text-sm">
                Contact a ZIG Music administrator to request a partner code.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#FF4532]/20 to-purple-500/20 border border-[#FF4532]/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#FF4532] rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl">Partner Status Active</h3>
            <p className="text-white/70 text-sm">
              Member since {new Date(partnerSince).toLocaleDateString('en-US')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-white/60 text-sm">Total Invites</p>
          </div>
          <p className="text-white font-bold text-3xl">{inviteCount}</p>
          <p className="text-white/40 text-xs mt-1">people invited</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-white/60 text-sm">Total Earnings</p>
          </div>
          <p className="text-white font-bold text-3xl">${totalEarnings.toFixed(2)}</p>
          <p className="text-white/40 text-xs mt-1">$2 per invite</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-white/60 text-sm">Next Payment</p>
          </div>
          <p className="text-white font-bold text-3xl">${(inviteCount * 2).toFixed(2)}</p>
          <p className="text-white/40 text-xs mt-1">available for withdrawal</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FF4532]/20 rounded-full flex items-center justify-center">
            <Key className="w-5 h-5 text-[#FF4532]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Your Invite Code</h3>
            <p className="text-white/50 text-sm">Share this code to earn $2 per person</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Invite Code</label>
            <div className="flex gap-3">
              <div className="flex-1 bg-black/30 border border-white/20 rounded-xl px-4 py-3 font-mono text-white text-lg tracking-wider flex items-center justify-center">
                {myInviteCode || "Generating..."}
              </div>
              <button
                onClick={() => copyToClipboard(myInviteCode)}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                title="Copy code"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Invite Link</label>
            <div className="flex gap-3">
              <div className="flex-1 bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white text-sm overflow-x-auto whitespace-nowrap">
                {typeof window !== 'undefined' ? `${window.location.origin}/invite/${myInviteCode}` : `https://zigmusic.com/invite/${myInviteCode}`}
              </div>
              <button
                onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}/invite/${myInviteCode}` : `https://zigmusic.com/invite/${myInviteCode}`)}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                title="Copy link"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleRegenerateInviteCode}
            className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Generate New Code
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <ExternalLink className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold">How to Share</h3>
            <p className="text-white/50 text-sm">Maximize your earnings by sharing your link</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              1
            </div>
            <div>
              <p className="text-white font-medium">Copy your link or code</p>
              <p className="text-white/60 text-sm">Use the copy buttons above</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              2
            </div>
            <div>
              <p className="text-white font-medium">Share on social media</p>
              <p className="text-white/60 text-sm">WhatsApp, Instagram, Twitter, Facebook</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <div className="w-6 h-6 bg-[#FF4532] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
              3
            </div>
            <div>
              <p className="text-white font-medium">Earn $2 per person</p>
              <p className="text-white/60 text-sm">When someone signs up using your link</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 text-sm font-medium mb-1">Partner Tip</p>
            <p className="text-green-300/80 text-sm">
              The more you share, the more you earn! There's no limit to invites.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

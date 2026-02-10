import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle admin login logic here
    console.log('Admin Login:', formData)
    // navigate('/admin/dashboard')
  }

  return (
    <main className="min-h-screen pt-24 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="relative inline-block mb-4">
              {/* Orange gradient circle behind */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#ff7400]/30 via-[#ff7400]/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
              </div>
              
              {/* Logo with float animation */}
              <div className="relative animate-[float_3s_ease-in-out_infinite]">
                <img 
                  src="/Untitled design (3).png" 
                  alt="LyFind" 
                  className="w-20 h-20"
                />
              </div>
            </div>
          </Link>
          <h1 className="text-4xl font-normal text-white mb-2">Admin Portal</h1>
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Shield className="w-5 h-5" />
            <span>System Administration</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  placeholder="admin@lsb.edu.ph"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff7400] focus:ring-[#ff7400] focus:ring-offset-0"
                />
                <span className="text-white/60 text-sm">Remember me</span>
              </label>
              <Link to="/admin/forgot-password" className="text-[#ff7400] hover:text-[#ff8500] text-sm transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#ff7400] hover:bg-[#ff8500] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#ff7400]/20"
            >
              Sign In as Admin
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#2f1632] text-white/40">or</span>
            </div>
          </div>

          {/* Other Login Options */}
          <div className="space-y-3">
            <Link 
              to="/login"
              className="block text-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
            >
              Student Login
            </Link>
            <Link 
              to="/faculty/login"
              className="block text-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
            >
              Faculty Login
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white/50 hover:text-white/70 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, School } from 'lucide-react'
import TermsModal from '@/components/TermsModal'
import PrivacyModal from '@/components/PrivacyModal'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' }
    if (strength <= 4) return { strength: 3, label: 'Good', color: 'bg-blue-500' }
    return { strength: 4, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    // Handle registration logic here
    console.log('Register:', formData)
    navigate('/browse')
  }

  return (
    <main className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6">
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
          <h1 className="text-4xl font-normal text-white mb-2">Join LyFind</h1>
        </div>

        {/* Register Form */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                    placeholder="Juan"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  placeholder="Dela Cruz"
                  required
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Student ID</label>
              <div className="relative">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  placeholder="2024-12345"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm mb-2">LSB Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  placeholder="your.email@lsb.edu.ph"
                  required
                />
              </div>
              <p className="text-white/40 text-xs mt-1">Use your official LSB email address</p>
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
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength === 1 ? 'text-red-400' :
                      passwordStrength.strength === 2 ? 'text-yellow-400' :
                      passwordStrength.strength === 3 ? 'text-blue-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs">
                    Use 8+ characters with uppercase, lowercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ff7400]/50 focus:bg-white/10 transition-all"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-[#ff7400] focus:ring-[#ff7400] focus:ring-offset-0"
                  required
                />
                <span className="text-white/60 text-sm">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#ff7400] hover:text-[#ff8500] transition-colors underline"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-[#ff7400] hover:text-[#ff8500] transition-colors underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#ff7400] hover:bg-[#ff8500] text-white font-medium rounded-xl transition-all shadow-lg shadow-[#ff7400]/20"
            >
              Sign Up
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#ff7400] hover:text-[#ff8500] font-medium transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-white/50 hover:text-white/70 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Modals */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </main>
  )
}

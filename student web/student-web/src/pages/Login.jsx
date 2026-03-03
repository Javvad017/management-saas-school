import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('=== FORM SUBMIT ===')
    console.log('Email:', formData.email)
    console.log('Password:', formData.password ? '***' : 'EMPTY')
    console.log('Role:', formData.role)
    
    // Validation
    if (!formData.email || !formData.password) {
      console.error('Validation failed: Missing email or password')
      setError('Please enter email and password')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      console.log('Calling login function...')
      const result = await login(formData.email, formData.password, formData.role)
      
      console.log('Login result:', result)
      
      if (result.success) {
        console.log('Login successful! Redirecting...')
        
        // Navigate based on role
        if (result.role === 'student') {
          console.log('Navigating to /student/dashboard')
          navigate('/student/dashboard')
        } else if (result.role === 'parent') {
          console.log('Navigating to /parent/dashboard')
          navigate('/parent/dashboard')
        } else if (result.role === 'admin') {
          console.log('Navigating to /dashboard')
          navigate('/dashboard')
        }
      }
    } catch (err) {
      console.error('Login failed:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Check credentials.'
      console.error('Error message:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">School Management System</h1>
          <p className="text-gray-600">Student & Parent Portal</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'student' })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    formData.role === 'student'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'parent' })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    formData.role === 'parent'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Parent
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p className="font-medium mb-2">Test Credentials:</p>
            <p>Student: student@school.com / student123</p>
            <p>Parent: parent@school.com / parent123</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Contact your school administrator if you need help logging in.
        </p>
      </div>
    </div>
  )
}

export default Login

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    console.log('AuthContext: Restoring session...')
    console.log('Stored user:', storedUser)
    console.log('Stored token:', storedToken)
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser({ ...parsedUser, token: storedToken })
        console.log('AuthContext: Session restored', parsedUser)
      } catch (error) {
        console.error('AuthContext: Failed to parse stored user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email:', email)
    console.log('Password:', password ? '***' : 'EMPTY')
    console.log('Role:', role)
    
    try {
      console.log('Sending login request to:', api.defaults.baseURL + '/auth/login')
      
      const response = await api.post('/auth/login', {
        email,
        password,
        role
      })
      
      console.log('Login response:', response.data)
      
      const { token, user: userData } = response.data
      
      if (!token || !userData) {
        throw new Error('Invalid response from server')
      }
      
      // Store token and user separately
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set user state with token
      const userWithToken = { ...userData, token }
      setUser(userWithToken)
      
      console.log('Login successful! User:', userData)
      console.log('Navigating to dashboard for role:', userData.role)
      
      return { success: true, role: userData.role }
    } catch (error) {
      console.error('=== LOGIN ERROR ===')
      console.error('Error message:', error.message)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Full error:', error)
      
      throw error
    }
  }

  const logout = () => {
    console.log('Logging out...')
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

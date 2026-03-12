import { createContext, useState, useEffect, useContext } from 'react'
import { getMe, login, logout, register } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Page load hone pe check karo user logged in hai ya nahi
    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await getMe()
                setUser(res.data)
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkUser()
    }, [])

    const loginUser = async (data) => {
        const res = await login(data)
        setUser(res.data)
    }

    const registerUser = async (data) => {
        const res = await register(data)
        setUser(res.data)
    }

    const logoutUser = async () => {
        await logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
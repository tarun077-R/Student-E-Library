// Login.jsx
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await loginUser({ email, password })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        }
    }

    return (
      <div className="h-[calc(100vh-56px)]  bg-[#1a1d2e] flex items-center justify-center">
            <div className="w-full max-w-md px-8 py-10 bg-[#13151f] border border-white/5 rounded-xl">

                <div className="mb-8">
                    <h1 className="text-white text-2xl font-black tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-white/30 text-sm mt-1">
                        Login to access your library
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-white/40 text-xs">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-white/40 text-xs">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-white text-black font-semibold text-sm py-3 rounded-lg hover:bg-white/90 transition-all mt-2 cursor-pointer border-none"
                    >
                        Login
                    </button>
                </form>

                <p className="text-white/30 text-sm text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-white hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
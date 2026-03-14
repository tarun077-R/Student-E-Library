import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const { registerUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await registerUser({ name, email, password })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        }
    }

    return (
       // Yeh line change karo
<div className="min-h-[calc(100vh-64px)] bg-[#1a1d2e] flex items-center justify-center relative overflow-hidden px-4 py-8">

            {/* Background glow */}
            <div className="absolute top-20 right-10 md:right-40 w-52 md:w-72 h-52 md:h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 md:left-40 w-52 md:w-72 h-52 md:h-72 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Glass Card */}
            <div
                className="relative w-full max-w-md px-6 md:px-8 py-8 md:py-10 rounded-2xl border border-white/10 z-10"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }}
            >
                <div className="mb-6 md:mb-8">
                    <h1 className="text-white text-xl md:text-2xl font-black tracking-tight">
                        Create account
                    </h1>
                    <p className="text-white/30 text-sm mt-1">
                        Join E-Library today
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-white/40 text-xs">Name</label>
                        <input
                            type="text"
                            placeholder="Tarun Rawat"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                        />
                    </div>

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
                        Create Account
                    </button>
                </form>

                <p className="text-white/30 text-sm text-center mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
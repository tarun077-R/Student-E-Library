import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    const handleLogout = async () => {
        await logoutUser()
        navigate('/login')
    }

    const handleChange = (e) => {
        const value = e.target.value
        setSearch(value)
        if (value.trim()) {
            navigate(`/?search=${value}`)
        } else {
            navigate('/')
        }
    }

    const handleClear = () => {
        setSearch('')
        navigate('/')
    }

    return (
        <nav className="bg-[#13151f] border-b border-white/5 sticky top-0 z-50">
            <div className="px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="no-underline">
                    <span className="text-white font-black text-xl tracking-tight">
                        HOME<span className="text-white/40">LIBRARY</span>
                    </span>
                </Link>

                {/* Search */}
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2 w-96">
                    <span className="text-white/30 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={handleChange}
                        className="bg-transparent text-white text-sm outline-none placeholder:text-white/30 w-full"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-white/30 hover:text-white transition-all cursor-pointer bg-transparent border-none text-sm"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-7">
                    {user ? (
                        <>
                            <Link to="/dashboard"
                                className="text-white/50 text-sm hover:text-white transition-all no-underline font-semibold">
                                My Shelf
                            </Link>

                            {user?.role === 'admin' && (
                                <Link to="/admin"
                                    className="text-white/50 text-sm hover:text-white transition-all no-underline font-semibold">
                                    Admin
                                </Link>
                            )}

                            <span className="text-white/50 text-sm font-semibold">
                                {user.name}
                            </span>

                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="text-white/40 text-sm hover:text-white transition-all cursor-pointer bg-transparent border-none font-semibold"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"
                                className="text-white/50 text-sm hover:text-white transition-all no-underline font-semibold">
                                Login
                            </Link>
                            <Link to="/register"
                                className="text-sm px-4 py-1.5 rounded-lg no-underline bg-white text-black hover:bg-white/90 transition-all font-semibold">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
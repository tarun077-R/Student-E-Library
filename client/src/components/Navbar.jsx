import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    // Landing page pe search hide karo
    const isLanding = location.pathname === '/'

    const handleLogout = async () => {
        await logoutUser()
        navigate('/login')
        setShowMenu(false)
    }

    const handleChange = (e) => {
        const value = e.target.value
        setSearch(value)
        if (value.trim()) {
            navigate(`/home?search=${value}`)
        } else {
            navigate('/home')
        }
    }

    const handleClear = () => {
        setSearch('')
        navigate('/home')
        setShowSearch(false)
    }

    return (
        <nav className="bg-[#13151f] border-b border-white/5 sticky top-0 z-50">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-3">

                {/* Logo */}
                <Link to="/" className="no-underline shrink-0">
                    <span className="text-white font-black text-lg md:text-xl tracking-tight">
                        HOME<span className="text-white/40">LIBRARY</span>
                    </span>
                </Link>

                {/* Search — Landing pe nahi dikhega */}
                {!isLanding && (
                    <>
                        {/* Desktop Search */}
                        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2 w-96">
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

                        {/* Mobile Search Expanded */}
                        {showSearch && (
                            <div className="md:hidden flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 gap-2 flex-1">
                                <span className="text-white/30 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={search}
                                    onChange={handleChange}
                                    autoFocus
                                    className="bg-transparent text-white text-sm outline-none placeholder:text-white/30 w-full"
                                />
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-white/30 hover:text-white transition-all cursor-pointer bg-transparent border-none text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Right Side */}
                <div className="flex items-center gap-2 md:gap-7 shrink-0">

                    {/* Mobile Search Icon — Landing pe nahi */}
                    {!isLanding && !showSearch && (
                        <button
                            onClick={() => setShowSearch(true)}
                            className="md:hidden text-white/50 hover:text-white bg-transparent border-none cursor-pointer text-lg"
                        >
                            🔍
                        </button>
                    )}

                    {user ? (
                        <>
                            <Link to="/dashboard"
                                className="hidden md:block text-white/50 text-sm hover:text-white transition-all no-underline font-semibold">
                                My Shelf
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin"
                                    className="hidden md:block text-white/50 text-sm hover:text-white transition-all no-underline font-semibold">
                                    Admin
                                </Link>
                            )}
                            <span className="hidden md:block text-white/50 text-sm font-semibold">
                                {user.name}
                            </span>

                            <div
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm font-bold cursor-pointer relative"
                            >
                                {user.name?.charAt(0).toUpperCase()}

                                {showMenu && (
                                    <div className="absolute top-10 right-0 bg-[#13151f] border border-white/10 rounded-xl py-2 w-44 shadow-2xl md:hidden">
                                        <Link to="/dashboard"
                                            onClick={() => setShowMenu(false)}
                                            className="block px-4 py-2 text-white/60 text-sm hover:text-white hover:bg-white/5 no-underline">
                                            📚 My Shelf
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin"
                                                onClick={() => setShowMenu(false)}
                                                className="block px-4 py-2 text-white/60 text-sm hover:text-white hover:bg-white/5 no-underline">
                                                ⚙️ Admin
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-white/60 text-sm hover:text-white hover:bg-white/5 bg-transparent border-none cursor-pointer"
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="hidden md:block text-white/40 text-sm hover:text-white transition-all cursor-pointer bg-transparent border-none font-semibold"
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
                                className="text-sm px-3 md:px-4 py-1.5 rounded-lg no-underline bg-white text-black hover:bg-white/90 transition-all font-semibold">
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
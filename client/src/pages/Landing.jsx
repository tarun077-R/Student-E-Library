import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const words = ['Students', 'Readers', 'Learners', 'Explorers']

const Landing = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [wordIndex, setWordIndex] = useState(0)
    const [visible, setVisible] = useState(true)
    const [count, setCount] = useState({ books: 0, readers: 0 })
    const [loaded, setLoaded] = useState(false)

    // Page load animation
    useEffect(() => {
        setTimeout(() => setLoaded(true), 100)
    }, [])

    // Word cycling animation
    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => {
                setWordIndex(prev => (prev + 1) % words.length)
                setVisible(true)
            }, 300)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    // Counter animation
    useEffect(() => {
        const duration = 2000
        const steps = 60
        const bookTarget = 50
        const readerTarget = 500
        let step = 0
        const timer = setInterval(() => {
            step++
            setCount({
                books: Math.floor((bookTarget * step) / steps),
                readers: Math.floor((readerTarget * step) / steps),
            })
            if (step >= steps) clearInterval(timer)
        }, duration / steps)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#1a1d2e] text-white overflow-hidden relative flex flex-col">

            {/* Subtle background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full opacity-5 blur-3xl animate-pulse"
                    style={{ background: 'radial-gradient(circle, #00ff87, transparent)' }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full opacity-5 blur-3xl animate-pulse"
                    style={{ background: 'radial-gradient(circle, #00ff87, transparent)', animationDelay: '1.5s' }} />
            </div>

            {/* Hero */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 py-16">

                {/* Badge — fade in */}
                <div
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 transition-all duration-700"
                    style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)' }}
                >
                    <div className="w-2 h-2 rounded-full bg-[#00ff87] animate-pulse" />
                    <span className="text-white/50 text-xs tracking-widest uppercase">Free Digital Library</span>
                </div>

                {/* Main Title — fade in delay */}
                <div
                    className="transition-all duration-700"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? 'translateY(0)' : 'translateY(30px)',
                        transitionDelay: '0.2s'
                    }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 leading-tight">
                        A Library Built
                        <br />
                        <span className="text-white/20">for</span>{' '}
                        <span
                            style={{
                                color: '#00ff87',
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateY(0px)' : 'translateY(-15px)',
                                display: 'inline-block',
                                transition: 'opacity 0.3s ease, transform 0.3s ease',
                            }}
                        >
                            {words[wordIndex]}
                        </span>
                    </h1>
                </div>

                {/* Subtitle */}
                <p
                    className="text-white/30 text-sm md:text-lg max-w-xl mb-10 leading-relaxed transition-all duration-700"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                        transitionDelay: '0.4s'
                    }}
                >
                    Browse thousands of books, read online with our beautiful reader,
                    and save your favorites to your personal shelf.
                </p>

                {/* CTA Buttons */}
                <div
                    className="flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-700"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                        transitionDelay: '0.6s'
                    }}
                >
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center justify-center gap-2 bg-[#00ff87] text-black font-bold text-sm px-8 py-4 rounded-full hover:bg-[#00cc6a] transition-all cursor-pointer border-none"
                    >
                        📚 Browse Library →
                    </button>

                    {/* Login hone pe button change */}
                    {user ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center gap-2 bg-transparent text-white font-semibold text-sm px-8 py-4 rounded-full border border-white/20 hover:border-[#00ff87]/50 hover:text-[#00ff87] transition-all cursor-pointer"
                        >
                            📖 My Shelf →
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/register')}
                            className="flex items-center justify-center gap-2 bg-transparent text-white font-semibold text-sm px-8 py-4 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer"
                        >
                            Get Started Free
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div
                    className="flex gap-8 md:gap-16 transition-all duration-700"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transitionDelay: '0.8s'
                    }}
                >
                    <div className="text-center">
                        <p className="text-2xl md:text-4xl font-black text-white">{count.books}+</p>
                        <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Books</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                        <p className="text-2xl md:text-4xl font-black text-white">{count.readers}+</p>
                        <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Readers</p>
                    </div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center">
                        <p className="text-2xl md:text-4xl font-black text-white">24/7</p>
                        <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">Available</p>
                    </div>
                </div>
            </div>

            {/* Bottom Features */}
            <div
                className="relative z-10 px-4 md:px-12 py-8 md:py-12 border-t border-white/5 transition-all duration-700"
                style={{
                    opacity: loaded ? 1 : 0,
                    transitionDelay: '1s'
                }}
            >
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    {[
                        { icon: '📖', title: 'Beautiful Reader', desc: '3 themes — Paper, Sepia, Dark' },
                        { icon: '📚', title: 'Personal Shelf', desc: 'Save books to your collection' },
                        { icon: '🔍', title: 'Smart Search', desc: 'Find books instantly' },
                    ].map((feature, i) => (
                        <div
                            key={feature.title}
                            className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#00ff87]/20 hover:bg-white/8 transition-all cursor-pointer"
                            style={{
                                transitionDelay: `${1.2 + i * 0.1}s`
                            }}
                        >
                            <span className="text-2xl">{feature.icon}</span>
                            <div>
                                <h3 className="text-white text-sm font-semibold">{feature.title}</h3>
                                <p className="text-white/30 text-xs mt-1">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Landing
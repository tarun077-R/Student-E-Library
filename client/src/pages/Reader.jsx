import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookById } from '../services/api'

const Reader = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showUI, setShowUI] = useState(true)
    const [theme, setTheme] = useState('paper')
    const [showThemes, setShowThemes] = useState(false)
    const hideTimer = useRef(null)

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await getBookById(id)
                setBook(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchBook()
    }, [id])

    const resetHideTimer = () => {
        setShowUI(true)
        clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => setShowUI(false), 3000)
    }

    useEffect(() => {
        resetHideTimer()
        return () => clearTimeout(hideTimer.current)
    }, [])

    const themes = {
        paper: {
            bg: '#f4f0e8',
            text: '#2c1810',
            navbar: 'rgba(244, 240, 232, 0.95)',
            border: '#d4c5a9',
            label: '📄 Paper'
        },
        sepia: {
            bg: '#f5e6c8',
            text: '#4a3728',
            navbar: 'rgba(245, 230, 200, 0.95)',
            border: '#c9a96e',
            label: '🍂 Sepia'
        },
        dark: {
            bg: '#1a1a2e',
            text: '#c8b89a',
            navbar: 'rgba(20, 20, 40, 0.95)',
            border: '#333355',
            label: '🌙 Dark'
        },
    }

    const currentTheme = themes[theme]

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: themes.paper.bg }}>
            <div className="text-center">
                <div className="text-4xl mb-4">📖</div>
                <p className="text-sm tracking-widest" style={{ color: themes.paper.text, opacity: 0.4 }}>
                    OPENING BOOK...
                </p>
            </div>
        </div>
    )

    if (!book) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: themes.paper.bg }}>
            <p style={{ color: themes.paper.text, opacity: 0.4 }}>Book not found!</p>
        </div>
    )

    return (
        <div
            className="min-h-screen flex flex-col transition-colors duration-500 relative"
            style={{ background: currentTheme.bg }}
            onMouseMove={resetHideTimer}
            onClick={resetHideTimer}
        >
            {/* Top Navbar */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
                style={{
                    background: currentTheme.navbar,
                    borderColor: currentTheme.border,
                    backdropFilter: 'blur(12px)',
                }}>
                <div className="px-4 md:px-8 h-12 md:h-14 flex items-center justify-between gap-3">

                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 md:gap-2 transition-all cursor-pointer bg-transparent border-none group shrink-0"
                        style={{ color: currentTheme.text, opacity: 0.6 }}
                    >
                        <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                        <span className="text-xs tracking-widest uppercase font-semibold hidden sm:block">Back</span>
                    </button>

                    {/* Title */}
                    <div className="text-center flex-1 min-w-0">
                        <h1 className="text-xs md:text-sm font-black tracking-widest uppercase truncate" style={{ color: currentTheme.text }}>
                            {book.title}
                        </h1>
                        <p className="text-xs tracking-widest uppercase mt-0.5 hidden sm:block" style={{ color: currentTheme.text, opacity: 0.4 }}>
                            {book.author}
                        </p>
                    </div>

                    {/* Theme Switcher — Desktop */}
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        {Object.entries(themes).map(([key, val]) => (
                            <button
                                key={key}
                                onClick={() => setTheme(key)}
                                className="text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer"
                                style={{
                                    background: theme === key ? currentTheme.text : 'transparent',
                                    color: theme === key ? currentTheme.bg : currentTheme.text,
                                    borderColor: currentTheme.border,
                                    opacity: theme === key ? 1 : 0.5,
                                }}
                            >
                                {val.label}
                            </button>
                        ))}
                    </div>

                    {/* Theme Switcher — Mobile Dropdown */}
                    <div className="md:hidden relative shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowThemes(!showThemes) }}
                            className="text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer"
                            style={{
                                background: 'transparent',
                                color: currentTheme.text,
                                borderColor: currentTheme.border,
                                opacity: 0.7,
                            }}
                        >
                            🎨
                        </button>

                        {showThemes && (
                            <div className="absolute top-10 right-0 rounded-xl border shadow-xl overflow-hidden z-50"
                                style={{ background: currentTheme.navbar, borderColor: currentTheme.border }}>
                                {Object.entries(themes).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={(e) => { e.stopPropagation(); setTheme(key); setShowThemes(false) }}
                                        className="block w-full text-left text-xs px-4 py-2.5 transition-all cursor-pointer border-none"
                                        style={{
                                            background: theme === key ? `${currentTheme.text}20` : 'transparent',
                                            color: currentTheme.text,
                                        }}
                                    >
                                        {val.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Book Content */}
            <div className="flex-1 flex justify-center pt-14 md:pt-20 pb-12 md:pb-16 px-2 md:px-4">
                <div
                    className="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
                    style={{
                        background: currentTheme.bg,
                        boxShadow: `0 20px 60px rgba(0,0,0,0.3), inset 0 0 0 1px ${currentTheme.border}, -8px 0 20px rgba(0,0,0,0.1)`,
                        borderLeft: `4px solid ${currentTheme.border}`,
                    }}
                >
                    {/* Book top decoration */}
                    <div className="px-4 md:px-12 pt-4 md:pt-8 pb-4 border-b flex items-center justify-between"
                        style={{ borderColor: currentTheme.border, opacity: 0.6 }}>
                        <span className="text-xs tracking-widest uppercase font-semibold truncate" style={{ color: currentTheme.text }}>
                            {book.title}
                        </span>
                        <span className="text-xs tracking-widest uppercase shrink-0 ml-2" style={{ color: currentTheme.text }}>
                            {book.author}
                        </span>
                    </div>

                    {/* Iframe */}
                    <div className="relative overflow-hidden">
                        <iframe
                            src={book.fileUrl}
                            title={book.title}
                            className="w-full border-none"
                            style={{
                                height: 'calc(100vh - 120px)',
                                width: 'calc(100% + 20px)',
                                filter: theme === 'dark'
                                    ? 'invert(1) hue-rotate(180deg) brightness(0.85)'
                                    : theme === 'sepia'
                                        ? 'sepia(0.4) contrast(0.95)'
                                        : 'contrast(1.02)',
                            }}
                        />
                    </div>

                    {/* Bottom decoration */}
                    <div className="px-4 md:px-12 py-3 border-t flex items-center justify-center"
                        style={{ borderColor: currentTheme.border }}>
                        <span className="text-xs tracking-widest" style={{ color: currentTheme.text, opacity: 0.3 }}>
                            ✦ ✦ ✦
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                <div className="px-4 md:px-8 py-3 flex items-center justify-between border-t"
                    style={{
                        background: currentTheme.navbar,
                        borderColor: currentTheme.border,
                        backdropFilter: 'blur(12px)',
                    }}>
                    <p className="text-xs tracking-widest uppercase hidden sm:block" style={{ color: currentTheme.text, opacity: 0.3 }}>
                        Move mouse to show controls
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs tracking-widest uppercase" style={{ color: currentTheme.text, opacity: 0.4 }}>
                            Reading
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reader
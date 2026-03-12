import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookById } from '../services/api'

const Reader = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showUI, setShowUI] = useState(true)
    const [theme, setTheme] = useState('paper') // paper, dark, sepia
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
                <div className="px-8 h-14 flex items-center justify-between">

                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 transition-all cursor-pointer bg-transparent border-none group"
                        style={{ color: currentTheme.text, opacity: 0.6 }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                    >
                        <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                        <span className="text-xs tracking-widest uppercase font-semibold">Back</span>
                    </button>

                    {/* Title */}
                    <div className="text-center">
                        <h1 className="text-sm font-black tracking-widest uppercase" style={{ color: currentTheme.text }}>
                            {book.title}
                        </h1>
                        <p className="text-xs tracking-widest uppercase mt-0.5" style={{ color: currentTheme.text, opacity: 0.4 }}>
                            {book.author}
                        </p>
                    </div>

                    {/* Theme Switcher */}
                    <div className="flex items-center gap-2">
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
                </div>
            </div>

            {/* Book Content */}
            <div className="flex-1 flex justify-center pt-20 pb-16 px-4">
                <div
                    className="w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
                    style={{
                        background: currentTheme.bg,
                        boxShadow: `0 20px 60px rgba(0,0,0,0.3), 
                                    inset 0 0 0 1px ${currentTheme.border},
                                    -8px 0 20px rgba(0,0,0,0.1)`,
                        borderLeft: `4px solid ${currentTheme.border}`,
                    }}
                >
                    {/* Book top decoration */}
                    <div className="px-12 pt-8 pb-4 border-b flex items-center justify-between"
                        style={{ borderColor: currentTheme.border, opacity: 0.6 }}>
                        <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: currentTheme.text }}>
                            {book.title}
                        </span>
                        <span className="text-xs tracking-widest uppercase" style={{ color: currentTheme.text }}>
                            {book.author}
                        </span>
                    </div>

                    {/* Iframe */}
                  {/* Iframe wrapper */}
<div className="relative overflow-hidden">
    <iframe
        src={book.fileUrl}
        title={book.title}
        className="w-full border-none"
        style={{
            height: 'calc(100vh - 160px)',
            width: 'calc(100% + 20px)', // 20px extra — scrollbar hide
            filter: theme === 'dark'
                ? 'invert(1) hue-rotate(180deg) brightness(0.85)'
                : theme === 'sepia'
                    ? 'sepia(0.4) contrast(0.95)'
                    : 'contrast(1.02)',
        }}
    />
</div>

                    {/* Bottom decoration */}
                    <div className="px-12 py-3 border-t flex items-center justify-center"
                        style={{ borderColor: currentTheme.border }}>
                        <span className="text-xs tracking-widest" style={{ color: currentTheme.text, opacity: 0.3 }}>
                            ✦ ✦ ✦
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
                <div className="px-8 py-3 flex items-center justify-between border-t"
                    style={{
                        background: currentTheme.navbar,
                        borderColor: currentTheme.border,
                        backdropFilter: 'blur(12px)',
                    }}>
                    <p className="text-xs tracking-widest uppercase" style={{ color: currentTheme.text, opacity: 0.3 }}>
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
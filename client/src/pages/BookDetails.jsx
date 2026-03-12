import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookById, saveBook } from '../services/api'
import { useAuth } from '../context/AuthContext'

const BookDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [book, setBook] = useState(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [saved, setSaved] = useState(false)

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

    const handleSave = async () => {
        try {
            const res = await saveBook(book._id)
            setMessage(res.data.message)
            setSaved(!saved)
        } catch (error) {
            setMessage('Login karo pehle!')
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-[#1a1d2e] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    )

    if (!book) return (
        <div className="min-h-screen bg-[#1a1d2e] flex items-center justify-center">
            <p className="text-white/30">Book not found!</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#1a1d2e] text-white">

            {/* Back button */}
            <div className="px-10 py-6 border-b border-white/5">
                <button
                    onClick={() => navigate('/')}
                    className="text-white/40 text-sm hover:text-white transition-all cursor-pointer bg-transparent border-none flex items-center gap-2"
                >
                    ← Back to Library
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-10 py-12 flex gap-12">

                {/* Cover Image */}
                <div className="w-[200px] shrink-0">
                    <div className="aspect-[3/4] bg-[#13151f] rounded-xl overflow-hidden border border-white/5">
                        {book.coverImage ? (
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl">
                                📖
                            </div>
                        )}
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mt-3 justify-center">
                        {[1,2,3,4,5].map(star => (
                            <span key={star} className="text-yellow-400">★</span>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1">

                    {/* Category Badge */}
                    <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {book.category}
                    </span>

                    {/* Title */}
                    <h1 className="text-4xl font-black tracking-tight mt-4 mb-2">
                        {book.title}
                    </h1>

                    {/* Author */}
                    <p className="text-white/50 text-sm mb-6">
                        by <span className="text-white/80">{book.author}</span>
                    </p>

                    {/* Divider */}
                    <div className="border-t border-white/5 mb-6" />

                    {/* Description */}
                    <p className="text-white/40 text-sm leading-relaxed mb-8">
                        {book.description || 'No description available.'}
                    </p>

                    {/* Message */}
                    {message && (
                        <div className="bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-3 rounded-lg mb-6">
                            {message}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                     <button
    onClick={() => navigate(`/read/${book._id}`)}
    className="bg-white text-black font-semibold text-sm px-6 py-3 rounded-lg hover:bg-white/90 transition-all cursor-pointer border-none"
>
    📖 Read Book
</button>

                        {user && (
                            <button
                                onClick={handleSave}
                                className={`font-semibold text-sm px-6 py-3 rounded-lg transition-all cursor-pointer border ${
                                    saved
                                        ? 'bg-white/10 text-white border-white/20'
                                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                            >
                                {saved ? '✓ Saved' : '📚 Save to Shelf'}
                            </button>
                        )}
                    </div>

                    {/* Uploaded by */}
                    {book.uploadedBy && (
                        <p className="text-white/20 text-xs mt-8">
                            Uploaded by {book.uploadedBy.name}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookDetail
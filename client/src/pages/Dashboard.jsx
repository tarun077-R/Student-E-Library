import { useState, useEffect } from 'react'
import { getShelf } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import BookCard from '../components/BookCard'

const Dashboard = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        const fetchShelf = async () => {
            try {
                const res = await getShelf()
                setBooks(res.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchShelf()
    }, [user])

    if (loading) return (
        <div className="min-h-screen bg-[#1a1d2e] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#1a1d2e] text-white">

            {/* Header */}
            <div className="border-b border-white/5 px-4 md:px-10 py-6 md:py-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-black text-lg shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-white font-black text-xl md:text-2xl tracking-tight">
                            {user?.name}'s Shelf
                        </h1>
                        <p className="text-white/30 text-sm">
                            {books.length} {books.length === 1 ? 'book' : 'books'} saved
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-10 py-6 md:py-8">
                {books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 md:py-24 gap-4">
                        <span className="text-6xl">📚</span>
                        <p className="text-white/30 text-sm">
                            Your shelf is empty!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm px-5 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-all cursor-pointer border-none mt-2"
                        >
                            Browse Books
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-6">
                            Saved Books
                        </h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
                            {books.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard
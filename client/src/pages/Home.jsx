import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getAllBooks } from '../services/api'
import BookCard from '../components/BookCard'

const categories = ['All', 'Fiction', 'Novel', 'Science Fiction', 'Fantasy', 'Non-fiction', 'Mystery', 'Thriller', 'Computer Science', 'Mathematics', 'Physics', 'Web', 'Other']

const Home = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('All')

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const search = searchParams.get('search') || ''

    const fetchBooks = async () => {
        try {
            setLoading(true)
            const params = {}
            if (search) params.search = search
            if (category && category !== 'All') params.category = category
            const res = await getAllBooks(params)
            setBooks(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [category, search])

    return (
        <div className="min-h-[calc(100vh-56px)]  bg-[#1a1d2e] text-white flex">

            {/* Sidebar */}
            <div className="w-52 shrink-0 bg-[#13151f] border-r border-white/5 px-4 py-6 min-h-screen">
                <p className="text-white/40 text-xs font-bold tracking-widest uppercase mb-3">
                    Genres
                </p>
                <div className="flex flex-col gap-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`text-left text-sm px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                category === cat
                                    ? 'text-white bg-white/10'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-8 py-6">

                {/* Search result indicator */}
                {search && (
                    <p className="text-white/40 text-sm mb-6">
                        Search results for: <span className="text-white">"{search}"</span>
                    </p>
                )}

                {/* Most Popular */}
                <div className="mb-10">
                    <h2 className="text-white font-bold text-sm tracking-widest uppercase mb-4">
                        {search ? 'Search Results' : 'Most Popular'}
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    ) : books.length === 0 ? (
                        <p className="text-white/30 text-sm">No books found 😔</p>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                            {books.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommended — sirf tab dikhao jab search nahi ho */}
                {!search && (
                    <div>
                        <h2 className="text-white font-bold text-sm tracking-widest uppercase mb-4">
                            Recommended
                        </h2>
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                            {books.slice(0, 7).map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
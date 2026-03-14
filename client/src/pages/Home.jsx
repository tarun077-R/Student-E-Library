import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getAllBooks } from '../services/api'
import BookCard from '../components/BookCard'
import BookSkeleton from '../components/BookSelection'

const categories = ['All', 'Fiction', 'Novel', 'Science Fiction', 'Fantasy', 'Non-fiction', 'Mystery', 'Thriller', 'Computer Science', 'Mathematics', 'Physics', 'Web', 'Other']

const Home = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('All')
    const [showslide,setshowslide] = useState(false)

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
        <div className="min-h-screen  bg-[#1a1d2e] text-white flex">

{showslide && (
    <div className='fixed inset-0 bg-black/50 z-40 md:hidden ' onClick={()=>setshowslide(false)}>

    </div>
)}
            {/* Sidebar */}
             <div className={`
                fixed md:sticky top-0 md:top-16 z-50 md:z-auto
                h-screen md:h-[calc(100vh-64px)]
                w-52 shrink-0 bg-[#13151f] border-r border-white/5 px-4 py-6
                overflow-y-auto transition-transform duration-300
                ${showslide ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <button onClick={()=> setshowslide(false)} className='md:hidden text-white/30 hover:text-white text-sm mb-4 bg-transparent border-none cursor-pointer'>
                    ✕ Close
                </button>
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
            <div className="flex-1 px-4 md:px-8 py-6 overflow-x-hidden">

  {/* Mobile Filter Button */}
                <button
                    onClick={() => setshowslide(true)}
                    className="md:hidden flex items-center gap-2 text-white/50 text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-lg mb-6 cursor-pointer"
                >
                    ☰ Genres — {category}
                </button>
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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7  gap-3 md:gap-4">
        {[...Array(14)].map((_, i) => (
            <BookSkeleton key={i} />
        ))}
    </div>
) : books.length === 0 ? (
                        <p className="text-white/30 text-sm">No books found 😔</p>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4">
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
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
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
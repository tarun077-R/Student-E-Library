import { useNavigate } from 'react-router-dom'

const BookCard = ({ book }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/book/${book._id}`)}
            className="cursor-pointer group"
        >
            {/* Cover */}
            <div className="aspect-[3/4] bg-[#1e2132] rounded-lg overflow-hidden mb-2">
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                        📖
                    </div>
                )}
            </div>

            {/* Info */}
            <h3 className="text-white text-xs font-semibold truncate">
                {book.title}
            </h3>
            <p className="text-white/40 text-xs truncate mt-0.5">
                {book.author}
            </p>

            {/* Stars */}
            <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(star => (
                    <span key={star} className="text-yellow-400 text-xs">★</span>
                ))}
            </div>
        </div>
    )
}

export default BookCard
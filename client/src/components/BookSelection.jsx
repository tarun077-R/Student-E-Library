const BookSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="aspect-[3/4] bg-white/5 rounded-lg mb-2" />
            <div className="h-3 bg-white/5 rounded mb-1" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
        </div>
    )
}

export default BookSkeleton
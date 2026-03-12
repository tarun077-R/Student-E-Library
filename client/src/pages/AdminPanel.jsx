import { useState, useEffect } from 'react'
import { getAllBooks, addBook, deleteBook } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [activeTab, setActiveTab] = useState('books') // 'books' or 'add'

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [file, setFile] = useState(null)
    const [coverImage, setCoverImage] = useState(null)

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
            return
        }
        fetchBooks()
    }, [user])

    const fetchBooks = async () => {
        try {
            const res = await getAllBooks()
            setBooks(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddBook = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('author', author)
            formData.append('description', description)
            formData.append('category', category)
            formData.append('file', file)
            formData.append('coverImage', coverImage)

            await addBook(formData)
            setMessage('Book added successfully! ✅')
            fetchBooks()
            setTitle('')
            setAuthor('')
            setDescription('')
            setCategory('')
            setFile(null)
            setCoverImage(null)
            setActiveTab('books')
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong')
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteBook(id)
            setMessage('Book deleted!')
            fetchBooks()
        } catch (error) {
            setMessage('Delete failed!')
        }
    }

    if (loading) return (
        <div className="min-h-[calc(100vh-56px)]  bg-[#1a1d2e] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#1a1d2e] text-white">

            {/* Header */}
            <div className="border-b border-white/5 px-10 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-white font-black text-2xl tracking-tight">
                        Admin Panel
                    </h1>
                    <p className="text-white/30 text-sm mt-1">
                        {books.length} books in library
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('books')}
                        className={`text-sm px-4 py-2 rounded-md transition-all cursor-pointer border-none ${
                            activeTab === 'books'
                                ? 'bg-white text-black font-semibold'
                                : 'text-white/50 hover:text-white bg-transparent'
                        }`}
                    >
                        All Books
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`text-sm px-4 py-2 rounded-md transition-all cursor-pointer border-none ${
                            activeTab === 'add'
                                ? 'bg-white text-black font-semibold'
                                : 'text-white/50 hover:text-white bg-transparent'
                        }`}
                    >
                        + Add Book
                    </button>
                </div>
            </div>

            <div className="px-10 py-8">

                {/* Message */}
                {message && (
                    <div className="bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-3 rounded-lg mb-6">
                        {message}
                    </div>
                )}

                {/* Add Book Form */}
               {activeTab === 'add' && (
    <div className="flex gap-10 items-start justify-between">

        {/* Left - Form */}
        <form onSubmit={handleAddBook} className="w-[600px] flex flex-col gap-4">
            <h2 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2">
                Add New Book
            </h2>

            {[
                { label: 'Title', value: title, setter: setTitle, placeholder: 'Book title' },
                { label: 'Author', value: author, setter: setAuthor, placeholder: 'Author name' },
                { label: 'Category', value: category, setter: setCategory, placeholder: 'e.g. Computer Science' },
                { label: 'Description', value: description, setter: setDescription, placeholder: 'Short description' },
            ].map(field => (
                <div key={field.label} className="flex flex-col gap-1">
                    <label className="text-white/40 text-xs">{field.label}</label>
                    <input
                        type="text"
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 rounded-lg outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                    />
                </div>
            ))}

            <div className="flex gap-4">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-white/40 text-xs">PDF File</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="bg-white/5 border border-white/10 text-white/50 text-sm px-4 py-3 rounded-lg outline-none cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-white/40 text-xs">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        className="bg-white/5 border border-white/10 text-white/50 text-sm px-4 py-3 rounded-lg outline-none cursor-pointer"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="bg-white text-black font-semibold text-sm py-3 rounded-lg hover:bg-white/90 transition-all cursor-pointer border-none mt-2"
            >
                Add Book
            </button>
        </form>

        {/* Right - Preview */}
        <div className="w-[290px] bg-white/5 border border-white/10 rounded-xl  p-6 flex flex-col items-center sticky top-24 mt-14">
            <p className="text-white/20 text-xs font-bold tracking-widest uppercase mb-6">
                Live Preview
            </p>

            {/* Cover */}
            <div className="w-40 aspect-[3/4] bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                {coverImage ? (
                    <img
                        src={URL.createObjectURL(coverImage)}
                        alt="preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl">📖</span>
                )}
            </div>

            {/* Info */}
            <div className="w-full text-center">
                <h3 className="text-white text-sm font-semibold truncate">
                    {title || 'Book Title'}
                </h3>
                <p className="text-white/40 text-xs mt-1 truncate">
                    {author || 'Author Name'}
                </p>
                {category && (
                    <span className="inline-block mt-2 text-xs text-white/30 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {category}
                    </span>
                )}
            </div>

            {/* Divider */}
            <div className="w-full border-t border-white/5 my-4" />

            {/* File indicators */}
            <div className="w-full flex flex-col gap-2">
                <div className={`flex items-center gap-2 text-xs ${file ? 'text-green-400' : 'text-white/20'}`}>
                    <span>{file ? '✓' : '○'}</span>
                    <span>{file ? file.name : 'No PDF selected'}</span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${coverImage ? 'text-green-400' : 'text-white/20'}`}>
                    <span>{coverImage ? '✓' : '○'}</span>
                    <span>{coverImage ? coverImage.name : 'No cover selected'}</span>
                </div>
            </div>
        </div>

    </div>
)}
                {/* Books List */}
                {activeTab === 'books' && (
                    <div>
                        <h2 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-6">
                            All Books
                        </h2>
                        <div className="flex flex-col gap-3">
                            {books.map(book => (
                                <div key={book._id}
                                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-all">

                                    {/* Cover */}
                                    <div className="w-10 h-14 bg-white/5 rounded-md overflow-hidden shrink-0">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title}
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg">📖</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h3 className="text-white text-sm font-semibold">{book.title}</h3>
                                        <p className="text-white/40 text-xs mt-0.5">{book.author}</p>
                                    </div>

                                    {/* Category */}
                                    <span className="text-white/30 text-xs bg-white/5 px-3 py-1 rounded-full">
                                        {book.category}
                                    </span>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="text-white/20 text-sm hover:text-red-400 transition-all cursor-pointer bg-transparent border-none"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPanel
import { useState, useEffect } from 'react'
import { getAllBooks, addBook, deleteBook } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

const AdminPanel = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('books')
    const [toast, setToast] = useState(null)
    const [confirmId, setConfirmId] = useState(null)

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
            setUploading(true)
            const formData = new FormData()
            formData.append('title', title)
            formData.append('author', author)
            formData.append('description', description)
            formData.append('category', category)
            formData.append('file', file)
            formData.append('coverImage', coverImage)

            await addBook(formData)
            setToast({ message: 'Book added successfully!', type: 'success' })
            fetchBooks()
            setTitle('')
            setAuthor('')
            setDescription('')
            setCategory('')
            setFile(null)
            setCoverImage(null)
            setActiveTab('books')
        } catch (error) {
            setToast({ message: error.response?.data?.message || 'Something went wrong', type: 'error' })
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteBook(id)
            setToast({ message: 'Book deleted!', type: 'success' })
            fetchBooks()
        } catch (error) {
            setToast({ message: 'Delete failed!', type: 'error' })
        } finally {
            setConfirmId(null)
        }
    }

    if (loading) return (
        <div className="min-h-[calc(100vh-56px)] bg-[#1a1d2e] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#1a1d2e] text-white">

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Confirm Dialog */}
            {confirmId && (
                <ConfirmDialog
                    message="Yeh book permanently delete ho jayegi!"
                    onConfirm={() => handleDelete(confirmId)}
                    onCancel={() => setConfirmId(null)}
                />
            )}

            {/* Uploading Overlay */}
            {uploading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                    <div className="bg-[#13151f] border border-white/10 rounded-2xl px-8 md:px-12 py-10 flex flex-col items-center gap-4 mx-4">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                            <div className="absolute inset-0 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="text-white font-semibold text-sm">Uploading Book</p>
                            <p className="text-white/30 text-xs mt-1">Please wait, do not close this page...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="border-b border-white/5 px-4 md:px-10 py-4 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-white font-black text-xl md:text-2xl tracking-tight">
                        Admin Panel
                    </h1>
                    <p className="text-white/30 text-sm mt-1">
                        {books.length} books in library
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white/5 border border-white/10 rounded-lg p-1 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('books')}
                        className={`flex-1 sm:flex-none text-sm px-4 py-2 rounded-md transition-all cursor-pointer border-none ${
                            activeTab === 'books'
                                ? 'bg-white text-black font-semibold'
                                : 'text-white/50 hover:text-white bg-transparent'
                        }`}
                    >
                        All Books
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 sm:flex-none text-sm px-4 py-2 rounded-md transition-all cursor-pointer border-none ${
                            activeTab === 'add'
                                ? 'bg-white text-black font-semibold'
                                : 'text-white/50 hover:text-white bg-transparent'
                        }`}
                    >
                        + Add Book
                    </button>
                </div>
            </div>

            <div className="px-4 md:px-10 py-6 md:py-8">

                {/* Add Book Form */}
                {activeTab === 'add' && (
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

                        {/* Left - Form */}
                        <form onSubmit={handleAddBook} className="w-full lg:max-w-lg flex flex-col gap-4">
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

                            <div className="flex flex-col sm:flex-row gap-4">
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
                                        accept="image/jpeg, image/jpg, image/png, image/webp"
                                        onChange={(e) => setCoverImage(e.target.files[0])}
                                        className="bg-white/5 border border-white/10 text-white/50 text-sm px-4 py-3 rounded-lg outline-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full font-semibold text-sm py-3 rounded-lg transition-all border-none mt-2 flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 cursor-pointer"
                            >
                                Add Book
                            </button>
                        </form>

                        {/* Right - Preview — Desktop only */}
                        <div className="hidden lg:flex w-[290px] bg-white/5 border border-white/10 rounded-xl p-6 flex-col items-center sticky top-24">
                            <p className="text-white/20 text-xs font-bold tracking-widest uppercase mb-6">
                                Live Preview
                            </p>

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

                            <div className="w-full border-t border-white/5 my-4" />

                            <div className="w-full flex flex-col gap-2">
                                <div className={`flex items-center gap-2 text-xs ${file ? 'text-green-400' : 'text-white/20'}`}>
                                    <span>{file ? '✓' : '○'}</span>
                                    <span className="truncate">{file ? file.name : 'No PDF selected'}</span>
                                </div>
                                <div className={`flex items-center gap-2 text-xs ${coverImage ? 'text-green-400' : 'text-white/20'}`}>
                                    <span>{coverImage ? '✓' : '○'}</span>
                                    <span className="truncate">{coverImage ? coverImage.name : 'No cover selected'}</span>
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
                                    className="flex items-center gap-3 md:gap-4 bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-3 hover:border-white/20 transition-all">

                                    <div className="w-8 md:w-10 h-12 md:h-14 bg-white/5 rounded-md overflow-hidden shrink-0">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title}
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg">📖</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white text-sm font-semibold truncate">{book.title}</h3>
                                        <p className="text-white/40 text-xs mt-0.5 truncate">{book.author}</p>
                                    </div>

                                    <span className="hidden sm:block text-white/30 text-xs bg-white/5 px-3 py-1 rounded-full shrink-0">
                                        {book.category}
                                    </span>

                                    <button
                                        onClick={() => setConfirmId(book._id)}
                                        className="text-white/20 text-sm hover:text-red-400 transition-all cursor-pointer bg-transparent border-none shrink-0"
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
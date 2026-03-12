const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const Book = require('./models/Book')
const User = require('./models/User')

const books = [
    {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        description: 'A romantic novel following the character development of Elizabeth Bennet.',
        category: 'Romance Novel',
        fileUrl: 'https://www.gutenberg.org/files/1342/1342-h/1342-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    },
    {
        title: 'Dracula',
        author: 'Bram Stoker',
        description: 'The classic vampire novel that introduced Count Dracula to the world.',
        category: 'Horror Fiction',
        fileUrl: 'https://www.gutenberg.org/files/345/345-h/345-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    },
    {
        title: 'Frankenstein',
        author: 'Mary Shelley',
        description: 'The story of Victor Frankenstein who creates a sapient creature in an unorthodox experiment.',
        category: 'Science Fiction',
        fileUrl: 'https://www.gutenberg.org/files/84/84-h/84-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8230902-L.jpg',
    },
    {
        title: 'The Adventures of Sherlock Holmes',
        author: 'Arthur Conan Doyle',
        description: 'Twelve stories featuring the famous detective Sherlock Holmes.',
        category: 'Mystery',
        fileUrl: 'https://www.gutenberg.org/files/1661/1661-h/1661-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
    },
    {
        title: 'Alice in Wonderland',
        author: 'Lewis Carroll',
        description: 'Alice falls through a rabbit hole into a fantasy world populated by peculiar creatures.',
        category: 'Fantasy',
        fileUrl: 'https://www.gutenberg.org/files/11/11-h/11-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8739175-L.jpg',
    },
    {
        title: 'Moby Dick',
        author: 'Herman Melville',
        description: 'The saga of Captain Ahab and his obsessive quest to slay the white whale Moby Dick.',
        category: 'Novel',
        fileUrl: 'https://www.gutenberg.org/files/2701/2701-h/2701-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8228680-L.jpg',
    },
    {
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        description: 'A philosophical novel about a young man who sells his soul for eternal youth and beauty.',
        category: 'Fiction',
        fileUrl: 'https://www.gutenberg.org/files/174/174-h/174-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8406782-L.jpg',
    },
    {
        title: 'The Metamorphosis',
        author: 'Franz Kafka',
        description: 'Gregor Samsa wakes one morning to find himself transformed into a giant insect.',
        category: 'Fiction',
        fileUrl: 'https://www.gutenberg.org/files/5200/5200-h/5200-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8739168-L.jpg',
    },
    {
        title: 'A Tale of Two Cities',
        author: 'Charles Dickens',
        description: 'Set in London and Paris before and during the French Revolution.',
        category: 'Novel',
        fileUrl: 'https://www.gutenberg.org/files/98/98-h/98-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8228684-L.jpg',
    },
    {
        title: 'The Count of Monte Cristo',
        author: 'Alexandre Dumas',
        description: 'A story of betrayal, suffering, and revenge set in early 19th-century France.',
        category: 'Novel',
        fileUrl: 'https://www.gutenberg.org/files/1184/1184-h/1184-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8406790-L.jpg',
    },
    {
        title: 'Treasure Island',
        author: 'Robert Louis Stevenson',
        description: 'A classic adventure novel about pirates and buried treasure.',
        category: 'Fiction',
        fileUrl: 'https://www.gutenberg.org/files/120/120-h/120-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8228688-L.jpg',
    },
    {
        title: 'The Jungle Book',
        author: 'Rudyard Kipling',
        description: 'Stories about Mowgli, a boy raised by wolves in the Indian jungle.',
        category: 'Fantasy',
        fileUrl: 'https://www.gutenberg.org/files/236/236-h/236-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8739165-L.jpg',
    },
    {
        title: 'Adventures of Huckleberry Finn',
        author: 'Mark Twain',
        description: 'The story of a boy named Huck Finn and his friendship with a runaway slave.',
        category: 'Fiction',
        fileUrl: 'https://www.gutenberg.org/files/76/76-h/76-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8228676-L.jpg',
    },
    {
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        description: 'A sweeping narrative of Russian society during the Napoleonic era.',
        category: 'Novel',
        fileUrl: 'https://www.gutenberg.org/files/2600/2600-h/2600-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8739171-L.jpg',
    },
    {
        title: 'Frankenstein',
        author: 'Mary Shelley',
        description: 'The story of Victor Frankenstein and his monstrous creation.',
        category: 'Horror Fiction',
        fileUrl: 'https://www.gutenberg.org/files/84/84-h/84-h.htm',
        coverImage: 'https://covers.openlibrary.org/b/id/8230902-L.jpg',
    },
]

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected!')

        // Admin user dhundho
        const admin = await User.findOne({ role: 'admin' })
        if (!admin) {
            console.log('❌ Pehle ek admin account banao website pe!')
            process.exit(1)
        }

        // Purani seeded books hata do
        await Book.deleteMany({ uploadedBy: admin._id })
        console.log('Old books cleared!')

        // Nai books add karo
        const booksWithAdmin = books.map(book => ({
            ...book,
            uploadedBy: admin._id
        }))

        await Book.insertMany(booksWithAdmin)
        console.log(`✅ ${books.length} books added successfully!`)

        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

seedDB()
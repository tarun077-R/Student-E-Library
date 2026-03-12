const bookModel = require("../models/Book")

const addBook = async (req, res) => {
    try {
     
      const { title, author, description, category } = req.body;
      
      if (!req.files) {
      return res.status(400).json({ message: 'Please upload files' });
    }

     const fileObj = req.files.find(f => f.fieldname === 'file');
        const coverObj = req.files.find(f => f.fieldname === 'coverImage');
    
         const fileUrl = fileObj ? fileObj.path : null;
        const coverImage = coverObj ? coverObj.path : null;
    if (!fileUrl) {
        return res.status(400).json({ message: 'Book file is required' });
    }
    
    const book = await bookModel.create({
      title,
      author,
      description,
      category,
      fileUrl,
      coverImage,
      uploadedBy: req.user._id
    });

    res.status(201).json(book);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Get all books
const getAllBooks = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        const books = await bookModel.find(query).populate('uploadedBy', 'name email');
        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single book
const getBookById = async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id).populate('uploadedBy', 'name email');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update book
const updateBook = async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const updatedBook = await bookModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );

        res.status(200).json(updatedBook);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete book
const deleteBook = async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await bookModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Book deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports={addBook,deleteBook,getAllBooks,getBookById,updateBook}
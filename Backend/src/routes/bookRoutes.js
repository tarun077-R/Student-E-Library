const express = require("express")
const router = express.Router()

const { addBook, getAllBooks, getBookById, updateBook, deleteBook } = require("../controller/bookController");
const {protect,adminOnly} = require("../middleware/authMiddleware")

const upload = require('../middleware/uploadMIddleware')


// Public route
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Admin only routes
router.post('/', protect, adminOnly, upload.any(), addBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router
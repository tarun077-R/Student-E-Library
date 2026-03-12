const express = require("express")
const router = express.Router();
const {saveBook,getShelf} = require("../controller/userController")
const {protect} = require("../middleware/authMiddleware")

router.post('/save/:bookId', protect, saveBook);  // book save/remove
router.get('/shelf', protect, getShelf);           // shelf dekho

module.exports = router;
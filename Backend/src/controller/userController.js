
const userModel = require("../models/User")
const saveBook = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        // Check karo book already shelf mein hai ya nahi
        const alreadySaved = user.savedBooks.includes(req.params.bookId);

        if (alreadySaved) {
            // Agar already hai toh remove karo (toggle)
            user.savedBooks = user.savedBooks.filter(
                id => id.toString() !== req.params.bookId
            );
            await user.save();
            return res.status(200).json({ message: 'Book removed from shelf' });
        }

        // Nahi hai toh add karo
        user.savedBooks.push(req.params.bookId);
        await user.save();

        res.status(200).json({ message: 'Book added to shelf' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get shelf books
const getShelf = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
            .populate('savedBooks');
        // populate = savedBooks mein sirf IDs hain
        // populate se poori book ki details aa jayengi

        res.status(200).json(user.savedBooks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {saveBook,getShelf}
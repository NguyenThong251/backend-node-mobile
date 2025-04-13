import express from "express";
import cloudinary from "../lib/cloundinary.js";
import Book from "../models/Book.js";
import protectedRoute from "../middlewave/auth.middlewave.js";

const router = express.Router();

//create
router.post("/", protectedRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;
    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    // upload the image to cloudinary
    const uploadReponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadReponse.secure_url;
    const newBook = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });
    await newBook.save();
    res.status(200).json(newBook);

    // save to the database
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//get all books
router.get("/", protectedRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImages");

    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//  delete
router.delete("/:id", protectedRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    if (book.user.toString() !== req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    // delete the image from cloudinary
    if (book.image && image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        return res.status(500).json({ msg: error.message });
      }
    }
    await book.deleteOne();
    res.status(200).json({ msg: "Book deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;

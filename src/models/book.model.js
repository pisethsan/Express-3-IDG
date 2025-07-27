import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number,
        required: true
    },
})

bookSchema.plugin(mongoosePaginate)

export const bookModel = mongoose.model('Books', bookSchema)



// // 📚 Books
// export const books = [
//     { id: 1, title: "Atomic Habits", author: "James Clear", publishedYear: 2018 },
//     { id: 2, title: "Clean Code", author: "Robert C. Martin", publishedYear: 2008 },
//     { id: 3, title: "The Pragmatic Programmer", author: "Andrew Hunt", publishedYear: 1999 }
// ];
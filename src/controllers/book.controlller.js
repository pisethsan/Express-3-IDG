import { bookModel } from "../models/book.model.js";

export const getAllBook = async (req, res) => {
    let filterBooks = await bookModel.find();
        if (req.query.role) {
            filterBooks = books.filter((t) => {
                return t.role == req.query.role
            })
        }
        let author = req.query.author
        if (author) {
            filterBooks = filterBooks.filter((b) => {
                return b.author == author
            })
        }
        
        let minPubYear = parseInt(req.query.minPubYear)
        let maxPubYear = parseInt(req.query.maxPubYear)
    
        if (minPubYear > maxPubYear) {
            maxPubYear = minPubYear
        }
    
        if (req.query.minPubYear) {
            filterBooks = filterBooks.filter((b) => {
                return b.publishedYear >= minPubYear
            })
        }
        if (req.query.maxPubYear) {
            filterBooks = filterBooks.filter((b) => {
                return b.publishedYear <= maxPubYear
            })
        }
        return res.json(filterBooks)
}

export const getBookById = async (req, res) => {
    const id = req.params.id;
    const book = books.find((b) => {
        return b.id == id
    })
    if (!book) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(book)
}

export const deleteBookById =async (req, res) => {
    const bookId = req.params.id
    const deleteIndex =await bookModel.findIndex((b) => {
        return b.id == bookId
    })
    if (deleteIndex == -1) {
        return res.json("Book not found");
    }
    books.splice(deleteIndex, 1)
    return res.json({ message: `Book with Id ${bookId} deleted` })
}

export const updateBookById = async (req, res) => {
    const bookId = req.params.id
    const bookIndex = await bookModel.findIndex((b) => {
        return bookId == b.id
    })
    if (bookIndex == -1) {
        return res.json("Book not found");
    }
    books[bookIndex] = { id: bookId, ...req.body }
    return res.json({ message: `Book with id ${bookId} updated!` })
}

export const createBook = async (req, res) => {
    const user = new bookModel(req.body)
    await user.save()
    return res.status(201).json(user)
}

// export const getAllBook = (req, res) => {
//     let filterBooks = books
//         if (req.query.role) {
//             filterBooks = books.filter((t) => {
//                 return t.role == req.query.role
//             })
//         }
//         let author = req.query.author
//         if (author) {
//             filterBooks = filterBooks.filter((b) => {
//                 return b.author == author
//             })
//         }
        
//         let minPubYear = parseInt(req.query.minPubYear)
//         let maxPubYear = parseInt(req.query.maxPubYear)
    
//         if (minPubYear > maxPubYear) {
//             maxPubYear = minPubYear
//         }
    
//         if (req.query.minPubYear) {
//             filterBooks = filterBooks.filter((b) => {
//                 return b.publishedYear >= minPubYear
//             })
//         }
//         if (req.query.maxPubYear) {
//             filterBooks = filterBooks.filter((b) => {
//                 return b.publishedYear <= maxPubYear
//             })
//         }
//         return res.json(filterBooks)
// }

// export const getBookById = (req, res) => {
//     const id = req.params.id;
//     const book = books.find((b) => {
//         return b.id == id
//     })
//     if (!book) {
//         return res.json({ messsge: "Not Found" })
//     }
//     return res.json(book)
// }

// export const deleteBookById = (req, res) => {
//     const bookId = req.params.id
//     const deleteIndex = books.findIndex((b) => {
//         return b.id == bookId
//     })
//     if (deleteIndex == -1) {
//         return res.json("Book not found");
//     }
//     books.splice(deleteIndex, 1)
//     return res.json({ message: `Book with Id ${bookId} deleted` })
// }

// export const updateBookById = (req, res) => {
//     const bookId = req.params.id
//     const bookIndex = books.findIndex((b) => {
//         return bookId == b.id
//     })
//     if (bookIndex == -1) {
//         return res.json("Book not found");
//     }
//     books[bookIndex] = { id: bookId, ...req.body }
//     return res.json({ message: `Book with id ${bookId} updated!` })
// }

// export const createBook = (req, res) => {
//     const id = req.body.id
//     const existIndex = books.findIndex((b) => {
//         return b.id == id
//     })
//     console.log(existIndex)
//     if (existIndex != -1) {
//         return res.status(400).json({ message: "Book exists" })
//     }
//     books.push(req.body)
//     return res.status(201).json({ message: `Book with name: ${req.body.name} created` })
// }
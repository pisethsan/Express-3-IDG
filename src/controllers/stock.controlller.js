import { stockModel } from "../models/stock.model.js";
import asyncHandler from 'express-async-handler'


/**
 * /api/stock?maxQuantity=20&minQuantity=10
 */


export const getAllStock = asyncHandler( async (req, res) => {
    const limit = req.query.limit || 10
    const page = req.query.page || 1
    const populate = req.query.populate || ''
    const options = {
        page,
        limit,
        populate
    };
    let filterStock = await stockModel.paginate({}, options)
    return res.json(filterStock)
})

export const getStockById = asyncHandler (async (req, res) => {
    const id = req.params.id;
    const stock = await stockModel.findById(id).populate('byUser')
    return res.json(stock)
})

export const deleteStockById = asyncHandler( async (req, res) => {
    const id = req.params.id
    const deleted = await stockModel.deleteOne({ _id: id })
    return res.status(204).json({ message: 'deleted', data: deleted })
})

export const updateStockById = asyncHandler (async (req, res) => {
    const userId = req.params.id
    const result =await stockModel.updateOne({ _id: userId }, req.body)
    return res.status(200).json({ message: 'updated', data: result })
})

export const createStock = asyncHandler( async (req, res) => {
    const stock = new stockModel(req.body)
    await stock.save()
    return res.status(201).json(stock)
})

// export const getStockById = (req, res) => {
//     const id = req.params.id;
//     const stock = stock.find((s) => {
//         return s.id == id
//     })
//     if (!stock) {
//         return res.json({ messsge: "Not Found" })
//     }
//     return res.json(stock)
// }

// export const deleteStockById = (req, res) => {
//     const stockId = req.params.id
//     const deleteIndex = stock.findIndex((s) => {
//         return u.id == stockId
//     })
//     if (deleteIndex == -1) {
//         return res.json("stock not found");
//     }
//     stock.splice(deleteIndex, 1)
//     return res.json({ message: `stock with Id ${stockId} deleted` })
// }

// export const updateStockById = (req, res) => {
//     const stockId = req.params.id
//     const stockIndex = stock.findIndex((s) => {
//         return stockId == s.id
//     })
//     if (stockIndex == -1) {
//         return res.json("Stock not found");
//     }
//     stock[stockIndex] = { id: stockId, ...req.body }
//     return res.json({ message: `Stock with id ${stockId} updated!` })
// }

// export const createStock = (req, res) => {
//     const id = req.body.id
//     const existIndex = stock.findIndex((s) => {
//         return s.id == id
//     })
//     console.log(existIndex)
//     if (existIndex != -1) {
//         return res.status(400).json({ message: "Stock exists" })
//     }
//     stock.push(req.body)
//     return res.status(201).json({ message: `Stock with name: ${req.body.name} created` })
// }
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const moneySchema = new mongoose.Schema({
    currency: {
        type: String
    },
    amount: {
        type: Number
    },
    type: {
        type: String
    }
})
moneySchema.plugin(mongoosePaginate)
export const moneyModel = mongoose.model('Money', moneySchema)

// // 💰 Money
// export const money = [
//     { id: 301, currency: "USD", amount: 1000, type: "income" },
//     { id: 302, currency: "EUR", amount: 250, type: "expense" },
//     { id: 303, currency: "KHR", amount: 400000, type: "income" }
// ];
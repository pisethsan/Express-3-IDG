import { moneyModel } from "../models/money.model.js";


export const getAllMoney = async (req, res) => {
    let filterMoney = await moneyModel.find();
            if (req.query.role) {
                filterMoney = money.filter((t) => {
                    return t.role == req.query.role
                })
            }
            let currency = req.query.currency
            if (currency) {
                filterMoney = filterMoney.filter((b) => {
                    return b.currency == currency
                })
            }
            
            let type = req.query.type
            if (type) {
                filterMoney = filterMoney.filter((b) => {
                    return b.type == type
                })
            }
            
            let minAmount = parseInt(req.query.minAmount)
            let maxAmount = parseInt(req.query.maxAmount)
        
            if (minAmount > maxAmount) {
                maxAmount = minAmount
            }
        
            if (req.query.minAmount) {
                filterMoney = filterMoney.filter((b) => {
                    return b.amount >= minAmount
                })
            }
            if (req.query.maxAmount) {
                filterMoney = filterMoney.filter((b) => {
                    return b.amount <= maxAmount
                })
            }
            return res.json(filterMoney)
}

export const getMoneyById = (req, res) => {
    const id = req.params.id;
    const money = money.find((m) => {
        return m.id == id
    })
    if (!money) {
        return res.json({ messsge: "Not Found" })
    }
    return res.json(money)
}

export const deleteMoneyById = (req, res) => {
    const moneyId = req.params.id
    const deleteIndex = money.findIndex((m) => {
        return m.id == moneyId
    })
    if (deleteIndex == -1) {
        return res.json("Money not found");
    }
    money.splice(deleteIndex, 1)
    return res.json({ message: `Money with Id ${moneyId} deleted` })
}

export const updateMoneyById = (req, res) => {
    const moneyId = req.params.id
    const moneyIndex = money.findIndex((m) => {
        return moneyId == m.id
    })
    if (moneyIndex == -1) {
        return res.json("Money not found");
    }
    money[moneyIndex] = { id: userId, ...req.body }
    return res.json({ message: `Money with id ${moneyId} updated!` })
}

// export const createMoney = (req, res) => {
//     const id = req.body.id
//     const existIndex = money.findIndex((m) => {
//         return m.id == id
//     })
//     console.log(existIndex)
//     if (existIndex != -1) {
//         return res.status(400).json({ message: "Money exists" })
//     }
//     money.push(req.body)
//     return res.status(201).json({ message: `Money with name: ${req.body.name} created` })
// }

export const createMoney = async (req, res) => {
    const money = new moneyModel(req.body)
    await money.save()
    return res.status(201).json(money)
}
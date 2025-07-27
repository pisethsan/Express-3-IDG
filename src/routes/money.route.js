import express from 'express';
import { createMoney, deleteMoneyById, getAllMoney, getMoneyById, updateMoneyById } from '../controllers/money.controlller.js';

const moneyRoute = express.Router();

moneyRoute.get('/', getAllMoney)

moneyRoute.get('/:id', getMoneyById)

moneyRoute.delete('/:id', deleteMoneyById)

moneyRoute.post('/', createMoney)

moneyRoute.patch('/:id', updateMoneyById)

export default moneyRoute;
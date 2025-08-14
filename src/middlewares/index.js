import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { userModel } from '../models/user.model.js';
import redisClient from '../redis/index.js';
import { responseHandler } from 'express-intercept';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis'

export const limiter = (ttl, request) => rateLimit({
    windowMs: ttl, // 1 minute
    max: request, // Limit each IP to 30 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    })
});

//User
export function userMiddleware(req, res, next) {
    if (req.query.minAge) {
        const minAge = parseInt(req.query.minAge)
        if (isNaN(minAge)) {
            return res.status(400).json({ message: "minAge must be integer" });
        }
    }
    if (req.query.maxAge) {
        const maxAge = parseInt(req.query.maxAge)
        if (isNaN(maxAge)) {
            return res.status(400).json({ message: "maxAge must be integer" });
        }
    }
    if (req.query.role) {
        const role = req.query.role
        if (role.trim() === '' || isFinite(role)) {
            return res.status(400).json({ message: "role must be string" });
        }
    }
    next();
};

//teacher
export function teacherMiddleware(req, res, next) {
    if (req.query.minExp) {
        const minExp = parseInt(req.query.minExp)
        if (isNaN(minExp)) {
            return res.status(400).json({ message: "minYear must be integer" });
        }
    }
    if (req.query.maxExp) {
        const maxExp = parseInt(req.query.maxExp)
        if (isNaN(maxExp)) {
            return res.status(400).json({ message: "maxYear must be integer" });
        }
    }
    if (req.query.subject) {
        const subject = req.query.subject
        if (subject.trim() === '' || isFinite(subject)) {
            return res.status(400).json({ message: "subject must be string" });
        }
    }
    next();
};

//Stock
export function stockMiddleware(req, res, next) {
    const errors = []
    let minQuantity = req.query.minQuantity;
    let maxQuantity = req.query.maxQuantity;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;

    if (minQuantity) {
        minQuantity = parseInt(minQuantity)
        if (isNaN(minQuantity)) {
            errors.push({ error: 'minQuantity' })
        }
    }
    if (maxQuantity) {
        maxQuantity = parseInt(maxQuantity)
        if (isNaN(maxQuantity)) {
            errors.push({ error: 'maxQuantity' })
        }
    }
    if (minPrice) {
        minPrice = parseFloat(minPrice)
        if (isNaN(minPrice)) {
            errors.push({ error: 'minPrice' })
        }
    }
    if (maxPrice) {
        maxPrice = parseFloat(maxPrice)
        if (isNaN(maxPrice)) {
            errors.push({ error: 'maxPrice' })
        }
    }
    if (errors.length > 0) {
        return res.status(400).json(errors)
    }
    next()
};

//EmailUser

export function handleValidation(req, res, next) {
    const result = validationResult(req);
    console.log(result)
    if (!result.isEmpty()) {
        return res.status(400).send({ errors: result.array() });
    }
    next()
}

//handleError
export function handleError(error, req, res, next) {
    return res.status(500).json({ message: error.message })
}


// Authentication middleware
export const authenticate = asyncHandler(async (req, res, next) => {
    // Verify JWT
    // Bearer TOKEN
    if (!req.headers.authorization) {
        return res.status(400).json({ message: "No token provided" })
    }
    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(payload._id)
    req.user = user
    next()
})


// Cache Interceptor
export const CacheInterceptor = (ttl) => responseHandler()
    .for((req) => req.method == 'GET')
    .if((res) => {
        const codes = [200, 201, 202, 203, 204]
        return codes.includes(res.statusCode);
    }).getString(async (body, req, res) => {
        const { originalUrl } = res.req
        await redisClient.set(originalUrl, body, {
            EX: ttl // Cache for ttl seconds
        })
    })

export const cacheMiddleware = asyncHandler(async (req, res, next) => {
    const { originalUrl } = req
    if (req.method == 'GET') {
        const data = await redisClient.get(originalUrl)
        if (data !== null) {
            return res.json(JSON.parse(data))
        }
    }
    next()
})

export const invalidateCache = responseHandler().for(
    (req) => {
        const methods = ['POST', 'PUT', 'DELETE', 'PATCH']
        return methods.includes(req.method);
    }).if((res) => {
        const codes = [201, 204, 203]
        return codes.includes(res.statusCode);
    }).getString(async (body, req, res) => {
        const { baseUrl } = req
        const keys = await redisClient.keys(`${baseUrl}*`)
        for (const key of keys) {
            await redisClient.del(key)
        }
    })
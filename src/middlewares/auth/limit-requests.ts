import { Request, Response, NextFunction } from "express";
import { rateLimitColection } from "../../db/db";

const maxRequests = 5

export const limitRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip ?? 'default'
    console.log('ip', IP)
    const URL = req.url
    console.log('URL', URL)
    const date = new Date();
    try {
        const count = await rateLimitColection.countDocuments({
            IP: IP,
            URL: URL,
            date: { $gte: new Date(Date.now() - 10000) }
        })
        console.log('count', count)

        if (count + 1 > maxRequests) {
            return res.status(429).send('Too many requests!')
        }
        await rateLimitColection.insertOne({ IP: IP, URL: URL, date: date })
    } catch (error) {
        console.error('Error while checking rate limit:', error);
        return res.status(500).send('Internal Server Error');
    }
    return next()
}

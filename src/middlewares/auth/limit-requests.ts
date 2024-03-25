import { Request, Response, NextFunction } from "express";
import { RateLimitModelClass } from "../../domain/schemas/rateLimit.schema";

const maxRequests = 5

export const limitRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip ?? 'default'
    const URL = req.url
    const date = new Date();
    try {
        const count = await RateLimitModelClass.countDocuments({
            IP: IP,
            URL: URL,
            date: { $gte: new Date(Date.now() - 10000) }
        })

        if (count + 1 > maxRequests) {
            return res.status(429).send('Too many requests!')
        }
        await RateLimitModelClass.create({ IP: IP, URL: URL, date: date })
    } catch (error) {
        console.error('Error while checking rate limit:', error);
        return res.status(500).send('Internal Server Error');
    }
    return next()
}

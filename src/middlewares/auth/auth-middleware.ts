import { NextFunction, Request, Response} from "express"
const login = 'admin'
const password = 'qwerty'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

const auth = req.headers['authorization'];
console.log(auth, req.headers)
if (!auth){
    res.sendStatus(401)
    return
}

    const[basic, token] = auth.split(" ");

    console.log("Basic", basic )
    if (basic !== "Basic"){
        res.sendStatus(401)
        return
    }
    

    const decodedData = Buffer.from(token, 'base64').toString()

    const [decodedLogin, decodedPassword] = decodedData.split(":")

    if (decodedLogin !== login || decodedPassword !== password){
    res.sendStatus(401)
    return
    }
    
    return next()
}

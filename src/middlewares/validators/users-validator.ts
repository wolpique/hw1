import { body } from "express-validator"
import { inputModelValidation } from "../inputModel/input-model-validation"

const loginValidator = body('login')
.isString()
.trim()
.isLength({min:3, max: 10})
.matches('^[a-zA-Z0-9_-]*$')
.withMessage('Invalid login')

const passwordValidator = body('password')
.isString()
.trim()
.isLength({min:6, max: 20})
.withMessage('Invalid password')



const emailValidator = body('email')
.isString()
.trim()
.matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
.withMessage('Invalid email')



export const usersValidator = () => [loginValidator, passwordValidator, emailValidator, inputModelValidation]

import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import { usersCollection } from "../../db/db";

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 })
    .custom(async (value) => {
        if (/^[a-zA-Z0-9_-]*$/.test(value) || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
            return true
        } else {
            throw new Error('Invalid loginOrEmail')
        }
    })
    .withMessage('Invalid loginOrEmail!')

const passwordValidation = body('password')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 20 })
    .withMessage('Invalid password')


const registrationUserEmailValidation = body('email')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 30 })
    .isEmail()
    .custom(async (email) => {
        const user = await usersCollection.findOne({ 'accountData.email': email })
        if (user) {
            throw new Error('Email already exists')
        }
    })
    .withMessage('Invalid registrationUserEmailValidation!')


const registrationUserLoginValidation = body('login')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 10 })
    .matches('^[a-zA-Z0-9_-]*$')
    .custom(async (login) => {
        const user = await usersCollection.findOne({ 'accountData.login': login })
        console.log(user)
        if (user) {
            throw new Error('Login already exists')
        } else {
            return true

        }
    })
    .withMessage('Invalid LoginValidation!')

const emailValidation = body('email')
    .isString()
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 30 })
    .isEmail()
    .custom(async (isConfirmed) => {
        const user = await usersCollection.findOne({ 'emailConfirmation.isConfirmed': isConfirmed })
        if (isConfirmed === true) {
            throw new Error('Email is already confirmed');
        } else {
            return true
        }
    })
    .withMessage('Invalid emailValidation!')


const codeValidation = body('code')
    .isString()
    .trim()
    .notEmpty()
    // .custom(async (isConfirmed) => {
    //     const user = await usersCollection.findOne({ 'emailConfirmation.isConfirmed': isConfirmed })
    //     if (isConfirmed === true) {
    //         throw new Error('Code is already confirmed');
    //     }
    // })
    .withMessage('Invalid codeValidation!')


export const emailValidationMiddleware = () => [emailValidation, inputModelValidation]

export const codeValidationMiddleware = () => [codeValidation, inputModelValidation]

export const authLoginValidation = () => [loginOrEmailValidation, passwordValidation, inputModelValidation]

export const authRegistrationValidation = () => [passwordValidation, registrationUserEmailValidation, registrationUserLoginValidation, inputModelValidation]

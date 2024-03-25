import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import { UsersModelClass } from "../../domain/schemas/users.schema";

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

const newPasswordValidation = body('newPassword')
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
        const user = await UsersModelClass.findOne({ 'email': email })
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
        const user = await UsersModelClass.findOne({ 'login': login })
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
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .custom(async (email) => {
        // const user = await UsersModelClass.findOne({ 'emailConfirmation.isConfirmed': isConfirmed })
        // if (isConfirmed === true) {
        const user = await UsersModelClass.findOne({ 'email': email });
        if (user && user.emailConfirmation.isConfirmed === true) {
            throw new Error('Email is already confirmed');
        } else {
            return true
        }
    })
    .withMessage('Invalid emailValidation!')


const emailPasswordRecovery = body('email')
    .isString()
    .trim()
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .isEmail()
    .withMessage('Invalid emailValidation!')

const codeValidation = body('code')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Invalid codeValidation!')








export const emailValidationMiddleware = () => [emailValidation, inputModelValidation]

export const emailPasswordValidationMiddleware = () => [emailPasswordRecovery, inputModelValidation]

export const codeValidationMiddleware = () => [codeValidation, inputModelValidation]

export const authLoginValidation = () => [loginOrEmailValidation, passwordValidation, inputModelValidation]

export const passwordValidationMiddleware = () => [passwordValidation, inputModelValidation]

export const newPasswordValidationMiddleware = () => [newPasswordValidation, inputModelValidation]


export const authRegistrationValidation = () => [passwordValidation, registrationUserEmailValidation, registrationUserLoginValidation, inputModelValidation]

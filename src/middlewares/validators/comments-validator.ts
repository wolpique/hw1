import { body } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";

const contentValidation = body('content')
.isString()
.trim()
.isLength({min:20, max:300})
.withMessage('Invalid content!')

export const commentValidator = () => [contentValidation, inputModelValidation]



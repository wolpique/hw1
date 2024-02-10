import { Router, Request, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../models/common/common"
import { UsersRepository } from "../repositories/users-repository"
import { BlogParams } from "../models/blog/input/blog.input.models"
import { ObjectId } from "mongodb"
import { OutputPageUsersType } from "../models/users/output/users.output.query.models";
import { QueryPageUsersInputModel } from "../models/users/input/users.input.query.models";
import { OutputUsersType } from "../models/users/output/users.output.model";
import { usersValidator } from "../middlewares/validators/users-validator";
import { authMiddleware } from "../middlewares/auth/auth-middleware";
import bcrypt from 'bcrypt'
import { randomUUID } from "crypto";


export const usersRoute = Router({})

usersRoute.get('/', authMiddleware, async (req: RequestWithQuery<QueryPageUsersInputModel>, res: Response<OutputPageUsersType>) => {
    const sortData = {
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm
    }

    const users = await UsersRepository.getAllUsers(sortData)

    return res.send(users)
})


usersRoute.post('/', authMiddleware, usersValidator(), async (req: RequestWithBody<{ login: string, password: string, email: string }>, res: Response<OutputUsersType>) => {
    let { login, password, email } = req.body

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = {
        _id: new ObjectId(),
        accountData: {
            login,
            password: passwordHash,
            email,
            createdAt: new Date().toISOString()
        },
        emailConfirmation: {
            isConfirmed: true,
            code: randomUUID(),
            expirationDate: new Date()
        },
        rToken: {
            refreshToken: randomUUID()
        }
    }


    const createUser = await UsersRepository.addNewUsers(newUser)

    return res.status(201).send(createUser)

})
usersRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = req.params.id

    if (!ObjectId.isValid(id)) {
        return res.sendStatus(404)
    }

    const isDeleted = await UsersRepository.deleteUserById(id)

    if (!isDeleted) {
        return res.sendStatus(404)
    }
    return res.sendStatus(204)


})


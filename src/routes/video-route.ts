import { Request, Response, Router } from "express";
import {RequestWithParams, RequestWithBody, RequestWithBodyAndParams, ErrorType} from "../types/common"
import { AvailableResolutions, VideoType } from "../types/video/output";
import { CreateVideoDto, UpdateVideoDto } from "../types/video/input";
import { db } from "../db/db";
export const videoRoutes = Router({})

videoRoutes.get('/videos', (req:Request, res:Response) => {
    res.send(db.videos)
})

type Params = {
    id: string
}
videoRoutes.get('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id

    const video: VideoType | undefined = db.videos.find((v: VideoType): boolean => v.id === id)
    if (!video){
        res.sendStatus(404)
        return
    }
    res.send(video)
})




videoRoutes.post('/videos', (req:RequestWithBody<CreateVideoDto>, res:Response) => {
    let error: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions} = req.body
    if (title === null || title === undefined || (typeof title === 'string' && title.trim().length < 1) || title.trim().length > 40) {
        error.errorsMessages.push({ message: "Invalid title", field: "title" })
    }
    if (!author || author.trim().length < 1 || author.trim().length > 20){
        error.errorsMessages.push({message: "Invalid author", field: "author"})
    }
    if (Array.isArray(availableResolutions)){
        availableResolutions.map((r) => {
            !AvailableResolutions.includes(r) && error.errorsMessages.push({
                message: "Invalid author", 
                field: "availableResolutions"
            })
        })

    }else{
        availableResolutions = []
    }
    if (error.errorsMessages.length){
        res.status(400).send(error)
        return
    }
    
    const createdAt :Date = new Date()
    const publicationDate :Date = new Date()

    publicationDate.setDate(createdAt.getDate() + 1)

    const newVideo = {
        id: +(new Date()),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions

    }
    db.videos.push(newVideo)
    res.status(201).send(newVideo)
})


videoRoutes.put('/videos/:id', (req:RequestWithBodyAndParams<Params, UpdateVideoDto>, res: Response) =>{
    const id = +req.params.id

    let error: ErrorType = {
        errorsMessages: []
    }

    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
        if (title === null || title === undefined || (typeof title === 'string' && title.trim().length < 1) || title.trim().length > 40) {
            error.errorsMessages.push({ message: "Invalid title", field: "title" })
        }
        if (!author || author.trim().length < 1 || author.trim().length > 20){
            error.errorsMessages.push({message: "Invalid author", field: "author"})
        }
        if (Array.isArray(availableResolutions)){
            availableResolutions.map((r) => {
                !AvailableResolutions.includes(r) && error.errorsMessages.push({
                    message: "Invalid author", 
                    field: "availableResolutions"
                })
            })

        }else{
            availableResolutions = []
        }
        if (typeof canBeDownloaded !== "boolean"){
            canBeDownloaded = false
            error.errorsMessages.push({message: "Invalid canBeDownloaded", field: "canBeDownloaded"})
        }
        if (typeof publicationDate !== "string"){
            error.errorsMessages.push({message: "Invalid publicationDate", field: "publicationDate"})
        }

        if (typeof minAgeRestriction !== "undefined" && typeof minAgeRestriction == "number") {
            minAgeRestriction < 1 || minAgeRestriction > 18 && error.errorsMessages.push({message: "Invalid minAgRestriction", field: "minAgeRestriction"}) 
        }else{
            minAgeRestriction = null
        } 

        if (error.errorsMessages.length){
            res.status(400).send(error)
            return
        }
        const videoIndex = db.videos.findIndex(v => v.id === id)
        const video = db.videos.find(v => v.id === id)

        if (!video){
            res.sendStatus(404)
            return;
        }
        const updatedItem = {
            ...video,
            canBeDownloaded,
            minAgeRestriction,
            title,
            author,
            availableResolutions,
            publicationDate: publicationDate ? publicationDate : video.publicationDate
        }

        db.videos.splice(videoIndex, 1, updatedItem)

        res.sendStatus(204)

        
})

videoRoutes.delete('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id
    const videoIndex = db.videos.findIndex(v => v.id === id)
    if (videoIndex === -1) {
        res.sendStatus(404)
        return;
    } 
    const deletedItem = db.videos.splice(videoIndex, 1)[0]
    res.sendStatus(204).send(deletedItem)

})

videoRoutes.delete('/testing/all-data', (req: RequestWithParams<Params>, res: Response) => {
    db.videos.length = 0;
    res.sendStatus(204);
})
import express, {Request, Response} from "express";
export const app = express()

app.use(express.json())


type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>

type CreateVideoDto = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

type ErrorType = {
    errorsMessages: ErrorMessageType[]
}

type ErrorMessageType = {
    field: string
    message: string
}

const AvailableResolutions = [ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]


type VideoType = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: number | null
    createdAt: string
    publicationDate: string
    availableResolutions: typeof AvailableResolutions
}
const videos: VideoType[] = [
    {
        id: 1,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-12-08T09:28:28.412Z",
        publicationDate: "2023-12-08T09:28:28.412Z",
        availableResolutions: [
          "P144"
        ]

    }
]

app.get('/videos', (req:Request, res:Response) => {
    res.send(videos)
})

type Params = {
    id: string
}


app.get('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id

    const video: VideoType | undefined = videos.find((v: VideoType): boolean => v.id === id)
    if (!video){
        res.sendStatus(404)
        return
    }
    res.send(video)
})




app.post('/videos', (req:RequestWithBody<CreateVideoDto>, res:Response) => {
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
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

type UpdateVideoDto = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string
      
}

app.put('/videos/:id', (req:RequestWithBodyAndParams<Params, UpdateVideoDto>, res: Response) =>{
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
        if (typeof canBeDownloaded === "undefined"){
            canBeDownloaded = false
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
        const videoIndex = videos.findIndex(v => v.id === id)
        const video = videos.find(v => v.id === id)

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

        videos.splice(videoIndex, 1, updatedItem)

        res.sendStatus(204)

        
})

app.delete('/videos/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = +req.params.id
    const videoIndex = videos.findIndex(v => v.id === id)
    if (videoIndex === -1) {
        res.sendStatus(404)
        return;
    } 
    const deletedItem = videos.splice(videoIndex, 1)[0]
    res.sendStatus(204).send(deletedItem)

})

app.delete('/testing/all-data', (req: RequestWithParams<Params>, res: Response) => {
    videos.length = 0;
    res.sendStatus(204);
})
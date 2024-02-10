export type CommentsParams = {
    id: string
}

export type CommentsBody = {
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}
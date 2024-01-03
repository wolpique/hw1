export type BlogParams = {
    id: string
}

export type BlogBody = {
    name: string,
    description: string,
    websiteUrl: string,
    isMembership: boolean,
    createdAt: string
}
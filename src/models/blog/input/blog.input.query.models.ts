export type QueryBlogInputModel = {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}

export type QueryPostByBlogIdInputModel = {
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}
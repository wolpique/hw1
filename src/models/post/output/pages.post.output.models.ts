import { OutputPostType } from "./post.output.models";

export type OutputPagePostType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: OutputPostType[];
};
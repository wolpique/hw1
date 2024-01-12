import { OutputBlogType } from "./blog.output.models";

export type OutputPageBlogType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: OutputBlogType[];
};
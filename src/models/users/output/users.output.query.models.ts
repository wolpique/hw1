import { OutputUsersType } from "./users.output.model";

export type OutputPageUsersType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: OutputUsersType[];
};
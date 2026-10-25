import { ObjectId } from "mongodb";

export type NewsLetter = {
    _id?: ObjectId;
    title: string;
    path: string;
    pathImage?: string;
    publishedAt?: number;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
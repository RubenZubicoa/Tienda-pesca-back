import { ObjectId } from "mongodb";

export type Category = {
    _id?: ObjectId;
    name: string;
    description?: string;
    parentId?: string;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
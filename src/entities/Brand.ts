import { ObjectId } from "mongodb";

export type Brand = {
    _id?: ObjectId;
    name: string;
    description?: string;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
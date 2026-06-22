import { ObjectId } from "mongodb";

export type Brand = {
    _id?: ObjectId;
    name: string;
    description?: string;
    logo?: string;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
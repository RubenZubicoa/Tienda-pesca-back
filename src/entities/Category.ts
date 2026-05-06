import { ObjectId } from "mongodb";

export type Category = {
    _id?: ObjectId;
    label: string;
    description?: string;
    children?: Category[];
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
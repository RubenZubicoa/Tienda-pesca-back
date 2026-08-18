import { ObjectId } from "mongodb";

export type Category = {
    _id?: ObjectId;
    label: string;
    description?: string;
    image?: string;
    children?: Category[];
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
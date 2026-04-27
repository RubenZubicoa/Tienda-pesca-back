import { ObjectId } from "mongodb";
import { Brand } from "./Brand";

export type Product = {
    _id?: ObjectId;
    brandId: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    images: string[];
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
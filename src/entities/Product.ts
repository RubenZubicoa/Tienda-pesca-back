import { ObjectId } from "mongodb";

type ProductOption = {
    label: string;
    options: {
        id: string;
        label: string;
    }[];
};

export type Product = {
    _id?: ObjectId;
    brandId: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    images: string[];
    options?: ProductOption;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export type ProductWithQuantity = Product & {
    quantity: number;
}
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
    professionalPrice?: number;
    stock: number;
    categoryId: string;
    images: string[];
    options?: ProductOption;
    isFeatured?: boolean;
    isInOffer?: boolean;
    offerPrice?: number;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export type ProductWithQuantity = Product & {
    quantity: number;
}
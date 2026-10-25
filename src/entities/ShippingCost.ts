import { ObjectId } from "mongodb";

export type ShippingCost = {
    _id?: ObjectId;
    zone: string;
    costList: ShippingCostList[];
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export type ShippingCostList = {
    company: string;
    cost: number;
}
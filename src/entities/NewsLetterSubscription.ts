import { ObjectId } from "mongodb";

export type NewsLetterSubscription = {
    _id?: ObjectId;
    email: string;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}
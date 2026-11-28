import { ObjectId } from "mongodb";

export type NewsLetter = {
    _id?: ObjectId;
    title: string;
    /** URL pública del documento en S3 (carpeta boletines) */
    path: string;
    pathImage?: string;
    publishedAt?: number;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

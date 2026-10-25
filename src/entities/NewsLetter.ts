import { Binary, ObjectId } from "mongodb";

export type NewsLetter = {
    _id?: ObjectId;
    title: string;
    /** URL pública del documento (endpoint API ahora; S3 más adelante) */
    path: string;
    /** Binario temporal en MongoDB hasta migrar a S3 */
    document?: Binary;
    documentMimeType?: string;
    documentFileName?: string;
    pathImage?: string;
    publishedAt?: number;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

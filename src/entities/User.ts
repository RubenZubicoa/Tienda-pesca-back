import { ObjectId } from "mongodb";

export type User = {
    _id?: ObjectId;
    dni: string;
    name: string;
    lastName: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    role: string;
    isProfessional:boolean;
    createdAt?: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export type AddUser = Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'isDeleted'>;
export type UpdateUser = Omit<User, '_id' | 'password' | 'createdAt' | 'updatedAt' | 'isDeleted'>;
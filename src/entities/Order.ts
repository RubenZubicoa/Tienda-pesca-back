import { ObjectId } from "mongodb";

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'shipped' | 'delivered' | 'returned';

export type OrderFilters = {
    username?: string;
    phone?: string;
    email?: string;
    status?: OrderStatus;
    createdAt?: {
        start?: number;
        end?: number;
    }
}

export type Order = {
    _id?: ObjectId;
    dni: string;
    name: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    products: {uuid: string; productName: string; qty: number; price: number}[];
    status: OrderStatus;
    createdAt: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export type AddOrder = Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateOrder = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;

export function isOrder(obj: unknown): obj is Order {
    return typeof obj === 'object' && obj !== null && '_id' in obj && 'dni' in obj && 'name' in obj && 'lastName' in obj && 'address' in obj && 'phone' in obj && 'email' in obj && 'products' in obj && 'status' in obj;
}

export function isAddOrder(obj: unknown): obj is AddOrder {
    return typeof obj === 'object' && obj !== null && 'dni' in obj && 'name' in obj && 'lastName' in obj && 'address' in obj && 'phone' in obj && 'email' in obj && 'products' in obj;
}
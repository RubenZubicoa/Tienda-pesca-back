import { ObjectId } from "mongodb";
import { ProductWithQuantity } from "./Product";

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
    username: string;
    address: string;
    phone: string;
    email: string;
    products: ProductWithQuantity[];
    status: OrderStatus;
    createdAt: number;
    updatedAt?: number;
    isDeleted?: boolean;
}

export type AddOrder = Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateOrder = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;

export function isOrder(obj: unknown): obj is Order {
    return typeof obj === 'object' && obj !== null && '_id' in obj && 'username' in obj && 'address' in obj && 'phone' in obj && 'email' in obj && 'products' in obj && 'status' in obj;
}
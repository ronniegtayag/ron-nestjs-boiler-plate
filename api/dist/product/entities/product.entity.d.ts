import { Category } from "../../category/entities/category.entity";
export declare class Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
    categoryId: number;
    price: number;
    category: Category;
    createdAt: Date;
}

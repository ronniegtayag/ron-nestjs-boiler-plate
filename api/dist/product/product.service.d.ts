import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly repository;
    constructor(repository: Repository<Product>);
    create(dto: CreateProductDto): Promise<Product>;
    findAll(query: QueryProductDto): Promise<{
        data: Product[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    findOne(id: number): Promise<{
        category: {
            id: number;
            name: string;
        };
        id: number;
        name: string;
        sku: string;
        stock: number;
        categoryId: number;
        price: number;
        createdAt: Date;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        message: string;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}

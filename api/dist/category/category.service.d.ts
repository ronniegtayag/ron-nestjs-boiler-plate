import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Product } from "../product/entities/product.entity";
export declare class CategoryService {
    private readonly repository;
    private readonly productRepository;
    constructor(repository: Repository<Category>, productRepository: Repository<Product>);
    create(dto: CreateCategoryDto): Promise<Category>;
    findAll(query: QueryCategoryDto): Promise<{
        data: Category[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    findOne(id: number): Promise<Category | null>;
    update(id: number, dto: UpdateCategoryDto): Promise<import("typeorm").UpdateResult>;
    delete(id: number): Promise<{
        message: string;
    }>;
}

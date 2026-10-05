import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    findAll(query: QueryProductDto): Promise<{
        data: import("./entities/product.entity").Product[];
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

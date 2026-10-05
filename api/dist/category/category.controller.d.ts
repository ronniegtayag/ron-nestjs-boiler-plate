import { CategoryService } from './category.service';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto): Promise<import("./entities/category.entity").Category>;
    findAll(query: QueryCategoryDto): Promise<{
        data: import("./entities/category.entity").Category[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    findOne(id: number): Promise<import("./entities/category.entity").Category | null>;
    update(id: number, dto: UpdateCategoryDto): Promise<import("typeorm").UpdateResult>;
    delete(id: number): Promise<{
        message: string;
    }>;
}

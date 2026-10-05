import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { Product } from 'src/product/entities/product.entity';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private readonly repository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ) { }

    async create(dto: CreateCategoryDto) {
        const existingCategory = await this.repository.findOne({ where: { name: dto.name } });
        if (existingCategory) {
            throw new ConflictException('Category already exists');
        }

        try {
            const category = this.repository.create({
                name: dto.name,
            });
            return await this.repository.save(category);
        } catch (error) {
            const mysqlError = error as { code?: string; driverError?: { code?: string } };
            if (mysqlError.code === 'ER_DUP_ENTRY' || mysqlError.driverError?.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Category already exists');
            }
            throw error;
        }
    }

    async findAll(query: QueryCategoryDto) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 10, 50);
        const skip = (page - 1) * limit;

        const [data, total] = await this.repository.findAndCount({
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return {
            data,
            meta: { page, limit, total },
        };
    }

    async findOne(id: number) {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: number, dto: UpdateCategoryDto) {
        const category = await this.findOne(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return this.repository.update(id, dto);
    }

    async delete(id: number) {
        const category = await this.findOne(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const inUse = await this.productRepository.findOne({ where: { categoryId: id } });
        if (inUse) {
            throw new ConflictException('Category is in use');
        }

        await this.repository.remove(category);
        return { message: 'Category deleted successfully' };
    }
}

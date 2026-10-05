import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private readonly repository: Repository<Product>) { }

    async create(dto: CreateProductDto) {

        try {
            const product = this.repository.create({
                name: dto.name,
                sku: dto.sku,
                stock: dto.stock,
                categoryId: dto.categoryId,
                price: dto.price,
            });
            return await this.repository.save(product);
        } catch (error) {
            const mysqlError = error as { code?: string; driverError?: { code?: string } };
            if (mysqlError.code === 'ER_DUP_ENTRY' || mysqlError.driverError?.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Product already exists');
            }
            throw error;
        }
    }

    async findAll(query: QueryProductDto) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 10, 50);
        const skip = (page - 1) * limit;


        const qb = this.repository.createQueryBuilder('product')
            .leftJoin('product.category', 'category')
            .addSelect(['category.id', 'category.name'])
            .orderBy('product.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        if (query.search) {
            qb.andWhere(
                '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.sku) LIKE LOWER(:search))',
                { search: `%${query.search}%` },
            );
        }

        if (query.categoryId) {
            qb.andWhere('product.categoryId = :categoryId', { categoryId: query.categoryId });
        }

        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            meta: { page, limit, total },
        };
    }

    async findOne(id: number) {
        const product = await this.repository.findOne({
            where: { id },
            relations: { category: true },
        });
        if (!product) throw new NotFoundException('Product not found');
        return {
            ...product,
            category: { id: product.category.id, name: product.category.name },
        };
    }


    async update(id: number, dto: UpdateProductDto) {
        const product = await this.findOne(id);
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        await this.repository.update(id, dto);
        return { message: 'Product updated successfully' };
    }

    async delete(id: number) {
        const result = await this.repository.delete(id);
        if (!result.affected) {
            throw new NotFoundException('Product not found');
        }
        return { message: 'Product deleted successfully' };
    }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const typeorm_2 = require("typeorm");
let ProductService = class ProductService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            const product = this.repository.create({
                name: dto.name,
                sku: dto.sku,
                stock: dto.stock,
                categoryId: dto.categoryId,
                price: dto.price,
            });
            return await this.repository.save(product);
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_DUP_ENTRY' || mysqlError.driverError?.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException('Product already exists');
            }
            throw error;
        }
    }
    async findAll(query) {
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
            qb.andWhere('(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.sku) LIKE LOWER(:search))', { search: `%${query.search}%` });
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
    async findOne(id) {
        const product = await this.repository.findOne({
            where: { id },
            relations: { category: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return {
            ...product,
            category: { id: product.category.id, name: product.category.name },
        };
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.repository.update(id, dto);
        return { message: 'Product updated successfully' };
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException('Product not found');
        }
        return { message: 'Product deleted successfully' };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map
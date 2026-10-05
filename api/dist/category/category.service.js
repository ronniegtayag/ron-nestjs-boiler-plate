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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./entities/category.entity");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../product/entities/product.entity");
let CategoryService = class CategoryService {
    repository;
    productRepository;
    constructor(repository, productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }
    async create(dto) {
        const existingCategory = await this.repository.findOne({ where: { name: dto.name } });
        if (existingCategory) {
            throw new common_1.ConflictException('Category already exists');
        }
        try {
            const category = this.repository.create({
                name: dto.name,
            });
            return await this.repository.save(category);
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_DUP_ENTRY' || mysqlError.driverError?.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException('Category already exists');
            }
            throw error;
        }
    }
    async findAll(query) {
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
    async findOne(id) {
        return this.repository.findOne({ where: { id } });
    }
    async update(id, dto) {
        const category = await this.findOne(id);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.repository.update(id, dto);
    }
    async delete(id) {
        const category = await this.findOne(id);
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const inUse = await this.productRepository.findOne({ where: { categoryId: id } });
        if (inUse) {
            throw new common_1.ConflictException('Category is in use');
        }
        await this.repository.remove(category);
        return { message: 'Category deleted successfully' };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoryService);
//# sourceMappingURL=category.service.js.map
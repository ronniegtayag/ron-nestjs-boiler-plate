import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { Product } from '../product/entities/product.entity';

describe('CategoryService', () => {
  let service: CategoryService;

  const categoryRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const productRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: getRepositoryToken(Category), useValue: categoryRepository },
        { provide: getRepositoryToken(Product), useValue: productRepository },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

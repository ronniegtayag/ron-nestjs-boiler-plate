import { Post, Controller, Get, Query, Param, Put, Body, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Get()
    findAll(@Query() query: QueryCategoryDto) {
        return this.categoryService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.delete(id);
    }
}

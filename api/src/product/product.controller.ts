import { Param, HttpStatus, ParseIntPipe, Body, Controller, Get, Post, Query, Put, Delete, HttpCode } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get()
    findAll(@Query() query: QueryProductDto) {
        return this.productService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.productService.delete(id);
    }
}

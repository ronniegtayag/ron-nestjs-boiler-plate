import { IsNumber, IsString, IsNotEmpty, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    sku!: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    stock!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId!: number;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price!: number;
}
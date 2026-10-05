import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class QueryProductDto {
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 10;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    categoryId?: number;

    @IsOptional()
    @IsString()
    search?: string;
}
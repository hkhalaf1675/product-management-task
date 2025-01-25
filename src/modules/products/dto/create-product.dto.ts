import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @ApiProperty({description: 'Product name', example: 'Product name'})
    name: string;

    @IsOptional()
    @ApiProperty({description: 'Product description', example: 'Product description'})
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({description: 'Product price', example: 100})
    price: number;

    @IsOptional()
    @IsInt()
    @ApiProperty({description: 'Product stock', example: 100})
    stock: number;
}

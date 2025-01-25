import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('api/products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiBody({ type: CreateProductDto })
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async findAll(@Query() query: any) {
    return await this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiBody({ type: CreateProductDto })
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}

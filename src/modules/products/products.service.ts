import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { SuccessResponseDto } from '../../common/dtos/success.response.dto';
import { FailResponseDto } from '../../common/dtos/fail.response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    let newProduct = this.productRepository.create(createProductDto);

    newProduct = await this.productRepository.save(newProduct);

    return new SuccessResponseDto(
      'Product has added succeffully',
      { product: newProduct },
      201
    );
  }

  async findAll(query: any) {
    let { page, perPage, name, minPrice, maxPrice, minStock, maxStock } = query;

    let productQuery = this.productRepository.createQueryBuilder('product');

    if(name){
      productQuery.where(
        'product.name LIKE :name OR product.description LIKE :name',
        { name: `%${name}%`}
      );
    }

    if(minPrice && maxPrice){
      productQuery.andWhere(
        'product.price BETWEEN :minPrice AND :maxPrice',
        { minPrice, maxPrice }
      );
    }
    else if(minPrice){
      productQuery.andWhere(
        'product.price >= :minPrice',
        { minPrice }
      );
    }
    else if(maxPrice){
      productQuery.andWhere(
        'product.price <= :maxPrice',
        { maxPrice }
      );
    }

    if(minStock && maxStock){
      productQuery.andWhere(
        'product.stock BETWEEN :minStock AND :maxStock',
        { minStock, maxStock }
      );
    }
    else if(minStock){
      productQuery.andWhere(
        'product.stock >= :minStock',
        { minStock }
      );
    }
    else if(maxStock){
      productQuery.andWhere(
        'product.stock <= :maxStock',
        { maxStock }
      );
    }

    productQuery.orderBy('product.id', 'DESC');

    page = page ? +page : 1;
    perPage = perPage ? +perPage : 10;

    productQuery.skip((page -1) * perPage).take(perPage);

    const [data, total] = await productQuery.getManyAndCount();

    return new SuccessResponseDto(
      '',
      { 
        pageInfo: {
          totalItems: total,
          totalPages: Math.ceil(total / perPage),
          currentPage: page
        },
        products: data
      },
      200
    );
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({id});

    if(!product){
      throw new NotFoundException(new FailResponseDto(
        ['The product is not found!'],
        'Validation Error!',
        404
      ));
    }

    return new SuccessResponseDto(
      '',
      { product },
      200
    );
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({id});

    if(!product){
      throw new NotFoundException(new FailResponseDto(
        ['The product is not found!'],
        'Validation Error!',
        404
      ));
    }

    await this.productRepository.update({id}, updateProductDto);

    return new SuccessResponseDto(
      'Product has been updated successfully',
      null,
      200
    );
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneBy({id});

    if(!product){
      throw new NotFoundException(new FailResponseDto(
        ['The product is not found!'],
        'Validation Error!',
        404
      ));
    }

    await this.productRepository.remove(product);

    return new SuccessResponseDto(
      'Product has been deleted successfully',
      null,
      200
    );
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SuccessResponseDto } from '../../common/dtos/success.response.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product and return success response', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const savedProduct = {
        id: 1,
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(productRepository, 'create').mockReturnValue(savedProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValue(savedProduct);

      const result = await service.create(createProductDto);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.message).toBe('Product has added succeffully');
      expect(result.data.product).toEqual(savedProduct);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(savedProduct);
    });
  });

  describe('update', () => {
    it('should update a product if it exists', async () => {
      const productId = 1;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
      };

      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 10,
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(productRepository, 'update').mockResolvedValue(undefined);

      const result = await service.update(productId, updateProductDto);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.message).toBe('Product has been updated successfully');
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
      expect(productRepository.update).toHaveBeenCalledWith({ id: productId }, updateProductDto);
    });

    it('should throw NotFoundException if the product does not exist', async () => {
      const productId = 999;
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 200,
      };

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(productId, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product if it exists', async () => {
      const productId = 1;
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 10,
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);
      jest.spyOn(productRepository, 'remove').mockResolvedValue(mockProduct);

      const result = await service.remove(productId);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.message).toBe('Product has been deleted successfully');
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
      expect(productRepository.remove).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw NotFoundException if the product does not exist', async () => {
      const productId = 999;

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(productId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a product if it exists', async () => {
      const productId = 1;
      const mockProduct = {
        id: productId,
        name: 'Test Product',
        price: 100,
        stock: 10,
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(mockProduct);

      const result = await service.findOne(productId);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data.product).toEqual(mockProduct);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
    });

    it('should throw NotFoundException if the product does not exist', async () => {
      const productId = 999;

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(productId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return a list of products with pagination and filtering', async () => {
      const query = {
        page: 1,
        perPage: 10,
        name: 'Test',
        minPrice: 50,
        maxPrice: 200,
        minStock: 5,
        maxStock: 20,
      };

      const mockProducts = [
        { id: 1, name: 'Test Product 1', price: 100, stock: 10, description: 'Test Description 1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Test Product 2', price: 150, stock: 15, description: 'Test Description 2', createdAt: new Date(), updatedAt: new Date() },
      ];

      const mockTotal = 2;

      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockProducts, mockTotal]),
      } as any);
      
      const result = await service.findAll(query);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.data.pageInfo.totalItems).toBe(mockTotal);
      expect(result.data.pageInfo.totalPages).toBe(1);
      expect(result.data.pageInfo.currentPage).toBe(1);
      expect(result.data.products).toEqual(mockProducts);
    });
  });
});
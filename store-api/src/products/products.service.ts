import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as uuidValidate } from 'uuid'
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find()
  }

  async findOne(idOrSlug: string) {
    console.log('idOrSlug ??', idOrSlug)
    const where = uuidValidate(idOrSlug)
      ? { id: idOrSlug }
      : { slug: idOrSlug };
    const product = await this.productRepository.findOne(where);
    if (!product) {
      throw new EntityNotFoundError(Product, idOrSlug);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updateResult = await this.productRepository.update(id, updateProductDto);
    if (!updateResult.affected) {
      throw new EntityNotFoundError(Product, id);
    }
    return this.productRepository.findOne(id);
  }

  @HttpCode(204)
  async remove(id: string) {
    const deleteResult = await this.productRepository.delete(id);
    if (!deleteResult.affected) {
      throw new EntityNotFoundError(Product, id);
    }
  }
}

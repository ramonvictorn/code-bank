import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository : Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    const products = await this.productRepository.find({
      where: {
        id: In(order.items.map((item) => item.product_id)),
      },
    });

    order.items.forEach((item) => {
      const product = products.find((prod) => prod.id === item.product_id)
      item.price = product.price;
    });

    return this.orderRepository.save(order)
  }

  findAll() {
    return this.orderRepository.find();
  }

  async findOne(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      throw new EntityNotFoundError(Order, orderId);
    }
  
    return order;
  }
}

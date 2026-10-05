import { Category } from 'src/category/entities/category.entity';
import { CreateDateColumn, Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'


@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    sku!: string;

    @Column({ type: 'int' })
    stock!: number;

    @Column()
    categoryId!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @ManyToOne(() => Category, { nullable: false })
    @JoinColumn({ name: 'categoryId' })
    category!: Category;

    @CreateDateColumn()
    createdAt!: Date;
}
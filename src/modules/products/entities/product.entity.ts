import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'Products'
})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column({
        type: 'float'
    })
    price: number;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

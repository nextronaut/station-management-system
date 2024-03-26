import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Company } from '../company/company.entity';

@Entity()
export class Station {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    companyId: number;

    @ApiProperty()
    @Column({ type: "double precision" })
    latitude: number;

    @ApiProperty()
    @Column({ type: "double precision" })
    longitude: number;

    @ManyToOne(() => Company, (company) => company.stations)
    @JoinColumn({ name: 'companyId'})
    company: Company;

    @Column({ nullable: true })
    address?: string
}

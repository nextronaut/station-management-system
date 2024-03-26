import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Station } from '../station/station.entity'

@Entity()
export class Company {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ nullable: true })
    parentCompanyId: number;

    @ApiProperty({ type: () => Company })
    @ManyToOne(() => Company, (company) => company.children)
    @JoinColumn({ name: "parentCompanyId" })
    parent: Company;

    @ApiProperty({ type: () => [Company] })
    @OneToMany(() => Company, (company) => company.parent)
    children: Company[];

    @ApiProperty({ type: () => [Station] })
    @OneToMany(() => Station, (station) => station.company)
    stations: Station[];
}
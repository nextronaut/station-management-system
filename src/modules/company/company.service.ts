import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDTO } from './dto/create-company.dto';
import { UpdateCompanyDTO } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>
    ){}

    async findAll(): Promise<Company[]> {
        try {
            return await this.companyRepository.find({
                relations: ['children.stations', 'stations']
            });
        } catch (error) {
            throw new InternalServerErrorException('Server Error.');
        }
    }

    async findOne(id: number): Promise<Company> {
        try {
            const company = await this.companyRepository.findOne({ 
                where: { id },
                relations: ['children.stations', 'stations']
            });

            if (!company) {
                throw new NotFoundException('Company not found.');
            }

            return company;
        } catch (error) {
            if (error instanceof NotFoundException)
                throw error;

            throw new InternalServerErrorException('Server Error.');
        }
    }

    async create(company: CreateCompanyDTO): Promise<Company> {
        try {
            const exist = await this.companyRepository.findOne({ where: { name: company.name } });
            
            if (exist) {
                throw new ConflictException('Company already exists.')
            }
            
            const newCompany = this.companyRepository.create(company);

            return await this.companyRepository.save(newCompany);
        } catch (error) {
            if (error instanceof ConflictException)
                throw error;

            throw new InternalServerErrorException('Server Error.');
        }
    }

    async update(id: number, updateStationDTO: UpdateCompanyDTO): Promise<UpdateResult> {
        try {
            const company = await this.companyRepository.findOne({ where: { id } });

            if (!company) {
                throw new NotFoundException('Company not found.');
            }
            
            const result = await this.companyRepository.update(id, updateStationDTO);

            return result;
        } catch (error) {
            if (error instanceof NotFoundException)
                throw error;

            throw new InternalServerErrorException('Server Error.')
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        try {
            const company = await this.companyRepository.findOne({ where: { id } });

            if (!company) {
                throw new NotFoundException('Company not found.');
            }
            
            const result = await this.companyRepository.delete(id);

            return result;
        } catch (error) {
            if (error instanceof NotFoundException)
                throw error;

            throw new InternalServerErrorException('Server Error.')
        }
    }
}

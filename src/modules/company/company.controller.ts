import { Controller, Body, Get, Post, Put, Delete, Param } from "@nestjs/common";
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiNoContentResponse } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { CompanyService } from "./company.service";
import { Company } from "./company.entity";
import { CreateCompanyDTO } from "./dto/create-company.dto";
import { UpdateCompanyDTO } from "./dto/update-company.dto";

@ApiTags('api/companies')
@Controller('api/companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    @ApiOkResponse({ description: 'List of all companies' })
    async findAll(): Promise<Company[]> {
        return this.companyService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: 'The company with the given id' })
    @ApiNotFoundResponse({ description: 'Company not found' })
    async findOne(@Param('id') id: number): Promise<Company> {
        return this.companyService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ description: 'Create a new company' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    async create(@Body() createCompanyDTO: CreateCompanyDTO): Promise<Company> {
        return this.companyService.create(createCompanyDTO);
    }

    @Put(':id')
    @ApiOkResponse({ description: 'Updated company' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiNotFoundResponse({ description: 'Company not found' })
    async update(@Param('id') id: number, @Body() updateCompanyDTO: UpdateCompanyDTO): Promise<UpdateResult> {
        return this.companyService.update(id, updateCompanyDTO);
    }

    @Delete(':id')
    @ApiNoContentResponse({ description: 'Company deleted' })
    @ApiNotFoundResponse({ description: 'Company not found' })
    async delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.companyService.delete(id);
    }
}
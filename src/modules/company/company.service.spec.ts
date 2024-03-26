import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { UpdateStationDTO } from '../station/dto/update-station.dto';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

describe('CompanyService', () => {
  let service: CompanyService;
  let mockCompanyRepository: MockType<Repository<Company>>;

  beforeEach(async () => {
    mockCompanyRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const testCompanies: Company[] = [
        new Company(), // Assuming Company is a class. You might need to adjust this.
        new Company(),
      ];
      mockCompanyRepository.find!.mockResolvedValue(testCompanies);

      expect(await service.findAll()).toEqual(testCompanies);
      expect(mockCompanyRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single company if found', async () => {
      const testCompany = new Company();
      mockCompanyRepository.findOne!.mockResolvedValue(testCompany);
  
      const result = await service.findOne(1);
      expect(result).toEqual(testCompany);
    });
  
    it('should return a "Company not found" message if no company is found', async () => {
      mockCompanyRepository.findOne!.mockResolvedValue(null);
  
      const result = await service.findOne(999);
      expect(result).toEqual({ status: 'Company not found.' });
    });
  });

  describe('create', () => {
    it('should successfully create a new company', async () => {
      const testCompanyDTO = { name: 'New Company' };
      const testCompany = new Company();
      mockCompanyRepository.create!.mockReturnValue(testCompany);
      mockCompanyRepository.save!.mockResolvedValue(testCompany);
  
      const result = await service.create(testCompanyDTO);
      expect(result).toEqual(testCompany);
    });
  
    it('should return an error message if the company already exists', async () => {
      const testCompanyDTO = { name: 'Existing Company' };
      mockCompanyRepository.findOne!.mockResolvedValue(new Company());
  
      const result = await service.create(testCompanyDTO);
      expect(result).toEqual({ status: 'Same company already exists.' });
    });
  });

  describe('update', () => {
    it('should update an existing company', async () => {
      mockCompanyRepository.findOne!.mockResolvedValue(new Company());
      mockCompanyRepository.update!.mockResolvedValue({ affected: 1 });
  
      const result = await service.update(1, {} as UpdateStationDTO);
      expect(result).toEqual({ status: 'success' });
    });
  
    it('should return an error message if the company does not exist', async () => {
      mockCompanyRepository.findOne!.mockResolvedValue(null);
  
      const result = await service.update(999, {});
      expect(result).toEqual({ status: 'Company not found.' });
    });
  });

  describe('delete', () => {
    it('should delete an existing company', async () => {
      mockCompanyRepository.findOne!.mockResolvedValue(new Company());
      mockCompanyRepository.delete!.mockResolvedValue({ affected: 1 });
  
      const result = await service.delete(1);
      expect(result).toEqual({ status: 'success' });
    });
  
    it('should return an error message if the company does not exist', async () => {
      mockCompanyRepository.findOne!.mockResolvedValue(null);
  
      const result = await service.delete(999);
      expect(result).toEqual({ status: 'Company not found.' });
    });
  });
});
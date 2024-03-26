import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StationService } from './station.service';
import { Station } from './station.entity';
import { Company } from '../company/company.entity';
import { CreateStationDTO } from './dto/create-station.dto';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<any, any>;
};

const existingStation = new Station();
const nonExistentStationId = 999;

describe('StationService', () => {
  let service: StationService;
  let mockStationRepository: MockType<Repository<Station>>;
  let mockCompanyRepository: MockType<Repository<Company>>;

  beforeEach(async () => {
    mockStationRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        addSelect: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      })),
    };

    mockStationRepository.findOne!.mockImplementation(async (id: number) => {
      if (id === 1) {
        return existingStation;
      } else if (id === nonExistentStationId) {
        return {
          status: "Station not found."
        }
      }
      return null;
    });

    mockStationRepository.delete!.mockImplementation(async (id: number) => {
      if (id === 1) {
        return { affected: 1 };
      } else if (id === nonExistentStationId) {
        return {
          status: "Station not found."
        }
      }
      return null;
    });

    mockCompanyRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StationService,
        {
          provide: getRepositoryToken(Station),
          useValue: mockStationRepository,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<StationService>(StationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a station if found', async () => {
      const testStation = new Station();
      mockStationRepository.findOne!.mockResolvedValue(testStation);
  
      const result = await service.findOne(1);
      expect(result).toEqual(testStation);
    });
  
    it('should return a "Station not found" message if no station is found', async () => {
      mockStationRepository.findOne!.mockResolvedValue(null);
  
      const result = await service.findOne(nonExistentStationId);
      expect(result).toEqual({ status: 'Station not found.' });
    });
  });

  describe('create', () => {
    it('should return an error message if the company ID is invalid', async () => {
      const testStationDTO = { name: 'New Station', companyId: 1 } as CreateStationDTO;
      mockCompanyRepository.findOne!.mockResolvedValue(null);
    
      const result = await service.create(testStationDTO);
      expect(result).toEqual({ status: 'Company Id is invalid.' });
    });
  
    it('should successfully create a new station', async () => {
      const testStationDTO = { name: 'New Station', companyId: 1 } as CreateStationDTO;
      const testStation = new Station();
      mockCompanyRepository.findOne!.mockResolvedValue(new Company());
      mockStationRepository.findOne!.mockResolvedValue(null);
      mockStationRepository.create!.mockReturnValue(testStation);
      mockStationRepository.save!.mockResolvedValue(testStation);
    
      const result = await service.create(testStationDTO);
      expect(result).toEqual(testStation);
    });
  
    it('should return an error message if the station already exists for the company', async () => {
      const testStationDTO = { name: 'Existing Station', companyId: 1 } as CreateStationDTO;
      mockCompanyRepository.findOne!.mockResolvedValue(new Company());
      mockStationRepository.findOne!.mockResolvedValue(new Station());
  
      const result = await service.create(testStationDTO);
      expect(result).toEqual({ status: 'Same station already exists for this company.' });
    });
  });

  describe('update', () => {
    it('should update an existing station', async () => {
      mockStationRepository.findOne!.mockResolvedValue(new Station());
      mockStationRepository.update!.mockResolvedValue({ affected: 1 });
  
      const result = await service.update(1, {} as CreateStationDTO);
      expect(result).toEqual({ status: 'success' });
    });
  
    it('should return an error message if the station does not exist', async () => {
      mockStationRepository.findOne!.mockResolvedValue(null);
  
      const result = await service.update(nonExistentStationId, {} as CreateStationDTO);
      expect(result).toEqual({ status: 'Station not found.' });
    });
  });

  describe('delete', () => {
    it('should delete an existing station', async () => {
      mockStationRepository.findOne!.mockResolvedValue(new Station());
      mockStationRepository.delete!.mockResolvedValue({ affected: 1 });
  
      const result = await service.delete(1);
      expect(result).toEqual({ status: 'success' });
    });
  
    it('should return an error message if the station does not exist', async () => {
      mockStationRepository.findOne!.mockResolvedValue(null);
      mockStationRepository.delete!.mockImplementation(async (id: number) => {
        if (id === nonExistentStationId) {
          return {
            status: 'Station not found.',
          };
        }
        return null;
      });
  
      const result = await service.delete(nonExistentStationId);
      expect(result).toEqual({ status: 'Station not found.' });
    });
  });

  describe('findNearByStations', () => {
    it('should return an array of nearby stations', async () => {
      const testLatitude = 40.7128;
      const testLongitude = -74.006;
      const testRadius = 10;
      const testNearbyStations: Station[] = [
        new Station(),
        new Station(),
      ];
      
      const mockQueryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        setParameters: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(testNearbyStations),
      };
      
      mockStationRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder);
  
      const result = await service.findNearByStations(testLatitude, testLongitude, testRadius);
      expect(result).toEqual(testNearbyStations);
    });
  });
});

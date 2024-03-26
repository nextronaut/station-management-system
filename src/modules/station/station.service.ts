import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Station } from './station.entity';
import { CreateStationDTO } from './dto/create-station.dto';
import { UpdateStationDTO } from './dto/update-station.dto';
import { Company } from '../company/company.entity';

@Injectable()
export class StationService {
    constructor(
        @InjectRepository(Station)
        private readonly stationRepository: Repository<Station>,
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ){}

    async findAll(): Promise<Station[]> {
        try {
            return await this.stationRepository.find({
                relations: ['company']
            });
        } catch (error) {
            throw new InternalServerErrorException('Server Error.')
        }
    }

    async findOne(id: number): Promise<Station> {
        try {
            const station = await this.stationRepository.findOne({ 
                where: { id },
                relations: ['company']
            });

            if (!station) {
                throw new NotFoundException('Station not found.');
            }

            return station;
        } catch (error) {
            if (error instanceof NotFoundException)
                throw error;

            throw new InternalServerErrorException('Server Error.')
        }
    }

    async create(createStationDTO: CreateStationDTO): Promise<Station> {
        try {

            const company = await this.companyRepository.findOne({ where: { id: createStationDTO.companyId }});

            if (!company) {
                throw new NotFoundException('Company Id is invalid.');
            }

            const exist = await this.stationRepository.findOne({ 
                where: { 
                    companyId: createStationDTO.companyId,
                    name: createStationDTO.name 
                }
            })

            if (exist) {
                throw new ConflictException('Same station already exists for this company.')
            }

            const newStation = this.stationRepository.create(createStationDTO);
            
            return await this.stationRepository.save(newStation);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException)
                throw error;

            throw new InternalServerErrorException('Server Error.');
        }
    }

    async update(id: number, updateStationDTO: UpdateStationDTO): Promise<UpdateResult> {
        try {
            const station = await this.stationRepository.findOne({ where: { id } });

            if (station) {
                throw new NotFoundException('Station not found.');
            }

            return await this.stationRepository.update({ id }, updateStationDTO);
        } catch (error) {
            if (error instanceof NotFoundException)
                throw error;

            throw new InternalServerErrorException('Server Error.');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        try {
            const station = await this.stationRepository.findOne({ where: { id } });

            if (station) {
                throw new NotFoundException('Station not found.');
            }

            return await this.stationRepository.delete(id);
        } catch (error) {
            if (error instanceof NotFoundException)
                throw error;

            throw new InternalServerErrorException('Server Error.')
        }
    }

    async findNearByStations(latitude: number, longitude: number, r: number): Promise<Station[]> {
        try {
            const earthRadius = 6371; // The earth's radius in km

            const nearbyStations = await this.stationRepository
                .createQueryBuilder("station")
                .addSelect(`
                    (${earthRadius} * acos(
                        cos(radians(:lat)) *
                        cos(radians(station.latitude)) *
                        cos(radians(station.longitude) - radians(:lng)) +
                        sin(radians(:lat)) *
                        sin(radians(station.latitude))
                    ))`, "distance")
                .setParameters({
                    lat: latitude,
                    lng: longitude,
                })
                .having("distance < :radius", { radius: r })
                .orderBy("distance", "ASC")
                .getMany();
    
            return nearbyStations;
        } catch (error) {
            throw new InternalServerErrorException('Server Error.');
        }
    }
}

export default StationService;
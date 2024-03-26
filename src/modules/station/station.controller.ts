import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiNoContentResponse } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Station } from "./station.entity";
import { StationService } from "./station.service";
import { CreateStationDTO } from "./dto/create-station.dto";
import { UpdateStationDTO } from "./dto/update-station.dto";

@ApiTags('api/stations')
@Controller('api/stations')
export class StationController {
    constructor(private readonly stationService: StationService) {}

    @Get()
    @ApiOkResponse({ description: 'List of all stations' })
    async findAll(): Promise<Station[]> {
        return this.stationService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: 'The station with the given id' })
    @ApiNotFoundResponse({ description: 'Station not found' })
    async findOne(@Param('id') id: number): Promise<Station> {
        return this.stationService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ description: 'The station has been successfully created' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    async create(@Body() createStationDTO: CreateStationDTO): Promise<Station> {
        return this.stationService.create(createStationDTO);
    }

    @Put(':id')
    @ApiOkResponse({ description: 'The station has been successfully updated' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    @ApiNotFoundResponse({ description: 'Station not found' })
    async update(@Param('id') id: number, @Body() updateStationDTO: UpdateStationDTO): Promise<UpdateResult> {
        return this.stationService.update(id, updateStationDTO);
    }

    @Delete(':id')
    @ApiNoContentResponse({ description: 'The station has been successfully deleted' })
    @ApiNotFoundResponse({ description: 'Station not found' })
    async delete (@Param('id') id: number): Promise<DeleteResult> {
        return this.stationService.delete(id)
    }

    @Get('nearby')
    @ApiOkResponse({ description: 'List of nearby stations' })
    async findNearByStations (@Query('lat') lat: number, @Query('lon') lon: number, @Query('r') r: number): Promise<Station[]> {
        return this.stationService.findNearByStations(lat, lon, r)
    }
}
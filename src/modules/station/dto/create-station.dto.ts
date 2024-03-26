import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateStationDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsLatitude()
    @IsNotEmpty()
    readonly latitude: number;

    @ApiProperty()
    @IsLongitude()
    @IsNotEmpty()
    readonly longitude: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly companyId: number;
    
    @ApiProperty({ nullable: true })
    @IsString()
    @IsOptional()
    readonly address?: string;
}
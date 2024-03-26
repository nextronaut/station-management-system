import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsLatitude, IsLongitude, IsOptional, IsNumber } from "class-validator";

export class UpdateStationDTO {
    @ApiProperty({ nullable: true })
    @IsString()
    @IsOptional()
    readonly name: string;

    @ApiProperty({ nullable: true })
    @IsLatitude()
    @IsOptional()
    readonly latitude: number;

    @ApiProperty({ nullable: true })
    @IsLongitude()
    @IsOptional()
    readonly longitude: number;

    @ApiProperty({ nullable: true })
    @IsNumber()
    @IsOptional()
    readonly companyId: number;
    
    @ApiProperty({ nullable: true })
    @IsString()
    @IsOptional()
    readonly address?: string;
}
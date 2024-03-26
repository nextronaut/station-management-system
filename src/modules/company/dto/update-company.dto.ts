import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator";

export class UpdateCompanyDTO {
    @ApiProperty({ nullable: true })
    @IsString()
    @IsOptional()
    readonly name?: string;

    @ApiProperty({ nullable: true })
    @IsNumber()
    @IsOptional()
    readonly parentCompanyId?: number;
}
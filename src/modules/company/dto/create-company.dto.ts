import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateCompanyDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ nullable: true })
    @IsNumber()
    @IsOptional()
    readonly parentCompanyId?: number;
}
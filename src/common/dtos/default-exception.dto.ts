import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DefaultExceptionDto {
  @IsNumber()
  public readonly status: number;

  @IsString()
  @IsNotEmpty()
  public readonly message: string;
}

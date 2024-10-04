import { PartialType } from '@nestjs/mapped-types';
import { CreateZalopayDto } from './create-zalopay.dto';

export class UpdateZalopayDto extends PartialType(CreateZalopayDto) {}

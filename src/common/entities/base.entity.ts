import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {

    @ApiProperty({
        description: 'Unique identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
        type: String,
        format: 'uuid',
        readOnly: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2024-05-05T12:00:00Z',
        type: String,
        format: 'date-time',
        readOnly: true
    })
    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2024-05-05T14:30:00Z',
        type: String,
        format: 'date-time',
        readOnly: true
    })
    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}

import { Module } from '@nestjs/common';
import { ChunkService } from './chunk.service';
import { ChunkController } from './chunk.controller';
import { Chunk } from './entities/chunk.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EmbeddingModule } from '../embedding/embedding.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chunk]), EmbeddingModule],
  controllers: [ChunkController],
  providers: [ChunkService],
})
export class ChunkModule {}

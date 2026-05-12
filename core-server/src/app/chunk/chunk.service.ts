import { Injectable } from '@nestjs/common';
import { CreateChunkDto } from './dto/create-chunk.dto';
import { EmbeddingService } from '../embedding/embedding.service';
import { Chunk } from './entities/chunk.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

export interface ChunkResult {
  content: string;
  distance: number;
}

function toVectorString(vec: number[]): string {
  return `[${vec.join(',')}]`;
}

@Injectable()
export class ChunkService {
  constructor(
    @InjectRepository(Chunk)
    private readonly chunkRepository: Repository<Chunk>,
    private readonly embeddingService: EmbeddingService,
  ) {}

  create(createChunkDto: CreateChunkDto) {
    return 'This action adds a new chunk';
  }

  findAll() {
    return `This action returns all chunk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chunk`;
  }

  remove(id: number) {
    return `This action removes a #${id} chunk`;
  }

  async searchSimilar(
    query: string,
    limit: number = 5,
  ): Promise<ChunkResult[]> {
    // Normalize query: lowercase and trim
    const normalizedQuery = query.toLowerCase().trim();
    const embedding: number[] =
      await this.embeddingService.embed(normalizedQuery);

    const vector = toVectorString(embedding);

    const results: ChunkResult[] = await this.chunkRepository.query(
      `
        SELECT content, embedding <=> $1 AS distance
        FROM chunk
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> $1
        LIMIT $2
      `,
      [vector, limit],
    );
    return results.filter((r) => r.distance < 0.7);
  }
}

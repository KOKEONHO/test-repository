import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(dto: CreateBoardDto) {
    const board = this.boardRepository.create({
      title: dto.title,
      content: dto.content,
      author: dto.author ?? 'anonymous',
    });

    return this.boardRepository.save(board);
  }

  async findAll() {
    return this.boardRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const board = await this.boardRepository.findOne({ where: { id } });
    if (!board) throw new NotFoundException(`Board not found. id=${id}`);
    return board;
  }

  async update(id: number, dto: UpdateBoardDto) {
    const board = await this.findOne(id);
    const merged = this.boardRepository.merge(board, dto);
    return this.boardRepository.save(merged);
  }

  async remove(id: number) {
    const board = await this.findOne(id);
    await this.boardRepository.remove(board);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventCategory, Difficulty, Prisma } from '@prisma/client';
import slugify from 'slugify';

export interface EventFilters {
  category?: EventCategory;
  difficulty?: Difficulty;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: EventFilters = {}) {
    const {
      category,
      difficulty,
      from,
      to,
      search,
      page = 1,
      limit = 12,
    } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = { isPublished: true };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (from || to) {
      where.dateTime = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { dateTime: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      events,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findFeatured() {
    return this.prisma.event.findMany({
      where: { isPublished: true, isFeatured: true },
      orderBy: { dateTime: 'asc' },
      take: 6,
    });
  }

  async findUpcoming() {
    return this.prisma.event.findMany({
      where: { isPublished: true, dateTime: { gte: new Date() } },
      orderBy: { dateTime: 'asc' },
      take: 10,
    });
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({ where: { slug } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CreateEventDto) {
    const baseSlug = slugify(dto.title, { lower: true, strict: true });
    const slug = `${baseSlug}-${Date.now()}`;

    return this.prisma.event.create({
      data: {
        ...dto,
        slug,
        price: dto.price,
        memberPrice: dto.memberPrice ?? null,
        dateTime: new Date(dto.dateTime),
        endDateTime: dto.endDateTime ? new Date(dto.endDateTime) : null,
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findById(id);
    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        endDateTime: dto.endDateTime ? new Date(dto.endDateTime) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.event.delete({ where: { id } });
  }

  async checkCapacity(eventId: string): Promise<boolean> {
    const event = await this.findById(eventId);
    return event.enrolled < event.capacity;
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { UpdateEventDto } from '../events/dto/update-event.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ─── Dashboard KPIs ────────────────────────────────────────────────
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('revenue')
  getRevenue(@Query('from') from: string, @Query('to') to: string) {
    return this.adminService.getRevenueAnalytics(from, to);
  }

  // ─── Events ────────────────────────────────────────────────────────
  @Get('events')
  getAllEvents(@Query('page') page: number, @Query('limit') limit: number) {
    return this.adminService.getAllEvents({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Post('events')
  createEvent(@Body() dto: CreateEventDto) {
    return this.adminService.createEvent(dto);
  }

  @Put('events/:id')
  updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.adminService.updateEvent(id, dto);
  }

  @Delete('events/:id')
  deleteEvent(@Param('id') id: string) {
    return this.adminService.deleteEvent(id);
  }

  @Put('events/:id/publish')
  togglePublish(
    @Param('id') id: string,
    @Body('isPublished') isPublished: boolean,
  ) {
    return this.adminService.toggleEventPublish(id, isPublished);
  }

  // ─── Users ─────────────────────────────────────────────────────────
  @Get('users')
  getUsers(@Query('role') role: string, @Query('page') page: number) {
    return this.adminService.getUsers({ role, page: page ? Number(page) : 1 });
  }

  @Put('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.adminService.updateUserRole(id, role);
  }

  // ─── Bookings ──────────────────────────────────────────────────────
  @Get('bookings')
  getAllBookings(@Query('status') status: string, @Query('page') page: number) {
    return this.adminService.getAllBookings({
      status,
      page: page ? Number(page) : 1,
    });
  }

  @Get('bookings/export')
  exportBookings(@Query('from') from: string, @Query('to') to: string) {
    return this.adminService.exportBookingsCSV(from, to);
  }

  // ─── Subscriptions ─────────────────────────────────────────────────
  @Get('subscriptions')
  getSubscriptions(@Query('status') status: string) {
    return this.adminService.getSubscriptions(status);
  }

  @Put('subscriptions/:id/cancel')
  cancelSubscription(@Param('id') id: string) {
    return this.adminService.adminCancelSubscription(id);
  }
}

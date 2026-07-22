import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('me')
  getMySubscription(@CurrentUser() user: { sub: string }) {
    return this.subscriptionsService.getUserActiveSubscription(user.sub);
  }

  @Get('pricing/:eventId')
  getPricing(
    @CurrentUser() user: { sub: string },
    @Param('eventId') eventId: string,
  ) {
    return this.subscriptionsService.calculateEventPrice(user.sub, eventId);
  }

  @Post()
  subscribe(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(user.sub, dto.planType);
  }

  @Delete(':id')
  cancel(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(user.sub, id);
  }
}

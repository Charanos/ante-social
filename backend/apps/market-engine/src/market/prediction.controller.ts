import { Controller, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PlacePredictionDto, JwtAuthGuard, CurrentUser } from '@app/common';
import { UserDocument } from '@app/database';

@Controller('markets')
@UseGuards(JwtAuthGuard)
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post(':marketId/predict')
  async place(
    @Param('marketId') marketId: string,
    @Body() dto: PlacePredictionDto,
    @CurrentUser() user: UserDocument,
  ) {
    dto.marketId = marketId;
    return this.predictionService.placePrediction(user._id.toString(), dto);
  }

  @Patch(':marketId/predict/:predictionId')
  async edit(
    @Param('marketId') marketId: string,
    @Param('predictionId') predictionId: string,
    @Body('outcomeId') newOutcomeId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.predictionService.editPrediction(user._id.toString(), predictionId, newOutcomeId);
  }

  @Delete(':marketId/predict/:predictionId')
  async cancel(
    @Param('marketId') marketId: string,
    @Param('predictionId') predictionId: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.predictionService.cancelPrediction(user._id.toString(), predictionId);
  }
}

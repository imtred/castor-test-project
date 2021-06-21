import { Controller, Get, HttpService, Inject, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Coordinate} from "tsgeo/Coordinate";
import {Vincenty}   from "tsgeo/Distance/Vincenty";
import { v4 as uuidv4 } from 'uuid';
import { UserMovementInfo } from './app.service.entity';
import { IAppService } from './i.app.service';



@Controller()
export class AppController {

  constructor(@Inject('AppService') private appService: IAppService) {
  }

  @Get(':userId')
  async getUserMovementInfo(@Req() request: Request): Promise<UserMovementInfo> {

    const uid = request.params.userId;
    const lat = parseFloat(String(request.query.lat))
    const long = parseFloat(String(request.query.long))

    return this.appService.getUserMovementInfo(uid, lat, long);
}
}

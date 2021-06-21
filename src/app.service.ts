import { HttpService, Injectable, NotImplementedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Coordinate } from 'tsgeo/Coordinate';
import { Vincenty } from 'tsgeo/Distance/Vincenty';
import { UserMovementInfo } from './app.service.entity';
import { IAppService } from './i.app.service';
import { IMockDatasource } from './datasource/i.mock.datasource';
import { MockDatasource } from './datasource/mock.datasource';
import { UserCurrentLocation, UserQuery } from './datasource/mock.datasource.entity';

@Injectable()
export class AppService implements IAppService{

  private mockDataSource: IMockDatasource;
  private usersCurrentLocations: UserCurrentLocation[];
  private usersQueries: UserQuery[];

  constructor(private httpService: HttpService) {
      this.mockDataSource = new MockDatasource();
      this.usersCurrentLocations = this.mockDataSource.getUsersCurrentLocation();
      this.usersQueries = this.mockDataSource.getUsersQueries();
  }


  public async getUserMovementInfo(uid: string, lat: number, long: number): Promise<UserMovementInfo> {

    try {
      const result = new UserMovementInfo();
      const ifLocationOnWater = await this.ifLocationOnWater(lat, long);
      const userLocationInfo = this.usersCurrentLocations.find(u => u.userId === uid)

      if (!userLocationInfo) {

        this.usersCurrentLocations.push({
          userId: uid,
          distance: 0,
          lat,
          long,
          water: ifLocationOnWater,
        })

        this.usersQueries.push({
          uuid: uuidv4(),
          userId: uid,
          water: ifLocationOnWater,
        })

        result.onLand = !ifLocationOnWater;
        result.distance = 0;
      }

      if (userLocationInfo) {

        this.usersQueries.push({
          uuid: uuidv4(),
          userId: uid,
          water: ifLocationOnWater,
        })

        const distance = this.getDistanceBetweenTwoPointInMeters(userLocationInfo, lat, long)

        const objIndex = this.usersCurrentLocations.findIndex((obj => obj.userId === uid));
        this.usersCurrentLocations[objIndex].distance = distance;
        this.usersCurrentLocations[objIndex].lat = lat;
        this.usersCurrentLocations[objIndex].long = long;

        result.onLand = !ifLocationOnWater;
        result.distance = distance;
      }

      result.percentageOnLandLocationQueries = this.getPercentageOnLandQueriesByUserId(uid);


      return result;
    } catch(err) {
      throw new NotImplementedException(err);
    }
  }

  private getPercentageOnLandQueriesByUserId(uid: string) {
    const am = this.usersQueries.filter((u) => {
      if(u.userId === uid && u.water === false) return u;
    });

    return (am.length * 100) / this.usersQueries.length;

  }

  private async ifLocationOnWater(lat: number, long: number) {
    const coordinates = `${lat},${long}`;
    return (await this.httpService.get(`https://api.onwater.io/api/v1/results/${coordinates}?access_token=2nks7C1XQFexsTukLj8t`).toPromise()).data.water;
  }

  private getDistanceBetweenTwoPointInMeters(user: any, lat: number, long: number) {
    let coordinate1 = new Coordinate(user.lat, user.long);
    let coordinate2 = new Coordinate(lat, long);
    let calculator = new Vincenty();

    return calculator.getDistance(coordinate1, coordinate2)
  }
}

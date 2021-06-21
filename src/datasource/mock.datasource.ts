import { UserCurrentLocation, UserQuery } from './mock.datasource.entity';
import { IMockDatasource } from './i.mock.datasource';

export class MockDatasource implements IMockDatasource{

    private readonly usersCurrentLocations: UserCurrentLocation[];
    private readonly usersQueries: UserQuery[];

    constructor() {
      this.usersCurrentLocations = [
        {
          userId: '4',
          distance: 0,
          lat: 11,
          long: 22,
          water: false
        },
        {
          userId: '2',
          distance: 0,
          lat: 11,
          long: 22,
          water: false
        },
        {
          userId: '3',
          distance: 0,
          lat: 11,
          long: 22,
          water: true
        },
      ];

      this.usersQueries = [
        {
          uuid: 'sdfdsf',
          userId: '1',
          water: false
        },
        {
          uuid: 'sdf1dsf',
          userId: '1',
          water: true
        },
        {
          uuid: 'sdfdsf22',
          userId: '1',
          water: false
        }
      ];
    }

    public getUsersCurrentLocation(): UserCurrentLocation[] {
      return this.usersCurrentLocations;
    }

    public getUsersQueries(): UserQuery[] {
      return this.usersQueries;
    }
}
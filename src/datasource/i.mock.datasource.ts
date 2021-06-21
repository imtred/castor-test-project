import { UserCurrentLocation, UserQuery } from './mock.datasource.entity';

export interface IMockDatasource {
  getUsersCurrentLocation(): UserCurrentLocation[];
  getUsersQueries(): UserQuery[];
}
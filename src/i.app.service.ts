import { UserMovementInfo } from './app.service.entity';

export interface IAppService {
  getUserMovementInfo(uid: string, lat: number, long: number): Promise<UserMovementInfo>;
}
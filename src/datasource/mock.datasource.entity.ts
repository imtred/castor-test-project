export class UserQuery {
  public uuid: string;
  public userId: string;
  public water: boolean;
}

export class UserCurrentLocation {
  public userId: string;
  public distance: number;
  public lat: number;
  public long: number;
  public water: boolean;
}
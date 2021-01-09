import { User } from './user';

export class Lesson {

  public id?: number;
  public title: string;
  public teacher: User;
  public attenders: User[];
  public slow: boolean;
  public hand: User[];

  constructor(title: string) {
    this.title = title;
    this.attenders = [];
    this.hand = [];
  }

}

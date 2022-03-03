import { Deserializable } from '../interfaces/deserializable';
import * as moment from 'moment';

export interface IUser {
  createdAt: string
  dob: string
  firstName: string
  id: string
  lastName: string
  phone: string
  gender: string
}

export class User implements Deserializable<User>, IUser {
  createdAt: string;
  dob: string;
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  gender: string;

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  get textColorGender() {
    return this.gender === 'Agender' ? 'red-color' : ''
  }
  get formatDob() {
    return moment(this.dob).format('DD/MM/YYYY')
  }

  deserialize(input: Partial<IUser>): User {
    Object.assign(this, input);
    return this;
  }

  createdJson() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      dob: this.dob,
    }
  }
}

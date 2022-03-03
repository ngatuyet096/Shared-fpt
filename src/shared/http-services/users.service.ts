import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { User, IUser } from '../models/users';


@Injectable({
	providedIn: 'root',
})
export class CourseService {
	constructor(private ApiSv: ApiService) { }

	fetchUser(opts?: any): Observable<IUser[]> {
		return this.ApiSv.get('/users', opts).pipe(map(res => res.map((item:IUser) =>  new User().deserialize(item))))
	}

	getUser(id:string, opts?: any): Observable<IUser> {
		return this.ApiSv.get(`/users/${id}`, opts).pipe(map(res =>  new User().deserialize(res)))
	}

	createdUser(data:IUser) {
		return this.ApiSv.post('/users', data)
	}
}

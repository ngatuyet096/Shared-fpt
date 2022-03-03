import { Component } from '@angular/core';
import { IUser, User } from 'src/shared/models/users';
import { CourseService } from '../shared/http-services/users.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shared-fpt';
  listUser: IUser[] = [];
  user:any = new User()
  displayedColumns: string[] = ['id', 'fullName',  'gender', 'dob', 'createdAt'];
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.getUserList()
  }

  getUserList(): void {
    this.courseService.fetchUser().subscribe((data: IUser[]) => {
      this.listUser = data;
    })
  }

  showItem(item:IUser) {
    this.courseService.getUser(item.id).subscribe((data:IUser) => {
      this.user = data
    })
  }

  createUser():void {
    this.courseService.createdUser(this.user.createdJson())
  }

}

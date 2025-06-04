import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ServerConfig } from '../config/ServerConfig';
import { ActiveUser } from '../model/ActiveUser';

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css', '../home/home.component.css']
})
export class ActiveUsersComponent {

  private activeUsersEndpoint = `${ServerConfig.host}/users`

  activeUsers: ActiveUser[] =[];

  constructor(
    private httpClient: HttpClient
  ) {
    this.activeUsers = Array(5).fill({
      start: new Date().toLocaleString(),
      user:'loading...'
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.updateLastActiveUsers();
    }, 10000)
  }

  updateLastActiveUsers(): void {
    this.httpClient.get<ActiveUser[]>(this.activeUsersEndpoint + '/active')
      .subscribe(data => {

        this.activeUsers = data.map(activeUser => {
           if (!activeUser.user) activeUser.user = "UNKNOWN";
           return activeUser;
        });
      }
   )};
}

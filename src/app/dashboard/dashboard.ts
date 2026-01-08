import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { empty } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Navbar, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  // to get all the entries from user table
  users: any[] = [];
  loading = true;

  totalCount = 0;
  categoryCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
    this.getUserCount();
    this.getCategoryCount();
  }

  // to get all users entries
  getUsers() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/users')
      .subscribe({
        next: res => {
          this.users = res;
          this.loading = false;
        },
        error: err => {
          console.log(err);
          this.loading = false;
        }
      })
  }

  // to get count of users
  getUserCount() {
    this.http
      .get<{ count: number }>('http://127.0.0.1:8000/api/users/count')
      .subscribe({
        next: res => this.totalCount = res.count,
        error: err => console.log(err)
      });
  }

  // to get count of category
  getCategoryCount() {

    this.http.get<{ categoryCount: number }>('http://127.0.0.1:8000/api/category/count')
    .subscribe({
      next: res => this.categoryCount = res.categoryCount,
      error: err => console.log(err)
    });
  }

  getLoggedInUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  user = this.getLoggedInUser();
  UserName = this.user.user_name;
  // console.log(user.user_name);
  // console.log(user.user_role);
}

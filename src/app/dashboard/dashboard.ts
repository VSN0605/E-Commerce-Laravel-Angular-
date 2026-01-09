import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  totalCount = 0; // total user count
  categoryCount = 0;
  productCount = 0;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getUserCount();
    this.getCategoryCount();
    this.getProductCount();
  }

  // to get all users entries
  getUsers() {
    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

    this.http.get<any[]>(`http://127.0.0.1:8000/api/users?role=${loggedUser.user_role}`)
      .subscribe({
        next: res => {
          this.users = res;
          this.loading = false;
          this.cdr.detectChanges();
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

  // to get product count
  getProductCount() {
    this.http.get<{ productCount: number }>('http://127.0.0.1:8000/api/product/count')
    .subscribe({
      next: res => this.productCount = res.productCount,
      error: err => console.log(err)
    });
  }

  // to get logged in user
  getLoggedInUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  user = this.getLoggedInUser();
  UserName = this.user.user_name;
  // console.log(user.user_name);
  // console.log(user.user_role);
}

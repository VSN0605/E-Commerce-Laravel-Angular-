import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [Navbar, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  user : any;
  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getUser();
    this.cdr.detectChanges();
  }

  getUser() {

    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

    this.http
      .get<any>(`http://127.0.0.1:8000/api/user/user-profile/${loggedUser.id}`)
      .subscribe({
        next: res => {
          this.user = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('cant fetch user detail', err);
        }
      });
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router: Router, private http: HttpClient) {}

  // function to logout
  logout() {
    if (!confirm('Are you sure')) return;

    const token = localStorage.getItem('token');

    const url =
      'http://127.0.0.1:8000/api/user/logout';

    this.http.post(url, {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      },
    });
  }
}

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

    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

    const url =
      `http://127.0.0.1:8000/api/user/logout` +
      `?role=${loggedUser.user_role}&user_name=${loggedUser.user_name}`;

    this.http.post(url, {}).subscribe({
      next: () => {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      },
    });
  }
}

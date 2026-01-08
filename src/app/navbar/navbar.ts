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
   constructor(private router: Router) {}

  logout() {
    console.log('button clicked successfully');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user = {
    user_email: '',
    user_pass: '',
  };

  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(form: NgForm) {
    this.http.post<any>('http://127.0.0.1:8000/api/login', this.user).subscribe({
      next: res => {
        localStorage.setItem('user', JSON.stringify(res.user));

        form.resetForm();

        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error.message || 'Login failed';
      }
    });
  }
}

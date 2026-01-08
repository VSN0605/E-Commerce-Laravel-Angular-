import { HttpClient } from '@angular/common/http';
import { Component, } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, RouterOutlet],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css',
})
export class UserRegistration {
  user = {
    user_name : '',
    user_email : '',
    user_role : '',
    user_pass : '',
  };

  selectedFile! : File | null;

  constructor(private http : HttpClient, private router: Router) {}

  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit(form: NgForm) {
    const formData = new FormData();
    formData.append('user_name', this.user.user_name);
    formData.append('user_email', this.user.user_email);
    formData.append('user_role', this.user.user_role);
    formData.append('user_pass', this.user.user_pass);

    console.log(formData);
    
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    this.http.post('http://127.0.0.1:8000/api/users', formData)
      .subscribe({
       
        next: () => {
          form.resetForm();
          this.selectedFile = null;

          this.router.navigate(['/']);
        },
        error: err => {
          console.log(err);
        }
      });
  }
}

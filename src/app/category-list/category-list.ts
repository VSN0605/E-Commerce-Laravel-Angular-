import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Navbar } from '../navbar/navbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Navbar, RouterLink, RouterOutlet],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  display: boolean = false;

  toggleDiv() {
    this.display =! this.display;
  }

  hideDiv() {
    this.display = false;
  }

  category = {
    category_name : '',
    category_details : '',
  }

  constructor(private http : HttpClient) {}

  submit(form: NgForm) {
    const formData = new FormData();

    formData.append('category_name', this.category.category_name);
    formData.append('category_details', this.category.category_details);

    this.http.post('http://127.0.0.1:8000/api/category', formData)
      .subscribe({
        next: () => {
          form.resetForm();
          this.display = false;
        },
        error: err => {
          console.log(err);
        }
      })
  }

  categories: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/category')
      .subscribe({
        next: res => {
          this.categories = res;
          this.loading = false;
        },
        error: err => {
          console.log(err);
          this.loading = false;
        }
      })
  }
  
}

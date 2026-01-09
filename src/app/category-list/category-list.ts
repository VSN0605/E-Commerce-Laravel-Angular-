import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
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
    this.router.navigate(['categoryList']);
  }

  hideDiv() {
    this.display = false;
    this.router.navigate(['categoryList']);
  }

  category = {
    category_name : '',
    category_details : '',
    // created_by : '',
  }

  isEditMode = false;
  categoryId! : number;

  constructor(
    private http : HttpClient,
    private cdr : ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

   ngOnInit(): void {
    this.getCategories();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if(id) {
        this.categoryId = +id;
        this.isEditMode = true;
        this.display = true;
        this.getCategoryById();
      } else {
        this.isEditMode = false;
      }
    });

    this.getCategories();
  }

  // to get category in form by id
  getCategoryById() {
    this.http.get<any>(`http://127.0.0.1:8000/api/category/${this.categoryId}`)
    .subscribe(res => {
      this.category.category_name = res.category_name;
      this.category.category_details = res.category_details;
      // this.category.created_by = res.category.created_by;
      this.cdr.detectChanges();
    })
  }

  // to submit and update function;
  submit(form: NgForm) {
    const formData = new FormData();

    formData.append('category_name', this.category.category_name);
    formData.append('category_details', this.category.category_details);
    // formData.append('created_by', this.category.created_by);

    const request = this.isEditMode
    ? this.http.post(
        `http://127.0.0.1:8000/api/category/${this.categoryId}?_method=PUT`,
        formData
      )
    : this.http.post(
          'http://127.0.0.1:8000/api/category',
          formData
      );

    request.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Category updated successfully' : 'Category added successfully');
        form.resetForm();
        this.display = false;
        this.getCategories();
      },
      error: err => console.log(err)
    });
    
  }

  // to edit category
  editCategory(id: number) {
    this.router.navigate(['categoryList', id]);
  }

  categories: any[] = [];
  loading = true;

//  get all categories
  getCategories() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/category')
      .subscribe({
        next: res => {
          this.categories = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.log(err);
          this.loading = false;
        }
      })
  }

  // to get logged in user
  getLoggedinUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  user = this.getLoggedinUser();
  userRole = this.user.user_role;
  
}

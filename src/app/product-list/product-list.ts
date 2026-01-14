import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, Navbar, RouterLink, RouterOutlet],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  constructor(private http : HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  products: any[] = [];
  loading = true;

  filteredProducts: any[] = [];

  showDropdown = false;

  // to show category dropdown list
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  // to get all products
  getProducts() {
    const token = localStorage.getItem('token');
   
    this.http.get<any[]>('http://127.0.0.1:8000/api/product', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .subscribe({
        next: res => {
          this.products = res;
          this.loading = false;
          this.filteredProducts = res;
          this.cdr.detectChanges();
        },
        error: err => {
          console.log(err);
          this.loading = false;
        }
      })
  }

  // to filter product on the basis of category
  filterByCategory(categoryId: number) {
    this.filteredProducts = this.products.filter(
      product => product.category_id === categoryId
    );
  }

  // to delete product
  deleteProduct(id: number) {
    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if(!confirm('Are you sure?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
        this.getProducts();
      })
  }

  // to edit product
  editProduct(id: number) {
    this.router.navigate(['/productForm', id]);
  }

  // to view product details
  viewProduct(id: number) {
    this.router.navigate(['/productList/viewProduct', id]);
  }

  // to get all categoies in dropdown list
  categories: any[] = [];

  getCategories() {
    const token = localStorage.getItem('token');

    this.http.get<any>('http://127.0.0.1:8000/api/categories/dropdown', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .subscribe({
        
        next: res => {
          console.log(res);
          this.categories = res;
          this.cdr.detectChanges(); 
        },
        error: err => console.log(err)
      });
  }
}
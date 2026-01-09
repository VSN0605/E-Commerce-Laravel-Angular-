import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  ngOnInit(): void {
    this.getProducts();
  }

  // to get all products
  getProducts() {
    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

    this.http.get<any[]>(`http://127.0.0.1:8000/api/product?role=${loggedUser.user_role}`)
      .subscribe({
        next: res => {
          this.products = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.log(err);
          this.loading = false;
        }
      })
  }

  // to delete product
  deleteProduct(id: number) {
    if(!confirm('Are you sure?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/product/${id}`)
      .subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
        this.getProducts();
      })
  }

  // to edit product
  editProduct(id: number) {
    this.router.navigate(['/productForm', id]);
  }
}
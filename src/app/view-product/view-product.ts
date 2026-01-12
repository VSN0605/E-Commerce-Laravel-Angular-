import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-product',
  imports: [Navbar, RouterLink, RouterOutlet],
  templateUrl: './view-product.html',
  styleUrl: './view-product.css',
})
export class ViewProduct {

  productId!: number;
  product: any;
  products: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

   ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductById();
  }
  
  // to edit product
  editProduct(id: number) {
    this.router.navigate(['/productForm', id]);
  }

  // to delete product
  deleteProduct(id: number) {
    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if(!confirm('Are you sure?')) return;

    this.http.delete(`http://127.0.0.1:8000/api/product/${id}?role=${loggedUser.user_role}`)
      .subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
      })
    this.router.navigate(['/productList']);
    this.cdr.detectChanges();
  }

  // to get the product detail
  getProductById() {
  this.http
    .get<any>(`http://127.0.0.1:8000/api/product/product-detail/${this.productId}`)
    .subscribe({
      next: res => {
        this.product = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Product fetch failed', err);
      }
    });
}
}

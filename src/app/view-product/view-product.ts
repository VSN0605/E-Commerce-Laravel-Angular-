import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-product',
  imports: [Navbar, RouterLink, RouterOutlet],
  templateUrl: './view-product.html',
  styleUrl: './view-product.css',
})
export class ViewProduct {

  productId!: number;
  product: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

   ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductById();
  }

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

import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-product',
  imports: [Navbar, RouterLink, RouterOutlet, FormsModule],
  templateUrl: './view-product.html',
  styleUrl: './view-product.css',
})
export class ViewProduct {

  productId!: number;
  product: any;
  products: any[] = [];
  loading = true;

  showPopupDiv : boolean = false;
  product_quantity: number = 0;
  stockAction: 'add' | 'remove' = 'add';

  // open popup
  openPopup(action: 'add' | 'remove') {
    this.stockAction = action;
    this.product_quantity = 0;
    this.showPopupDiv = true;
  }

  // close popup
  hidePopup() {
    this.showPopupDiv = false;
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductById();
    this.cdr.detectChanges();
  }
  
  // to edit product
  editProduct(id: number) {
    this.router.navigate(['/productForm', id]);
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
      })
    this.router.navigate(['/productList']);
    this.cdr.detectChanges();
  }

  // submit stock
  submitStock(id: number) {
  if (this.product_quantity <= 0) {
    alert('Please enter valid quantity');
    return;
  }

  const token = localStorage.getItem('token');
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const url =
    this.stockAction === 'add'
      ? `http://127.0.0.1:8000/api/product/${id}/add-stock`
      : `http://127.0.0.1:8000/api/product/${id}/remove-stock`;

  this.http.post(url, {
    product_quantity: this.product_quantity
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  ).subscribe({
    next: () => {
      alert('Stock updated successfully');
      window.location.reload();
    },
    error: (err) => {
      alert(err.error?.message || 'Failed to update stock');
      console.error(err);
      window.location.reload();
    }
  });
}

  // to get the product detail
  getProductById() {
    const token = localStorage.getItem('token');

    this.http
      .get<any>(`http://127.0.0.1:8000/api/product/product-detail/${this.productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
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

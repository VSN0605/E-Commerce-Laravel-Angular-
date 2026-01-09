import { ChangeDetectorRef, Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, ReactiveFormsModule, Navbar, RouterLink, RouterOutlet],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  product = {
    product_name : '',
    product_description : '',
    product_price : '',
    product_category : '',
    product_company : ''
  };

  selectedFile! : File | null;
  isEditMode = false;
  productId! : number;

  constructor(
    private http : HttpClient, 
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
     this.getCategories();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      
      if (id) {
        this.productId = +id;
        this.isEditMode = true;
        this.getProductById();
        
      }
    });
  }

  // to get product data in edit form
  getProductById() {
    this.http.get<any>(`http://127.0.0.1:8000/api/product/${this.productId}`)
    .subscribe(res => {
      this.product.product_name = res.product_name;
      this.product.product_description = res.product_description;
      this.product.product_price = res.product_price;
      this.product.product_category = res.product_category;
      this.product.product_company = res.product_company;
      this.cdr.detectChanges();
    });
    
  }

  onFileChange(event:any) {
    if(event.target.files?.length) {
      this.selectedFile = event.target.files[0];
    }
  }

  //  get all categories
  categories: any[] = [];
  loading = true;
  
  getCategories() {
    this.http.get<any>('http://127.0.0.1:8000/api/category')
      .subscribe({
        
        next: res => {
          console.log(res);
          this.categories = res;
          this.cdr.detectChanges(); 
        },
        error: err => console.log(err)
      });
  }

  // to create and update product
  submit(form: NgForm) {
    const formData = new FormData();
    formData.append('product_name', this.product.product_name);
    formData.append('product_description', this.product.product_description);
    formData.append('product_price', this.product.product_price);
    formData.append('product_category', this.product.product_category);
    formData.append('product_company', this.product.product_company);
    
    console.log(formData);
    
     if (this.selectedFile) {
      formData.append('product_image', this.selectedFile);
    }

    // to create and update product
    const request = this.isEditMode
    ? this.http.post(
        `http://127.0.0.1:8000/api/product/${this.productId}?_method=PUT`,
        formData
      )
    : this.http.post(
        'http://127.0.0.1:8000/api/product',
        formData
      );

    request.subscribe({
      next: () => {
        alert(this.isEditMode ? 'Product updated successfully' : 'Product added successfully');
        this.router.navigate(['/productList']);
      },
      error: err => console.log(err)
    });
  }
}

import { Component } from '@angular/core';
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
  isEditMode : boolean = false;
  userId! : number;

  constructor(
    private http : HttpClient, 
    private router: Router,
    // private route: ActivatedRoute
  ) {}



  onFileChange(event: any) {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit(form: NgForm) {
    const formData = new FormData();
    formData.append('product_name', this.product.product_name);
    formData.append('product_description', this.product.product_description);
    formData.append('product_price', this.product.product_price);
    formData.append('product_category', this.product.product_category);
    formData.append('product_company', this.product.product_company);
    
    console.log(formData);
    
    if(this.selectedFile) {
      formData.append('product_image', this.selectedFile);
    }

    this.http.post('http://127.0.0.1:8000/api/product', formData)
      .subscribe({

        next: () => {
          form.resetForm();
          this.selectedFile = null;
          alert('Product Added Successfully');

          this.router.navigate(['/productList']);
        },
        error: err => {
          console.log(err);
        }
      });
  }
}

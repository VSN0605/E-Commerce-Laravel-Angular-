import { Routes } from '@angular/router';
import { UserRegistration } from './user-registration/user-registration';
import { Login } from './login/login';
import { Navbar } from './navbar/navbar';
import { authGuard } from './auth-guard';
import { Dashboard } from './dashboard/dashboard';
import { CategoryList } from './category-list/category-list';
import { ProductList } from './product-list/product-list';
import { ProductForm } from './product-form/product-form';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'user-registration', component: UserRegistration },
    { path: 'navbar', component: Navbar, canActivate: [authGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'categoryList', component: CategoryList, canActivate: [authGuard] },
    { path: 'productList', component: ProductList, canActivate: [authGuard] },
    { path: 'productForm', component: ProductForm, canActivate: [authGuard] },
    { path: 'productForm/:id', component: ProductForm, canActivate: [authGuard] },
    { path: 'categoryList/:id', component: CategoryList, canActivate: [authGuard] },
];

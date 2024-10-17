import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from 'rxjs/operators';
import { environment } from "../../environments/environment.example";
import { Product } from "../interfaces/product";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = `${environment.apiUrl}/products`;

  // BehaviorSubject to store product list state
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient ) {}

  // Fetch products from API and update state
  fetchProducts(): Observable<Product[]> {
    if (this.productsSubject.value.length > 0) {
      return of(this.productsSubject.value);
    }

    return this.http.get<Product[]>(this.apiURL).pipe(
      tap((products) => this.productsSubject.next(products)),
      catchError(error => throwError(() => new Error('Error fetching products')))
    );
  }

  updateProducts(products: Product[]): void {
    this.productsSubject.next(products);
  }

  // Get a single product from the state or fetch it from the API
  getProduct(id: number): Observable<Product | undefined> {
    const existingProduct = this.productsSubject.value.find(product => Number(product.id) === Number(id));
    if (existingProduct) {
      // If the product is found in the state, return it
      return of(existingProduct);
    }

    // Otherwise, fetch it from the API and update the state
    return this.http.get<Product>(`${this.apiURL}/${id}`).pipe(
      catchError(error => throwError(() => new Error('Error fetching product')))
    );
  }

  // Add a new product and update the product state
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiURL, product).pipe(
      tap((newProduct) => {
        const updatedProducts = [...this.productsSubject.value, newProduct];
        this.productsSubject.next(updatedProducts); // Update state
      }),
      catchError(error => throwError(() => new Error('Error adding product')))
    );
  }

  // Update an existing product and update the product state
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiURL}/${product.id}`, product).pipe(
      tap((updatedProduct) => {
        const updatedProducts = this.productsSubject.value.map(p =>
          p.id === updatedProduct.id ? updatedProduct : p
        );
        this.productsSubject.next(updatedProducts); // Update state
      }),
      catchError(error => throwError(() => new Error('Error updating product')))
    );
  }

  // Delete a product and update the product state
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`).pipe(
      tap(() => {
        const updatedProducts = this.productsSubject.value.filter(product => product.id !== id);
        this.productsSubject.next(updatedProducts); // Update state
      }),
      catchError(error => throwError(() => new Error('Error deleting product')))
    );
  }

  deleteProductsByCategory(categoryId: number): Observable<void> {
    const listProductsToDelete = this.productsSubject.value.filter(product => product.categoryId === categoryId);
    if (listProductsToDelete.length === 0) {
      return of(undefined);
    }

    listProductsToDelete.forEach(product => product.id && this.deleteProduct(product.id).subscribe());
    return of(undefined); // Ensure an Observable<void> is always returned
  }
}

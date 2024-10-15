import { Injectable } from '@angular/core';
import { Product } from '../../interfaces/product';
import { Observable, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = "https://670e32a8073307b4ee45da4b.mockapi.io/angular-hieudtr8-product-management/products"

  constructor(private http: HttpClient ) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }

  getProduct(id: number): Observable<Product | undefined> {
    return this.http.get<Product>(`${this.apiURL}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiURL, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiURL}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}

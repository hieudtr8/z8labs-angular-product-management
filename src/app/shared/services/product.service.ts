import { Injectable } from '@angular/core';
import { Product } from '../../interfaces/product';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProduct(id: number): Observable<Product | undefined> {
    return of(this.products.find((product) => product.id === id));
  }

  addProduct(product: Product): Observable<Product> {
    product.id = this.products.length + 1;
    this.products.push(product);
    return of(product);
  }

  updateProduct(product: Product): Observable<Product> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index === -1) {
      this.products[index] = product;
    }
    return of(product);
  }

  deleteProduct(id: number): Observable<void> {
    this.products = this.products.filter((product) => product.id !== id);
    return of(void 0);
  }
}

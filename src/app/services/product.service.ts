import { forwardRef, Inject, inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of, from, combineLatest } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from "../interfaces/product";
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, setDoc, updateDoc } from "@angular/fire/firestore";
import { CategoryService } from "./category.service";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore: Firestore = inject(Firestore);

  // BehaviorSubject to store product list state
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(
  ) {}

  // Fetch products from API and update state
  fetchProducts(): Observable<Product[]> {
    if (this.productsSubject.value.length > 0) {
      return of(this.productsSubject.value);
    }

    const productsCollection = collection(this.firestore, 'products');

    return collectionData(productsCollection, { idField: 'id'}).pipe(
      tap((categories: Product[]) => this.productsSubject.next(categories)),
      catchError(error => {
        console.log(error);
        throwError(() => new Error('Error fetching categories'))
        return of([]);
      })
    ) as Observable<Product[]>;
  }

  updateProducts(products: Product[]): Observable<Product[]> {
    this.productsSubject.next(products);
    return of(products);
  }

  // Get a single product from the state or fetch it from the API
  getProduct(id: string): Observable<Product | undefined> {
    const existingProduct = this.productsSubject.value.find(product => String(product.id) === String(id));
    if (existingProduct) {
      // If the product is found in the state, return it
      return of(existingProduct);
    }

    // Otherwise, fetch it from the API and update the state
    return from(getDoc(doc(this.firestore, 'products', id))).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as unknown as Product;
        } else {
          throw new Error('Product not found');
        }
      }),
      catchError(error => throwError(() => new Error('Error fetching product')))
    );
  }

  // Add a new product and update the product state
  addProduct(product: Product): Observable<Product> {
    const productId = doc(collection(this.firestore, 'products')).id;
    const newProduct = {
      id: productId,
      ...product
    };

    return from(setDoc(doc(this.firestore, 'products', productId), newProduct)).pipe(
      tap(() => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]); // Update state
      }),
      map(() => newProduct),
      catchError(error => throwError(() => new Error('Error adding product')))
    );
  }

  // Update an existing product and update the product state
  updateProduct(product: Product): Observable<Product> {
    return from(updateDoc(doc(this.firestore, 'products', product.id!), product as { [x: string]: any })).pipe(
      tap(() => {
        const updatedProducts = this.productsSubject.value.map(p =>
          p.id === product.id ? product : p
        );
        this.productsSubject.next(updatedProducts); // Update state
      }),
      map(() => product),
      catchError(error => throwError(() => new Error('Error updating product')))
    );
  }

  // Delete a product and update the product state
  deleteProduct(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'products', id))).pipe(
      tap(() => {
        const updatedProducts = this.productsSubject.value.filter(product => product.id !== id);
        this.productsSubject.next(updatedProducts); // Update state
      }),
      catchError(error => throwError(() => new Error('Error deleting product')))
    );
  }

  deleteProductsByCategory(categoryId: string): Observable<void> {
    const listProductsToDelete = this.productsSubject.value.filter(product => String(product.categoryId) === categoryId);
    if (listProductsToDelete.length === 0) {
      return of(undefined);
    }

    listProductsToDelete.forEach(product => product.id && this.deleteProduct(product.id).subscribe());
    return of(undefined); // Ensure an Observable<void> is always returned
  }
}

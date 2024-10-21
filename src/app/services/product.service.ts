import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of, from, combineLatest } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Product } from "../interfaces/product";
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, setDoc, updateDoc } from "@angular/fire/firestore";
import { deleteObject, getDownloadURL, ref, Storage, uploadBytesResumable } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  // BehaviorSubject to store product list state
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor() {}

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
        return throwError(() => new Error('Error fetching categories'))
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
  addProduct(product: Product, imageFile?: File): Observable<Product> {
    const productId = doc(collection(this.firestore, 'products')).id;
    const newProduct = {
      id: productId,
      ...product
    };

    // If an image file is provided, upload it to Firebase Storage
    if (imageFile) {
      return this.uploadImage(productId, imageFile).pipe(
        switchMap(imageUrl => {
          newProduct.imageUrl = imageUrl;
          return from(setDoc(doc(this.firestore, 'products', productId), newProduct));
        }),
        tap(() => {
          const currentProducts = this.productsSubject.value;
          this.productsSubject.next([...currentProducts, newProduct]); // Update state
        }),
        map(() => newProduct),
        catchError(error => {
          console.log('file: product.service.ts:88 | error:', error)
          return throwError(() => new Error('Error adding product'))
        })
      );
    }

    // If no image file is provided, just add the product
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
  updateProduct(product: Product, imageFile?: File): Observable<Product> {
    // If an image file is provided, upload it to Firebase Storage
    if (imageFile) {
      return this.uploadImage(product.id!, imageFile).pipe(
        switchMap(imageUrl => {
          product.imageUrl = imageUrl;
          return from(updateDoc(doc(this.firestore, 'products', product.id!), product as { [x: string]: any }));
        }),
        tap(() => {
          const updatedProducts = this.productsSubject.value.map(p =>
            p.id === product.id ? product : p
          );
          this.productsSubject.next(updatedProducts); // Update state
        }),
        map(() => product),
        catchError(error => throwError(() => new Error('Error updating product'))
      ));
    }

    // If no image file is provided, update the product without changing the image
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
    return this.getProduct(id).pipe(
      switchMap((product) => {
        if (!product) {
          return throwError(() => new Error('Product not found'));
        }

        if (product.imageUrl) {
          return from(deleteObject(ref(this.storage, product.imageUrl))).pipe(
            catchError(() => of (undefined)),
            switchMap(() => from(deleteDoc(doc(this.firestore, 'products', id))))
          );
        }

        return from(deleteDoc(doc(this.firestore, 'products', id)));
      }),
      tap(() => {
        const updatedProducts = this.productsSubject.value.filter(product => product.id !== id);
        this.productsSubject.next(updatedProducts); // Update state
      }),
      catchError(error => throwError(() => new Error('Error deleting product'))
    ));
  }

  deleteProductsByCategory(categoryId: string): Observable<void> {
    const listProductsToDelete = this.productsSubject.value.filter(product => String(product.categoryId) === categoryId);
    if (listProductsToDelete.length === 0) {
      return of(undefined);
    }

    listProductsToDelete.forEach(product => product.id && this.deleteProduct(product.id).subscribe());
    return of(undefined); // Ensure an Observable<void> is always returned
  }

  uploadImage(productId: string, imageFile: File): Observable<string> {
    const filePath = `product-images/${productId}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);


    return new Observable<string>(observer => {
      uploadTask.on('state_changed',
        snapshot => {
          // Progress monitoring
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        error => {
          observer.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            observer.next(downloadURL);
            observer.complete();
          })
        }
      );
    })
  }

  // Remove product image
  removeProductImage(productId: string): Observable<void> {
    return this.getProduct(productId).pipe(
      switchMap(product => {
        if (!product || !product.imageUrl) {
          return throwError(() => new Error('Product not found or no image to remove'));
        }

        const updatedProduct = {
          ...product,
          imageUrl: null,
        };
        return from(updateDoc(doc(this.firestore, 'products', productId), updatedProduct)).pipe(
          switchMap(() => {
            // Delete the image file from Firebase Storage
            const imageRef = ref(this.storage, product.imageUrl!);
            return from(deleteObject(imageRef));
          }),
          tap(() => {
            // Update the local state
            const updatedProducts = this.productsSubject.value.map(p =>
              p.id === productId ? updatedProduct : p
            );
            this.productsSubject.next(updatedProducts);
          })
        );
      }),
      catchError(error => throwError(() => new Error(error))

      )
    )
  }
}

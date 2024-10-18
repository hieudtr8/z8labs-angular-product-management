import { forwardRef, Inject, inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, of, from } from "rxjs";
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ProductService } from "./product.service";
import { Category } from "../interfaces/category";
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, setDoc, updateDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private firestore: Firestore = inject(Firestore);

  // BehaviorSubject to store category state
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(
    @Inject(forwardRef(() => ProductService)) private productService: ProductService
  ) {}

  // Fetch all categories and update state
  fetchCategories(): Observable<Category[]> {
    if (this.categoriesSubject.value.length > 0)
      return of(this.categoriesSubject.value);

    const categoriesCollection = collection(this.firestore, 'categories');

    return collectionData(categoriesCollection, { idField: 'id'}).pipe(
      tap((categories: Category[]) => this.categoriesSubject.next(categories)),
      catchError(error => {
        console.log(error);
        throwError(() => new Error('Error fetching categories'))
        return of([]);
      })
    ) as Observable<Category[]>;
  }
  // Get a single category by id
  getCategory(id: string): Observable<Category | undefined> {
    const existingCategory = this.categoriesSubject.value.find(cat => String(cat.id) === String(id));

    if (existingCategory)
      return of(existingCategory);

    return from(getDoc(doc(this.firestore, 'categories', String(id)))).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return {
            id: docSnapshot.id,
            ...docSnapshot.data()
          } as unknown as Category;
        } else {
          throw new Error('Category not found');
        }
      }),
      catchError(error => throwError(() => new Error('Error fetching category')))
    );
  }

  // Add a new category and update state
  addCategory(category: Category): Observable<Category> {
    const categoryId = doc(collection(this.firestore, 'categories')).id;
    const newCategory = {
      id: categoryId,
      ...category
    };

    return from(setDoc(doc(this.firestore, 'categories', categoryId), newCategory)).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value;
        this.categoriesSubject.next([...currentCategories, newCategory]);
      }),
      map(() => newCategory),
      catchError(error => throwError(() => new Error('Error adding category'))
    ));
  }

  // Update an existing category and update state
  updateCategory(category: Category): Observable<Category> {
    return from(updateDoc(doc(this.firestore, 'categories', category.id!), category as { [x: string]: any })).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value.map(
          cat => cat.id === category.id ? category : cat
        );
        this.categoriesSubject.next(currentCategories);
      }),
      map(() => category),
      catchError(error => throwError(() => new Error('Error updating category'))
    ));
  }

  // Delete a category and update state
  deleteCategory(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'categories', id))).pipe(
      switchMap(() => this.productService.deleteProductsByCategory(id)),
      tap(() => {
        const currentCategories = this.categoriesSubject.value.filter(cat => cat.id !== id);
        this.categoriesSubject.next(currentCategories);
      }),
      catchError(error => throwError(() => new Error('Error deleting category')))
    );
  }
}

import { Injectable } from '@angular/core';
import { Category } from "../../interfaces/category";
import { Observable, BehaviorSubject, throwError, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiURL = "https://670e32a8073307b4ee45da4b.mockapi.io/angular-hieudtr8-product-management/categories";

  // BehaviorSubject to store category state
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch all categories and update state
  fetchCategories(): Observable<Category[]> {
    if (this.categoriesSubject.value.length > 0)
      return of(this.categoriesSubject.value);

    return this.http.get<Category[]>(this.apiURL).pipe(
      tap(categories => this.categoriesSubject.next(categories)),
      catchError(error => throwError(() => new Error('Error fetching categories')))
    );
  }

  // Get a single category by id
  getCategory(id: number): Observable<Category | undefined> {
    return this.http.get<Category>(`${this.apiURL}/${id}`);
  }

  // Add a new category and update state
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURL, category).pipe(
      tap(newCategory => {
        const currentCategories = this.categoriesSubject.value;
        this.categoriesSubject.next([...currentCategories, newCategory]);
      }),
      catchError(error => throwError(() => new Error('Error adding category')))
    );
  }

  // Update an existing category and update state
  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiURL}/${category.id}`, category).pipe(
      tap(updatedCategory => {
        const currentCategories = this.categoriesSubject.value.map(cat =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        );
        this.categoriesSubject.next(currentCategories);
      }),
      catchError(error => throwError(() => new Error('Error updating category')))
    );
  }

  // Delete a category and update state
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value.filter(cat => cat.id !== id);
        this.categoriesSubject.next(currentCategories);
      }),
      catchError(error => throwError(() => new Error('Error deleting category')))
    );
  }
}

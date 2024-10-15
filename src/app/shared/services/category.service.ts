import { Injectable } from '@angular/core';
import { Category } from "../../interfaces/category";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getCategory(id: number): Observable<Category | undefined> {
    return of(this.categories.find((category) => category.id === id));
  }

  addCategory(category: Category): Observable<Category> {
    category.id = this.categories.length + 1;
    this.categories.push(category);
    return of(category);
  }

  updateCategory(category: Category): Observable<Category> {
    const index = this.categories.findIndex((c) => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = category;
    }
    return of(category);
  }

  deleteCategory(id: number): Observable<void> {
    this.categories = this.categories.filter((category) => category.id !== id);
    return of(void 0);
  }
}

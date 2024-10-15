import { Injectable } from '@angular/core';
import { Category } from "../../interfaces/category";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiURL = "https://670e32a8073307b4ee45da4b.mockapi.io/angular-hieudtr8-product-management/categories"

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURL);
  }

  getCategory(id: number): Observable<Category | undefined> {
    return this.http.get<Category>(`${this.apiURL}/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURL, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiURL}/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}

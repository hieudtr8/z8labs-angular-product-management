import { Component, OnInit } from '@angular/core';
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { Category } from "../../../interfaces/category";
import { CategoryService } from "../../../shared/services/category.service";
import { Observable } from "rxjs";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    ...sharedImports,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$!: Observable<Category[]>;  // Observable for categories state

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.categories$;

    this.categoryService.fetchCategories().subscribe();
  }
}

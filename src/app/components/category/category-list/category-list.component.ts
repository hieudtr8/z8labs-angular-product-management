import { Component, OnInit } from '@angular/core';
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { Category } from "../../../interfaces/category";
import { CategoryService } from "../../../shared/services/category.service";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    ...sharedImports,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);
  }

}

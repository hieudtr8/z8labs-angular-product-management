import { Component, OnInit } from '@angular/core';
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { Category } from "../../../interfaces/category";
import { CategoryService } from "../../../shared/services/category.service";
import { Observable } from "rxjs";
import { TableColumn } from "../../../interfaces/table";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent, TextColorDirective } from "@coreui/angular";
import { TableComponent } from "../../../components/table/table.component";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    ...sharedImports,
    TableComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$!: Observable<Category[]>;  // Observable for categories state

  columns: TableColumn<Category>[] = [  // Columns for the table
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
  ];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.categories$;

    this.categoryService.fetchCategories().subscribe();
  }

  // Add a category
  onAdd(): void {
    this.router.navigate(['categories', 'new']);
  }

  // Edit a category
  onEdit(category: Category): void {
    this.router.navigate(['categories', 'edit', category.id]);
  }

  // Delete a category
  onDelete(category: Category): void {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    if (!category.id) return;

    this.categoryService.deleteCategory(category.id).subscribe();
    this.toastr.success('Category deleted successfully');
  }
}

import { Component, OnInit } from '@angular/core';
import { sharedImports } from "../../../shared/imports/shared-imports";
import { Category } from "../../../interfaces/category";
import { CategoryService } from "../../../services/category.service";
import { Observable } from "rxjs";
import { TableColumn } from "../../../interfaces/table";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, ModalModule, RowComponent, TextColorDirective } from "@coreui/angular";
import { TableComponent } from "../../../components/table/table.component";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    ...sharedImports,
    TableComponent,
    ButtonDirective,
    ModalModule
  ],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$!: Observable<Category[]>;  // Observable for categories state
  categoryToDelete: Category | null = null;
  isVisibleModalDelete: boolean = false;

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
    if (!category.id) return;

    this.categoryToDelete = category;
    this.isVisibleModalDelete = true;
  }

  confirmDelete(): void {
    if (!this.categoryToDelete || !this.categoryToDelete.id) return;

    this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe();
    this.toastr.success('Category deleted successfully');

    this.categoryToDelete = null;
    this.isVisibleModalDelete = false;
  }

  cancelDelete(): void {
    this.categoryToDelete = null;
    this.isVisibleModalDelete = false;
  }

  handleVisibleChange(isVisible: boolean): void {
    this.isVisibleModalDelete = isVisible;
  }
}

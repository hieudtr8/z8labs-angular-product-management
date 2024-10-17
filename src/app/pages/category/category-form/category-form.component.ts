import { Component } from '@angular/core';
import { formImports, sharedImports } from "../../../shared/imports/shared-imports";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../../../interfaces/category";
import { ToastrService } from "ngx-toastr";
import { CategoryService } from "../../../services/category.service";

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ...sharedImports,
    ...formImports,
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  categoryForm!: FormGroup;
  isEditMode: boolean = false;
  categoryId?: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Initialize the form
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    // Check if we are in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  // Redirect to category list
  onBack(): void {
    this.router.navigate(['/categories']);
  }

  // Load category detail for editing
  loadCategory(id: number): void {
    this.categoryService.getCategory(id)
      .subscribe(category => {
        if (!category) {
          this.router.navigate(['/categories']);
          return;
        }

        this.categoryForm.patchValue(category);
      });
  }

  // Handle form submission for both adding and updating
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return; // Stop if form is invalid
    }

    const category: Category = this.categoryForm.value;

    if (this.isEditMode) {
      category.id = this.categoryId;
      this.categoryService.updateCategory(category).subscribe(() => {
        this.toastr.success('Category updated successfully');
        this.router.navigate(['/categories']);  // Redirect after updating
      });
    } else {
      this.categoryService.addCategory(category).subscribe(() => {
        this.toastr.success('Category added successfully');
        this.router.navigate(['/categories']);  // Redirect after adding
      });
    }
  }
}

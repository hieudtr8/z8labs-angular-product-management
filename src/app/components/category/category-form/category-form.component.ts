import { Component } from '@angular/core';
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CategoryService } from "../../../shared/services/category.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Category } from "../../../interfaces/category";

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ...sharedImports,
    ReactiveFormsModule
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
    private route: ActivatedRoute
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
        this.router.navigate(['/categories']);  // Redirect after updating
      });
    } else {
      this.categoryService.addCategory(category).subscribe(() => {
        this.router.navigate(['/categories']);  // Redirect after adding
      });
    }
  }
}

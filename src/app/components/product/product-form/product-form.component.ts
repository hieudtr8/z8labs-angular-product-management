import { Component, OnInit } from '@angular/core';
import { Product } from "../../../interfaces/product";
import { ProductService } from "../../../shared/services/product.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { sharedImports } from "../../../shared/helpers/shared-imports";
import { Category } from "../../../interfaces/category";
import { CategoryService } from "../../../shared/services/category.service";
import { Observable } from "rxjs/internal/Observable";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ...sharedImports,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId?: number;
  categories$!: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Load categories from RxJS state management
    this.loadListCategories();

    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      categoryId: [null, Validators.required]
    });

    // Check if we are in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadListCategories(): void {
    this.categories$ = this.categoryService.categories$;

    this.categoryService.fetchCategories().subscribe();
  }

  // Load product details for editing
  loadProduct(id: number): void {
    this.productService.getProduct(id)
      .subscribe(product => {
        if (!product) {
          this.router.navigate(['/products']);
          return;
        }

        this.productForm.patchValue(product);
      });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: Product = this.productForm.value;

    if (this.isEditMode) {
      product.id = this.productId;
      this.productService.updateProduct(product)
        .subscribe(() => this.router.navigate(['/products']));
    } else {
      this.productService.addProduct(product)
        .subscribe(() => this.router.navigate(['/products']));
    }
  }
}

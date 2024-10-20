import { Component, OnInit } from '@angular/core';
import { Product } from "../../../interfaces/product";
import { ProductService } from "../../../services/product.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { formImports, sharedImports } from "../../../shared/imports/shared-imports";
import { Category } from "../../../interfaces/category";
import { CategoryService } from "../../../services/category.service";
import { Observable } from "rxjs/internal/Observable";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ...sharedImports,
    ...formImports,
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId?: string;
  categories$!: Observable<Category[]>;
  imageFile?: File;
  imagePreview?: string;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Load categories from RxJS state management
    this.loadListCategories();

    // Initialize the form
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
      image: [null]
    });

    // Check if we are in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'] as string;
        this.loadProduct(this.productId);
      }
    });
  }
  onBack(): void {
    this.router.navigate(['/products']);
  }

  loadListCategories(): void {
    this.categories$ = this.categoryService.categories$;

    this.categoryService.fetchCategories().subscribe();
  }

  // Load product details for editing
  loadProduct(id: string): void {
    this.productService.getProduct(id)
      .subscribe(product => {
        if (!product) {
          this.router.navigate(['/products']);
          return;
        }

        this.productForm.patchValue(product);
        if (product.imageUrl) {
          this.imagePreview = product.imageUrl;
        }
      });
  }

  // Handle image selection
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files.length === 0) {
      return;
    }

    this.imageFile = files[0];
    this.previewImage();
  }

  // Preview the selected image
  previewImage(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.imageFile!);
  }

  // Handle form submission
  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: Product = this.productForm.value;

    if (this.isEditMode) {
      product.id = this.productId;
      this.productService.updateProduct(product, this.imageFile)
        .subscribe(() => {
          this.toastr.success('Product updated successfully');
          this.router.navigate(['/products'])
        });
    } else {
      this.productService.addProduct(product, this.imageFile)
        .subscribe(() => {
          this.toastr.success('Product added successfully');
          this.router.navigate(['/products'])
        });
    }
  }
}

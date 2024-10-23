import { Component, OnInit } from '@angular/core';
import { Product } from "../../../../interfaces/product";
import { ProductService } from "../../../../services/product.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { formImports, sharedImports } from "../../../../shared/imports/shared-imports";
import { Category } from "../../../../interfaces/category";
import { CategoryService } from "../../../../services/category.service";
import { Observable } from "rxjs/internal/Observable";
import { ToastrService } from "ngx-toastr";
import { IconDirective } from "@coreui/icons-angular";
import { TooltipDirective } from "@coreui/angular";
import { NgOptimizedImage } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ...sharedImports,
    ...formImports,
    IconDirective,
    TooltipDirective,
    NgOptimizedImage
  ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  subscriptions: Subscription[] = [];
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId?: string;
  categories$!: Observable<Category[]>;
  imageFile?: File;
  imagePreview?: string;
  existingImageUrl?: string;

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
      imageUrl: [''],
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
    this.router.navigate(['admin', 'products']);
  }

  loadListCategories(): void {
    this.categories$ = this.categoryService.categories$;

    const subscription = this.categoryService.fetchCategories().subscribe();
    this.subscriptions.push(subscription);
  }

  // Load product details for editing
  loadProduct(id: string): void {
    this.productService.getProduct(id)
      .subscribe(product => {
        if (!product) {
          this.router.navigate(['admin', 'products']);
          return;
        }

        this.productForm.patchValue(product);
        if (product.imageUrl) {
          this.existingImageUrl = product.imageUrl;
        }
      });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    if (files.length > 0) {
      this.imageFile = files[0];
      this.previewImage();
    }
  }

  previewImage(): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.imageFile!);
  }

  removeImage(): void {
    if (this.isEditMode && this.productId) {
      this.productService.removeProductImage(this.productId).subscribe(
        () => {
          this.toastr.success('Product image removed successfully');
          this.existingImageUrl = undefined;
          this.imagePreview = undefined;
          this.imageFile = undefined;
        },
        error => {
          this.toastr.error('Failed to remove product image');
          console.error('Error removing product image:', error);
        }
      );
      return;
    }

    // If we're not in edit mode or don't have a productId, just clear the local state
    this.imagePreview = undefined;
    this.imageFile = undefined;

  }

  // Handle form submission
  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: Product = this.productForm.value;

    // If we're in edit mode, update the product
    if (this.isEditMode) {
      product.id = this.productId;
      this.productService.updateProduct(product, this.imageFile)
        .subscribe(() => {
          this.toastr.success('Product updated successfully');
          this.router.navigate(['admin', 'products'])
        });
      return;
    }

    // Otherwise, add a new product
    this.productService.addProduct(product, this.imageFile)
      .subscribe(() => {
        this.toastr.success('Product added successfully');
        this.router.navigate(['admin', 'products'])
    });
  }
}

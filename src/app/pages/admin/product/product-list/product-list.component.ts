import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from "../../../../services/product.service";
import { filter, map, Observable, Subscription, tap } from 'rxjs';
import { Product } from "../../../../interfaces/product";
import { sharedImports } from "../../../../shared/imports/shared-imports";
import { PaginationState, TableColumn } from "../../../../interfaces/table";
import { NavigationEnd, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TableComponent } from "../../../../components/table/table.component";
import { ProductCategoryService } from "../../../../services/product-category.service";
import { ButtonDirective, ModalModule } from "@coreui/angular";
import { CurrencyPipe } from "../../../../shared/pipe/currency-format.pipe";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ...sharedImports,
    TableComponent,
    ModalModule,
    ButtonDirective
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  products$!: Observable<Product[]>;
  productToDelete: Product | null = null;
  isVisibleModalDelete: boolean = false;
  currencyPipe = inject(CurrencyPipe);

  // Table states
  pageSize: number = 5;
  currentPage: number = 1;
  search: string = '';

  // Table columns
  columns: TableColumn<Product>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price', pipe: (value: number) => this.currencyPipe.transform(value) },
    { key: 'categoryName', label: 'Category Name' },
    { key: 'imageUrl', label: 'Product Image', type: 'image' },
  ];

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const pageSize = localStorage.getItem('productPageSize');
    if (pageSize) this.pageSize = parseInt(pageSize);

    this.products$ = this.productService.products$;

    const subscriptionRoute = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        // Refetch products with categories when navigating back
         const subscriptionFetchProdCate1 = this.productCategoryService.fetchProductsWithCategories().subscribe(
          (updatedProducts) => this.productService.updateProducts(updatedProducts).subscribe()
        );
        this.subscriptions.push(subscriptionFetchProdCate1);
      })
    ).subscribe();
    this.subscriptions.push(subscriptionRoute);

    // Initial load
    const subscriptionFetchProductsInitial = this.productCategoryService.fetchProductsWithCategories().subscribe(
      (updatedProducts) => this.productService.updateProducts(updatedProducts).subscribe()
    );

    this.subscriptions.push(subscriptionFetchProductsInitial);
  }

  deleteProduct(id: string): void {
    const subscriptionDelete = this.productService.deleteProduct(id).subscribe();
    this.subscriptions.push(subscriptionDelete);
  }

  onAdd(): void {
    this.router.navigate(['admin', 'products', 'new']);
  }

  onEdit(product: Product): void {
    this.router.navigate(['admin', 'products', 'edit', product.id]);
  }

  onDelete(product: Product): void {
    if (!product.id) return;

    this.productToDelete = product;
    this.isVisibleModalDelete = true;
  }

  confirmDelete(): void {
    if (!this.productToDelete || !this.productToDelete.id) return;

    this.deleteProduct(this.productToDelete.id);
    this.toastr.success('Product deleted successfully');

    this.productToDelete = null;
    this.isVisibleModalDelete = false;
  }

  cancelDelete(): void {
    this.productToDelete = null;
    this.isVisibleModalDelete = false;
  }

  handleVisibleChange(isVisible: boolean): void {
    this.isVisibleModalDelete = isVisible;
  }

  onPageChange(pageState: PaginationState): void {
    this.currentPage = pageState.currentPage;
    this.pageSize = pageState.pageSize
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    localStorage.setItem('productPageSize', newSize.toString());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

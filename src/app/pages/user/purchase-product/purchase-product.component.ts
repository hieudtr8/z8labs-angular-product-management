import { Component, inject } from '@angular/core';
import { Product } from "../../../interfaces/product";
import { filter, Observable, Subscription, tap } from "rxjs";
import { ProductService } from "../../../services/product.service";
import { NavigationEnd, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ProductCategoryService } from "../../../services/product-category.service";
import { formImports, sharedImports } from "../../../shared/imports/shared-imports";
import { ButtonModule, ModalModule } from "@coreui/angular";
import { CurrencyPipe } from "../../../shared/pipe/currency-format.pipe";
import { UserPurchase } from "../../../interfaces/user-purchase";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { UserPurchaseService } from "../../../services/user-purchase.service";

@Component({
  selector: 'app-purchase-product',
  standalone: true,
  imports: [
    ...sharedImports,
    ...formImports,
    CurrencyPipe,
    ModalModule
  ],
  templateUrl: './purchase-product.component.html',
  styleUrl: './purchase-product.component.scss'
})
export class PurchaseProductComponent {
  private subscriptions: Subscription[] = [];
  public router = inject(Router);
  public toastr = inject(ToastrService);

  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private userPurchaseService = inject(UserPurchaseService);
  private productCategoryService = inject(ProductCategoryService);
  private fb = inject(FormBuilder);

  public products$!: Observable<Product[]>;
  public productToPurchase: Product | null = null;
  public isVisibleModalPurchase: boolean = false;
  public productPurchaseForm!: FormGroup;

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    const subscriptionFetchProduct = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        // Refetch products with categories when navigating back
        const subscriptionOnNav = this.productCategoryService.fetchProductsWithCategories().subscribe(
          (updatedProducts) => this.productService.updateProducts(updatedProducts).subscribe()
        );

        this.subscriptions.push(subscriptionOnNav);
      })
    ).subscribe();
    this.subscriptions.push(subscriptionFetchProduct);

    // Initial load
    const subscriptionInital = this.productCategoryService.fetchProductsWithCategories().subscribe(
      (updatedProducts) => this.productService.updateProducts(updatedProducts).subscribe()
    );
    this.subscriptions.push(subscriptionInital);
  }

  onPurchase(product: Product): void {
    this.productToPurchase = product;
    this.isVisibleModalPurchase = true;

    // Initialize form
    this.productPurchaseForm = this.fb.group({
      userId: [this.authService.currentUserSig()?.id],
      productId: [product.id],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [product.price, Validators.required]
    });
  }

  cancelPurchase(): void {
    this.productToPurchase = null;
    this.isVisibleModalPurchase = false;
    this.productPurchaseForm.reset();
  }

  confirmPurchase(): void {
    const purchaseData: UserPurchase = {
      userId: this.productPurchaseForm.get('userId')?.value,
      productId: this.productPurchaseForm.get('productId')?.value,
      quantity: this.productPurchaseForm.get('quantity')?.value,
      total: this.productPurchaseForm.get('total')?.value,
      productName: this.productToPurchase?.name || 'Unknown',
      userName: this.authService.currentUserSig()?.username || 'Unknown',
      createdAt: new Date()
    }

    this.userPurchaseService.purchaseProduct(purchaseData).subscribe(() => {
      this.toastr.success('Product purchased successfully');
      this.productToPurchase = null;
      this.isVisibleModalPurchase = false;
      this.productPurchaseForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

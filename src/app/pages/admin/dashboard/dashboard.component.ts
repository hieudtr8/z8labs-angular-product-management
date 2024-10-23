import { Component, inject, OnInit } from '@angular/core';
import { Product } from "../../../interfaces/product";
import { Category } from "../../../interfaces/category";
import { ProductService } from "../../../services/product.service";
import { CategoryService } from "../../../services/category.service";
import { sharedImports } from "../../../shared/imports/shared-imports";
import { combineLatest, map, Observable, Subscription } from "rxjs";
import { PieChartComponent } from "../../../components/pie-chart/pie-chart.component";
import { CalendarEvent, CalendarModule } from "angular-calendar";
import { UserPurchaseService } from "../../../services/user-purchase.service";
import { UserPurchase } from "../../../interfaces/user-purchase";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ...sharedImports,
    PieChartComponent,
    CalendarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Services
  productService: ProductService = inject(ProductService);
  categoryService: CategoryService = inject(CategoryService);
  userPurchaseService: UserPurchaseService = inject(UserPurchaseService);

  // subscriptions
  subscriptions: Subscription[] = [];

  // Observables
  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;
  allUserPurchases$!: Observable<UserPurchase[]>;

  // Chart data
  chartData: number[] = [];
  chartLabels: string[] = [];

  // Calendar data
  viewDate: Date = new Date();
  events!: CalendarEvent[];

  constructor() { }

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.categories$ = this.categoryService.categories$;
    this.allUserPurchases$ = this.userPurchaseService.allUserPurchases$;

    const subscribeFetchProd = this.productService.fetchProducts().subscribe();
    this.subscriptions.push(subscribeFetchProd);
    const subscribeFetchCategories = this.categoryService.fetchCategories().subscribe();
    this.subscriptions.push(subscribeFetchCategories);
    const subscribeFetchAllUserPurchases = this.userPurchaseService.fetchAllUserPurchases().subscribe();
    this.subscriptions.push(subscribeFetchAllUserPurchases);

    this.populateChartProductByCategoriesData();

    this.populateCalendarEventsUserPurchasesByDate();
  }

  populateChartProductByCategoriesData(): void {
    const subscribeCombine = combineLatest([this.categories$, this.products$])
      .pipe(
        map(([categories, products]) => {
          return categories.map(category => ({
            name: category.name,
            count: products.filter(product => product.categoryId === category.id).length
          }));
        })
      )
      .subscribe(data => {
        this.chartLabels = data.map(item => item.name);
        this.chartData = data.map(item => item.count);
      });

    this.subscriptions.push(subscribeCombine);
  }

  populateCalendarEventsUserPurchasesByDate(): void {
    const subscribeCombine = combineLatest([this.allUserPurchases$])
      .pipe(
        map(([userPurchases]) => {
          return userPurchases.map(userPurchase => ({
            title: `${userPurchase.quantity} "${userPurchase.productName || 'Unknown Product'}" was purchased by ${userPurchase.userName || 'Unknown'}`,
            start: userPurchase.createdAt as Date,
          }));
        })
      )
      .subscribe(data => {
        this.events = data;
      });

    this.subscriptions.push(subscribeCombine);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

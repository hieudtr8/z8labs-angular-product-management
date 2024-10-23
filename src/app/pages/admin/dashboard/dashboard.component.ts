import { Component, OnInit } from '@angular/core';
import { Product } from "../../../interfaces/product";
import { Category } from "../../../interfaces/category";
import { ProductService } from "../../../services/product.service";
import { CategoryService } from "../../../services/category.service";
import { sharedImports } from "../../../shared/imports/shared-imports";
import { combineLatest, map, Observable, Subscription } from "rxjs";
import { PieChartComponent } from "../../../components/pie-chart/pie-chart.component";
import { CalendarEvent, CalendarModule } from "angular-calendar";

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
  subscriptions: Subscription[] = [];
  products$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;
  chartData: number[] = [];
  chartLabels: string[] = [];
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      title: 'Draggable event',
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      },
      start: new Date(),
      draggable: true,
    },
    {
      title: 'A non draggable event',
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
      },
      start: new Date(),
    },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.categories$ = this.categoryService.categories$;

    const subscribeFetchProd = this.productService.fetchProducts().subscribe();
    this.subscriptions.push(subscribeFetchProd);
    const subscribeFetchCategories = this.categoryService.fetchCategories().subscribe();
    this.subscriptions.push(subscribeFetchCategories);

    this.populateChartProductByCategoriesData();
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

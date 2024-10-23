import { Component, inject } from '@angular/core';
import { sharedImports } from "../../../shared/imports/shared-imports";
import { TableComponent } from "../../../components/table/table.component";
import { UserPurchase } from "../../../interfaces/user-purchase";
import { filter, Observable, Subscription, tap } from "rxjs";
import { TableColumn } from "../../../interfaces/table";
import { UserPurchaseService } from "../../../services/user-purchase.service";
import { NavigationEnd, Router } from "@angular/router";
import { DateFormatPipe } from "../../../shared/pipe/date-format.pipe";
import { CurrencyPipe } from "../../../shared/pipe/currency-format.pipe";

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [
    ...sharedImports,
    TableComponent,
  ],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent {
  subscriptions: Subscription[] = [];
  userPurchaseService = inject(UserPurchaseService);
  userPurchasesCurrentUser$: Observable<UserPurchase[]> = this.userPurchaseService.userPurchasesCurrentUser$;
  router = inject(Router);
  dateFormatPipe = inject(DateFormatPipe);
  currencyPipe = inject(CurrencyPipe);

  columns: TableColumn<UserPurchase>[] = [
    { key: 'createdAt', label: 'Date Purchased', pipe: (value: Date) => this.dateFormatPipe.transform(value) },
    { key: 'productName' , label: 'Product' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'total', label: 'Total', pipe: (value: number) => this.currencyPipe.transform(value) }
  ]

  constructor() { }

  ngOnInit(): void {
    const subscriptionRoute = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        // Refetch products with categories when navigating back
        const subscriptionFetchUserPurchase = this.userPurchaseService.fetchUserPurchasesOfCurrentUser().subscribe();
        this.subscriptions.push(subscriptionFetchUserPurchase);
      })
    ).subscribe();

    this.subscriptions.push(subscriptionRoute);

    const subscriptionFetchList = this.userPurchaseService.fetchUserPurchasesOfCurrentUser().subscribe();
    this.subscriptions.push(subscriptionFetchList);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

import { Component, inject } from '@angular/core';
import { sharedImports } from "../../../shared/imports/shared-imports";
import { TableComponent } from "../../../components/table/table.component";
import { UserPurchase } from "../../../interfaces/user-purchase";
import { filter, Observable, tap } from "rxjs";
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
  userPurchases$!: Observable<UserPurchase[]>;
  userPurchaseService = inject(UserPurchaseService);
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
    this.userPurchases$ = this.userPurchaseService.userPurchases$;
    this.userPurchaseService.fetchUserPurchasesWithProducts().subscribe(
      (userPurchases) => this.userPurchaseService.updateUserPurchases(userPurchases).subscribe()
    );
  }
}

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonModule, ModalModule } from "@coreui/angular";
import { UserPurchase } from "../../interfaces/user-purchase";
import { formImports, sharedImports } from "../../shared/imports/shared-imports";
import { DateFormatPipe } from "../../shared/pipe/date-format.pipe";
import { CurrencyPipe } from "../../shared/pipe/currency-format.pipe";
import { Router } from "@angular/router";

@Component({
  selector: 'app-modal-purchase-success',
  standalone: true,
  imports: [
    ...sharedImports,
    ...formImports,
    ModalModule,
    ButtonModule,
  ],
  templateUrl: './modal-purchase-success.component.html',
  styleUrl: './modal-purchase-success.component.scss'
})
export class ModalPurchaseSuccessComponent {
  dateFormatPipe = inject(DateFormatPipe);
  currencyPipe = inject(CurrencyPipe);
  router = inject(Router);

  @Input() visible: boolean = false;
  @Input() userPurchase: UserPurchase | null = null;

  @Output() close = new EventEmitter<void>();

  toPurchaseHistory() {
    this.router.navigate(['user/purchase-history']);
    this.close.emit();
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from "../../interfaces/table";
import { CurrencyPipe } from "../../shared/pipe/currency-format.pipe";
import { ButtonDirective, TableActiveDirective, TableColorDirective, TableDirective, TableModule, TooltipDirective } from "@coreui/angular";
import { IconDirective } from "@coreui/icons-angular";
import { DateFormatPipe } from "../../shared/pipe/date-format.pipe";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    TableModule,
    ButtonDirective,
    IconDirective,
    TooltipDirective,
    DateFormatPipe
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() noAction: boolean = false;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  onAdd(): void {
    this.add.emit();
  }

  onEdit(item: T): void {
    this.edit.emit(item);
  }

  onDelete(item: T): void {
    this.delete.emit(item);
  }
}

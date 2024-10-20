import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from "../../interfaces/table";
import { CurrencyPipe } from "../../shared/pipe/currency-format.pipe";
import { ButtonDirective, TableActiveDirective, TableColorDirective, TableDirective, TooltipDirective } from "@coreui/angular";
import { IconDirective } from "@coreui/icons-angular";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    TableDirective,
    TableColorDirective,
    TableActiveDirective,
    ButtonDirective,
    IconDirective,
    TooltipDirective
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];

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

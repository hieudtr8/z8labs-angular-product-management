import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from "../../interfaces/table";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
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

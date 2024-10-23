import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective, FormModule, PaginationModule, TableModule, TooltipDirective } from "@coreui/angular";
import { IconDirective } from "@coreui/icons-angular";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

import { PaginationState, TableColumn } from "../../interfaces/table";

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonDirective,
    IconDirective,
    TooltipDirective,
    FormsModule,
    FormModule,
    PaginationModule,
    RouterLink,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() noAction: boolean = false;
  @Input() pageSize: number = 10;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<PaginationState>();

  pageSizes: number[] = [1, 2, 5, 10, 20, 50, 100];
  search: string = '';
  currentPage: number = 1;
  filteredData: T[] = [];

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedData(): T[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Number(startIndex) + Number(this.pageSize);
    return this.filteredData.slice(startIndex, endIndex);
  }

  ngOnInit(): void {
    this.filterData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['pageSize']) {
      this.filterData();
    }
  }

  filterData(): void {
    if (!this.search) {
      this.filteredData = [...this.data];
    } else {
      const searchLower = this.search.toLowerCase();
      this.filteredData = this.data.filter(item => {
        return this.columns.some(column => {
          const value = String(item[column.key] || '').toLowerCase();
          return value.includes(searchLower);
        });
      });
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    this.emitPageState();
  }

  onSearch(value: string): void {
    this.search = value;
    this.currentPage = 1; // Reset to first page when searching
    this.filterData();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.emitPageState();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page when changing page size
    this.filterData();
    this.pageSizeChange.emit(newSize);
  }

  private emitPageState(): void {
    this.pageChange.emit({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalItems: this.filteredData.length
    });
  }

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

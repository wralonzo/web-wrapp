import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnConfig, FilterConfig, TableActionEvent } from '@shared/models/table';
import { CustomSelectComponent } from '../select/select.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent],
  templateUrl: './table-list.component.html',
})
export class TableListComponent {
  columns = input.required<ColumnConfig[]>();
  data = input.required<any[]>();
  filters = input<FilterConfig[]>([]);
  onAction = output<TableActionEvent>();

  totalItems = input<number>(0);
  totalPages = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(0);

  sortKey = signal<string>('');
  sortDir = signal<'asc' | 'desc'>('asc');

  searchTerm = input<string>('');
  onSearch = output<string>();
  onPageSizeChange = output<number>();

  // Outputs (Eventos)
  onPageChange = output<number>();
  onSort = output<{ key: string; dir: 'asc' | 'desc' }>();
  onFilter = output<Record<string, any>>();

  private searchSubject = new Subject<string>();
  private pageSizeSubject = new Subject<number>();

  constructor() {
    // Configuramos el debounce en el constructor
    this.searchSubject
      .pipe(
        debounceTime(500), // Espera 400ms después de la última tecla
        distinctUntilChanged(), // Solo emite si el texto cambió respecto al anterior
        takeUntilDestroyed() // Evita fugas de memoria (limpia al destruir el componente)
      )
      .subscribe((value) => {
        this.onSearch.emit(value);
      });

    this.pageSizeSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        this.onPageSizeChange.emit(value);
      });
  }

  emitAction(type: string, item: any) {
    this.onAction.emit({ type, item });
  }

  toggleSort(key: string) {
    const dir = this.sortKey() === key && this.sortDir() === 'asc' ? 'desc' : 'asc';
    this.sortKey.set(key);
    this.sortDir.set(dir);
    this.onSort.emit({ key, dir });
  }

  handleFilterChange(key: string, value: any) {
    const filterUpdate = { [key]: value };
    console.log('Filtro cambiado:', filterUpdate);
    this.onFilter.emit(filterUpdate);
  }

  handleSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value); // Enviamos el valor al Subject en lugar de emitir directo
  }

  handlePageSizeChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.pageSizeSubject.next(Number(value)); // Enviamos el valor al Subject en lugar de emitir directo
  }

  // Método para limpiar búsqueda (reset inmediato)
  clearSearch() {
    this.searchSubject.next('');
    this.onSearch.emit('');
  }
}

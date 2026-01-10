import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { APP_ROUTES } from '@core/constants/routes.constants';
import { ConfirmService } from '@core/services/confirm.service';
import { ProductService } from '@core/services/product.service';
import { DownloadExcelTemplateService } from '@core/services/products/dowload-excel.template.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TableListComponent } from '@shared/components/table-list/table-list.component';
import { Product } from '@shared/models/product/produt-response.interface';
import { SelectOption } from '@shared/models/select/option.interface';
import { FilterConfig, TableActionEvent, ColumnConfig } from '@shared/models/table';
import { skip, debounceTime, distinctUntilChanged } from 'rxjs';
import { PageConfiguration } from 'src/app/page-configurations';
import { ModalComponent } from '@shared/components/modal-form/modal.component';
import { ImportProduct } from '@shared/models/product/response-import.interface';
import { CategoryService } from '@core/services/products/category.service';
import { HttpResponseApi } from '@assets/retail-shop/HttpResponseApi';
import { PaginatedResponse } from '@assets/retail-shop/PaginatedResponse';
import { Category } from '@shared/models/category/category.interface';

@Component({
  selector: 'app-list',
  imports: [CommonModule, FormsModule, ButtonComponent, TableListComponent, ModalComponent],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss',
  providers: [ProductService, DownloadExcelTemplateService, CategoryService],
  standalone: true,
})
export class ListProductComponent extends PageConfiguration {
  private readonly confirmService = inject(ConfirmService);
  private readonly productService = inject(ProductService);
  private readonly downloadExcelTemplateService = inject(DownloadExcelTemplateService);
  private readonly categoryService = inject(CategoryService);

  public totalItems = signal(0);
  public currentPage = signal(0);
  public totlPages = signal(0);
  public pageSize = signal(10);
  public loading = signal(false);
  public selectedFile = signal<File | null>(null);
  public isUploading = false;
  public showModal = signal(false);
  public importResponse = signal<ImportProduct | null>(null);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private activeParams = signal<Record<string, any>>({
    sort: 'id,desc',
  });
  public products = signal<Array<Product>>([]);
  public searchQuery = signal('');

  public filters = signal<FilterConfig[]>([
    {
      key: 'categoryId',
      label: 'Categorías',
      selectedName: 'todos',
      options: [{ value: 'ALL', label: 'Todos' }],
    },
  ]);

  public tableColumns: ColumnConfig[] = [
    { key: 'sku', label: 'SKU', type: 'text', sortable: true },
    { key: 'name', label: 'Nombre', type: 'text', sortable: true },
    { key: 'priceSale', label: 'Precio', type: 'currency', sortable: true },
    { key: 'stockMinim', label: 'Stock alerta', type: 'badge', sortable: true },
    { key: 'active', label: 'Estado', type: 'boolean', sortable: true },
    { key: 'actions', label: '', type: 'action' },
  ];

  constructor() {
    super();
    toObservable(this.searchQuery)
      .pipe(
        skip(1), // <--- IMPORTANTE: Ignora el valor inicial al cargar
        debounceTime(2000), // 400ms es más natural que 2000ms
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadData();
      });

    // 2. Manejo de tamaño de página (sin debounce o muy corto)
    toObservable(this.pageSize)
      .pipe(
        skip(1), // <--- Ignora el valor inicial
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.currentPage.set(0);
        this.loadData();
      });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
  }

  handleTableAction(event: TableActionEvent) {
    const { type, item } = event;

    switch (type) {
      case 'edit':
        this.goToEdit(item);
        break;
      case 'delete':
        this.confirmDelete(item);
        break;
      case 'view':
        this.goToView(item);
        break;
      default:
        this.logger.warnign('Acción no reconocida:', type);
    }
  }

  public filtered = computed(() => {
    this.searchQuery().toLowerCase().trim();
    return this.products();
  });

  public add(): void {
    this.nav.push(APP_ROUTES.nav.products.add);
  }

  private goToEdit(product: Product) {
    this.logger.log('Navegando a editar producto con ID:', product.id);
    this.nav.push(APP_ROUTES.nav.products.edit(product.id!));
  }

  private goToView(product: Product) {
    this.logger.log('Navegando a ver producto con ID:', product.id);
    this.nav.push(APP_ROUTES.nav.products.view(product.id!));
  }

  private async confirmDelete(data: Product) {
    const confirmed = await this.confirmService.open({
      title: 'Desactivar Producto',
      message: `¿Estás seguro de desactivar ${data.sku} ${data.name}?`,
      btnConfirmText: 'Sí, desactivar',
      btnCancelText: 'No, cancelar',
      variant: 'danger',
    });
    if (confirmed) {
      this.productService.delete(data.id!).subscribe({
        next: () => {
          this.products.update((currentProducts) =>
            currentProducts.map((product) => {
              product.active = false;
              data.active = false;
              return product.id === data.id ? { ...product, ...data } : product;
            })
          );
          this.toast.show('Producto Desactivado', 'success');
        },
      });
    }
  }

  handleFilter(filterUpdate: Record<string, any>) {
    // 1. Extraemos la llave y el valor (ej: key='status', value='VIP')
    const [key, value] = Object.entries(filterUpdate)[0] as [string, SelectOption];
    this.logger.info('Filtro cambiado:', { key, value });
    if (value.value === 'ALL') {
      value.value = '';
    }
    this.activeParams.update((prev) => ({ ...prev, [key]: value.value }));
    this.filters()[0].selectedName = String(value.value);
    this.currentPage.set(0);
    this.loadData();
  }

  handleSort(event: { key: string; dir: 'asc' | 'desc' }) {
    this.activeParams.update((prev) => ({
      sort: `${event.key},${event.dir}`,
    }));
    this.logger.info('Ordenando por:', event);
    this.loadData();
  }

  handlePage(page: number) {
    this.currentPage.set(page);
    this.loadData();
  }

  public async loadData() {
    this.loading.set(true);

    try {
      const url = `/products?term=${this.searchQuery()}&active=${true}&page=${this.currentPage()}&size=${this.pageSize()}&sort=${
        this.activeParams()['sort'] ?? 'name,desc'
      }`;
      const response: PaginatedResponse<Product> = await this.rustSerive.call(async (bridge) => {
        return await bridge.get(url);
      });
      this.logger.log('response', response);
      this.products.set(response.content);
      this.totalItems.set(Number(response.totalElements));
      this.totlPages.set(response.totalPages);
    } catch (error: any) {
      this.logger.error(this.loadData.name, error);
      this.toast.show(error?.payload.message! ?? 'El servidor no response');
    } finally {
      this.loading.set(true);
    }
  }

  public async loadCategories() {
    try {
      const response: PaginatedResponse<Category> = await this.rustSerive.call(async (bridge) => {
        return await bridge.get('/category');
      });
      this.logger.info('Categorias', response);
      const data: SelectOption[] = response.content.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      this.filters()[0].options.push(...data);
    } catch (error: any) {
      this.logger.error('error', error.toString());
    }
  }

  public download() {
    return this.downloadExcelTemplateService.getFile();
  }

  // 1. Capturar el archivo cuando el usuario lo selecciona
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      return this.selectedFile.set(file);
    }
    return this.selectedFile.set(null);
  }

  onUpload() {
    if (!this.selectedFile()) {
      this.toast.show('Seleccione un archivo', 'success');
      return;
    }

    this.isUploading = true;
    this.productService.importProducts(this.selectedFile()!).subscribe({
      next: (report) => {
        this.importResponse.set(report.data as ImportProduct);
        this.resetFileInput();
        this.loadData();
      },
      complete: () => {
        this.isUploading = false;
      },
    });
  }

  onCancel() {
    this.showModal.set(false);
    this.resetFileInput();
    this.importResponse.set(null);
  }

  formFile() {
    this.showModal.set(true);
    this.resetFileInput();
  }

  private resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFile.set(null);
  }

  validatebutton(): boolean {
    if (!this.selectedFile() && !this.importResponse()) {
      return false;
    }
    if (this.selectedFile() && !this.importResponse()) {
      return true;
    }
    return true;
  }
}

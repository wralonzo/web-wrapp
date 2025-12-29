export interface ColumnConfig {
  key: string; // El nombre de la propiedad en el objeto (ej: 'firstName')
  label: string; // El título que verá el usuario (ej: 'Nombre')
  type?: 'text' | 'currency' | 'date' | 'badge' | 'action'; // Formato
  sortable?: boolean; // Si la columna es ordenable
}

export interface FilterConfig {
  key: string;
  label: string;
  options: { label: string; value: any }[];
}

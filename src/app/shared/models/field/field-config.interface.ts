// Representa una opción individual
export interface SelectOption<T = any> {
  label: string;
  value: T;
}

// Interfaz genérica
export interface FieldConfig<T = any> {
  name: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'tel';
  required?: boolean;
  valueDefault?: T; // El valor por defecto ahora es del tipo T
  colSpan?: 1 | 2;
  placeholder?: string;
  endpoint?: string;

  // Opciones estáticas tipadas
  options?: SelectOption<T>[];

  // Transformación de API tipada
  mapResponse?: (data: any) => SelectOption<T>[];
}

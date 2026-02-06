import { Product } from '../product/produt-response.interface';

export interface ProductBundle {
    id?: number;
    parentProduct?: Product;
    parentProductId: number;
    componentProduct?: Product;
    componentProductId: number;
    quantity: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    type?: string;
    brand: string;
    quantityInStock?: number;
}
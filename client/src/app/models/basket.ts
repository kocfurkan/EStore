export interface CartItem {
    productId: number;
    name: string;
    price: number;
    pictureUrl: string;
    brand: string;
    type: string;
    quantity: number;
}

export interface Cart {
    id: number;
    customerId: string;
    cartItems: CartItem[];
}
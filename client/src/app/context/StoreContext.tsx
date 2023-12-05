//LEGACY CODE WILL BE DELETED


import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Cart } from "../models/basket";

// Define the structure of the context value
interface StoreContextValue {
    // The current shopping cart state or null if not initialized
    cart: Cart | null;
    setCart: (cart: Cart) => void;
    removeItem: (productId: number, quantity: number) => void;
}

// Create a context with an initial value of undefined
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// Custom hook to access the context value
export function useStoreContext() {
    /*
     * useStoreContext
     * - Custom hook to access the StoreContext value
     * - useContext is a React hook that retrieves the current context value
     * - Throws an error if used outside of the context provider
     */
    const context = useContext(StoreContext);

    if (context === undefined) {
        throw Error('useStoreContext must be used within a StoreProvider');
    }

    return context;
}

// Context provider component
export function StoreProvider({ children }: PropsWithChildren<any>) {
    /*
     * StoreProvider
     * - Component responsible for providing the StoreContext to its descendants
     * - Manages the shopping cart state using the useState hook
     * - Defines a function (removeItem) to remove items from the shopping cart
     * - Returns a context provider wrapping its children with access to the context value
     */

    // State to manage the shopping cart
    const [cart, setCart] = useState<Cart | null>(null);

    // Function to remove items from the shopping cart
    function removeItem(productId: number, quantity: number) {
        if (!cart) return;

        const updatedItems = cart.cartItems.map(item => {
            if (item.productId === productId) {
                const newQuantity = Math.max(0, item.quantity - quantity);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });

        setCart({
            ...cart,
            cartItems: updatedItems.filter(item => item.quantity > 0)
        });
    }
    // Return the context provider with the context value
    return (
        <StoreContext.Provider value={{ cart, setCart, removeItem }}>
            {children}
        </StoreContext.Provider>
    );
}

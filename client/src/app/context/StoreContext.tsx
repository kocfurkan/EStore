import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Cart } from "../models/basket";

// Define the structure of the context value
interface StoreContextValue {
    // The current shopping cart state or null if not initialized
    cart: Cart | null;
    // Function to update the shopping cart state
    setCart: (cart: Cart) => void;
    // Function to remove items from the shopping cart based on productId and quantity
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
        /*
         * removeItem
         * - Dont mutate the state but work on copy of it
         * - Function to remove items from the shopping cart
         * - Checks if the cart is initialized
         * - Creates a copy of the cart items array
         * - Finds the index of the item in the array based on the productId
         * - Updates the item's quantity and removes it if necessary
         * - Updates the shopping cart state using setCart
         */
        if (!cart) return;

        const items = [...cart.cartItems];
        const itemIndex = items.findIndex(i => i.productId === productId);

        if (itemIndex >= 0) {
            items[itemIndex].quantity -= quantity;
            if (items[itemIndex].quantity === 0) {
                items.splice(itemIndex, 1);
            }

            setCart(prevState => {
                return { ...prevState!, items };
            });
        }
    }

    // Return the context provider with the context value
    return (
        <StoreContext.Provider value={{ cart, setCart, removeItem }}>
            {children}
        </StoreContext.Provider>
    );
}

import { create } from "zustand";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

type CartItemPayload = {
    id: string;
};

export interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

export interface CartActions {
    increase: (payload: CartItemPayload) => void;
    decrease: (payload: CartItemPayload) => void;
    removeItem: (payload: CartItemPayload) => void;
    clearCart: () => void;
    calculateTotals: () => void;
}

export type CartStore = CartState & CartActions;

const initialState: CartState = {
    cartItems: cartItems.map((item) => ({ ...item })),
    amount: 0,
    total: 0,
};

const useCartStore = create<CartStore>((set) => ({
    ...initialState,
    increase: ({ id }) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.id === id ? { ...item, amount: item.amount + 1 } : item,
            ),
        })),
    decrease: ({ id }) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.id === id ? { ...item, amount: item.amount - 1 } : item,
            ),
        })),
    removeItem: ({ id }) =>
        set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
    clearCart: () =>
        set(() => ({
            cartItems: [],
        })),
    calculateTotals: () =>
        set((state) => {
            const { amount, total } = state.cartItems.reduce(
                (totals, item) => ({
                    amount: totals.amount + item.amount,
                    total: totals.total + item.amount * item.price,
                }),
                { amount: 0, total: 0 },
            );

            return { amount, total };
        }),
}));

export default useCartStore;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
};

const initialState: CartState = {
    cartItems: cartItems,
    amount: 0,
    total: 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        //증가
        increase: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
            if (item) {
                item.amount += 1;
            }
        },
        //감소
        decrease: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
            if (item) {
                item.amount -= 1;
            }
        },
        //삭제
        removeItem: (state, action: PayloadAction<{ id: string }>) => {
            const itemId = action.payload.id;
            state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== itemId);
        },
        //초기화
        clearCart: (state) => {
            state.cartItems = [];
        },
        //총 가격과 총 수량 계산
        calculateTotals: (state) => {
            let total = 0;
            let amount = 0;
            state.cartItems.forEach((item) => {
                total += item.price * item.amount;
                amount += item.amount;
            });
            state.total = total;
            state.amount = amount;
        }
    },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } = cartSlice.actions;

const cartReducer = cartSlice.reducer;

export default cartReducer;
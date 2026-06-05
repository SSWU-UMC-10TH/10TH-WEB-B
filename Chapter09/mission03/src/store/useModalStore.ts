import { create } from "zustand";
import useCartStore from "./useCartStore";

export interface ModalState {
    isOpen: boolean;
}

export interface ModalActions {
    openModal: () => void;
    closeModal: () => void;
    clearCartAndCloseModal: () => void;
}

export type ModalStore = ModalState & ModalActions;

const initialState: ModalState = {
    isOpen: false,
};

const useModalStore = create<ModalStore>((set) => ({
    ...initialState,
    openModal: () =>
        set(() => ({
            isOpen: true,
        })),
    closeModal: () =>
        set(() => ({
            isOpen: false,
        })),
    clearCartAndCloseModal: () =>
        set(() => {
            useCartStore.getState().clearCart();

            return {
                isOpen: false,
            };
        }),
}));

export default useModalStore;

import {create} from 'zustand';

// the Stores are not the same thing
interface useStoreModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onCose: () => void;
};

export const useStoreModal = create<useStoreModalStore> ((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));
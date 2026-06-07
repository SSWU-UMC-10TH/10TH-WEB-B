import type {AppDispatch, RootState} from '../store/store';
import type {TypedUseSelectorHook} from 'react-redux';
import {useDispatch as useDefaultDispatch, useSelector as useDefaultSelector} from 'react-redux';

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;
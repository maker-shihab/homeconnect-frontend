import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * টাইপ-সহ useDispatch ব্যবহারের জন্য এই হুকটি ব্যবহার করুন
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * টাইপ-সহ useSelector ব্যবহারের জন্য এই হুকটি ব্যবহার করুন
 * এখন আপনাকে '(state: RootState)' লিখতে হবে না
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
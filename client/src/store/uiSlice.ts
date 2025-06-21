import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  notification: {
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  modal: {
    open: boolean;
    type: string | null;
    data: any;
  };
}

const initialState: UIState = {
  sidebarOpen: false,
  darkMode: false,
  notification: {
    open: false,
    message: '',
    type: 'info',
  },
  modal: {
    open: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.notification.open = true;
      state.notification.message = action.payload.message;
      state.notification.type = action.payload.type;
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    openModal: (
      state,
      action: PayloadAction<{
        type: string;
        data?: any;
      }>
    ) => {
      state.modal.open = true;
      state.modal.type = action.payload.type;
      state.modal.data = action.payload.data || null;
    },
    closeModal: (state) => {
      state.modal.open = false;
      state.modal.type = null;
      state.modal.data = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setDarkMode,
  showNotification,
  hideNotification,
  openModal,
  closeModal,
} = uiSlice.actions;

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectDarkMode = (state: RootState) => state.ui.darkMode;
export const selectNotification = (state: RootState) => state.ui.notification;
export const selectModal = (state: RootState) => state.ui.modal;

export default uiSlice.reducer;
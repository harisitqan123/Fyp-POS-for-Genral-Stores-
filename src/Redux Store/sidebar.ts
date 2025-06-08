// Redux Store/SideBar Slice/sidebarSlice.ts

import { createSlice } from '@reduxjs/toolkit';

interface SidebarState {
  isExpanded: boolean;
  inventoryExpended?: boolean; // Optional property for inventory expansion
}

const initialState: SidebarState = {
  isExpanded: true, // Sidebar is expanded by default
  inventoryExpended: false, // Optional property to track inventory expansion state
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    expandSidebar: (state) => {
      state.isExpanded = true;
    },
    collapseSidebar: (state) => {
      state.isExpanded = false;
    },
    toggleInventory: (state) => {
      state.inventoryExpended = !state.inventoryExpended; // Toggle inventory expansion state
    },
  },
});

export const { toggleSidebar, expandSidebar, collapseSidebar,toggleInventory } = sidebarSlice.actions;

export default sidebarSlice.reducer;

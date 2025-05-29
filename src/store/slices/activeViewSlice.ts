// src/store/slices/activeViewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveViewState {
  view: string;
  expandedMenus: string[];
  sku: string;
}

const initialState: ActiveViewState = {
  view: "dashboard", // Default view
  sku: "", // Default SKU
  expandedMenus: [], // Store which menus are expanded
};

const activeViewSlice = createSlice({
  name: "activeView",
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<string>) => {
      state.view = action.payload;
    },
    setProductDetails: (state, action: PayloadAction<string>) => {
        state.view = "product details";
        state.sku = action.payload; // Store SKU of selected product
      },
    toggleMenuExpansion: (state, action: PayloadAction<string>) => {
      const menuLabel = action.payload;
      if (state.expandedMenus.includes(menuLabel)) {
        state.expandedMenus = state.expandedMenus.filter(
          (item) => item !== menuLabel
        );
      } else {
        state.expandedMenus.push(menuLabel);
      }
    },
  },
});

export const { setActiveView, toggleMenuExpansion,setProductDetails } = activeViewSlice.actions;
export default activeViewSlice.reducer;

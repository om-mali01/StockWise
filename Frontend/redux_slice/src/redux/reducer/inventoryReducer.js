import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inventories: [],
  message: null,
  error: null,
  loading: false,
  categories: [],
  subcategories: [],
  inventory: [],
  stockStatus: [],
  lowStockStatus: [],
  transactions: []
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {

    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
        state.message = null;
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },

    setMessage: (state, action) => {
      state.message = action.payload;
      state.error = null;
    },

    clearMessages: (state) => {
      state.message = null;
      state.error = null;
    },

    addInventory: (state, action) => {
      state.inventories.push(action.payload);
    },

    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setSubcategories: (state, action) => {
      state.subcategories = action.payload;
    },

    setInventories: (state, action) => {
      state.inventories = action.payload;
    },

    removeInventory: (state, action) => {
      state.inventories = state.inventories.filter(inventory => inventory.sku !== action.payload);
    },

    updateInventory: (state, action) => {
      const { sku, data } = action.payload;
      state.inventories = state.inventories.map(inventory => 
        inventory.sku === sku ? { ...inventory, ...data } : inventory
      );
    },

    setStockStatus: (state, action) => {
      state.stockStatus = action.payload;
    },

    setLowStockStatus: (state, action) => {
      state.lowStockStatus = action.payload;
    },

    setTransactions: (state, action) => {
      state.transactions = action.payload;
    }
    
  }
});

export const { 
  setLoading, 
  setError, 
  setMessage, 
  clearMessages,
  addInventory, 
  setCategories, 
  setSubcategories, 
  setInventories, 
  removeInventory, 
  updateInventory, 
  setStockStatus,
  setLowStockStatus,
  setTransactions 
} = inventorySlice.actions;

export default inventorySlice.reducer;
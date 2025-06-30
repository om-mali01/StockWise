import { createSelector } from "@reduxjs/toolkit";

export const selectUserState = (state) => {
  console.log("statestatestatestate", state);
  return state;
};

export const selectInventoryState = (state) => {
  console.log("inventory state", state.inventoryReducer);
  return state.inventoryReducer;
};

export const selectLoading = createSelector(
  [selectUserState],
  (userState) => {
    const isLoading = userState?.loading === true;
    console.log('Loading Selector:', isLoading);
    return isLoading;
  }
);

export const selectIsAuthenticated = createSelector(
  [selectUserState],
  (userState) => {
    const isAuth = userState?.loginReducer?.isAuthenticated === true;
    console.log('Authentication Selector:', isAuth);
    return isAuth;
  }
);

export const selectError = createSelector(
  [selectUserState],
  (userState) => userState?.error || null
);

export const selectMessage = createSelector(
  [selectUserState],
  (userState) => userState?.message || null
);

export const selectUserRole = createSelector(
  [selectUserState],
  (userState) => userState?.loginReducer?.user || null
);

export const selectRoles = createSelector(
  [selectUserState],
  (userState) => userState?.loginReducer?.roles || []
);

export const selectUsers = createSelector(
  [selectUserState],
  (userState) => userState?.loginReducer?.users || []
);

export const selectInventoryLoading = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.loading === true
);

export const selectInventoryError = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.error || null
);

export const selectInventoryMessage = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.message || null
);

export const selectCategories = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.categories || []
);

export const selectSubcategories = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.subcategories || []
);

export const selectStockStatus = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.stockStatus || []
);

export const selectInventorys = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.inventories || []
);

export const selectCurrentInventory = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.currentInventory || null
);

export const selectTransactions = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.transactions || []
);

export const selectGetAllInventorys = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.inventories || []
);
export const selectUserByUserName = createSelector(
  [selectUsers, (state, user_name) => user_name], 
  (users, user_name) => {
    return users.find(user => user.user_name === user_name) || null; 
  }
);

export const selectLowStockStatus = createSelector(
  [selectInventoryState],
  (inventoryState) => inventoryState?.lowStockStatus || []
);
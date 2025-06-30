import Swal from "sweetalert2";
import API from "../../api";
import { 
  setLoading, 
  setError, 
  setMessage, 
  addInventory, 
  setCategories, 
  setSubcategories, 
  setInventories, 
  removeInventory, 
  updateInventory, 
  setStockStatus,
  setLowStockStatus,
  setTransactions
} from '../reducer/inventoryReducer';

export const addInventoryAction = (inventoryData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.post("/addProduct", inventoryData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.status === 200 || response.status === 201) {
      Swal.fire("Inventory added successfully");
      dispatch(addInventory(response.data));
      dispatch(setMessage("Inventory added successfully"));
    } else {
      dispatch(setError(response.data.message || "Failed to add inventory"));
    }
  } catch (error) {
    console.log("Error in adding inventory", error);
    dispatch(setError(error.response?.data?.message || "Error in adding inventory"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchCategories = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.get('/getCategories');
    console.log('Categories fetched:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      dispatch(setCategories(response.data));
      dispatch(setMessage(response.data.message));
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.error('Fetch Categories Error:', error);
    dispatch(setError(error.response?.data?.message || 'Failed to fetch categories.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchSubcategories = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.get(`/getSubCategories?id=${id}`);
    
    if (response.data && Array.isArray(response.data)) {
      dispatch(setSubcategories(response.data));
      dispatch(setMessage(response.data.message));
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.error('Fetch Subcategories Error:', error);
    dispatch(setError(error.response?.data?.message || 'Failed to fetch subcategories.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const validateSKU = (sku) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.post('/validateSKU', { sku });
    
    if (response.data && response.data.flag) {
      dispatch(setMessage(response.data.message));
      return {
        data: response.data,
        status: response.status
      };
    } else if (response.data && !response.data.flag) {
      Swal.fire('SKU already exists');
      dispatch(setError(response.data.msg || 'SKU already exists'));
      throw new Error(response.data.msg || 'SKU already exists');
    } else {
      dispatch(setError('Failed to validate SKU. Please try again.'));
      throw new Error('Failed to validate SKU. Please try again.');
    }
  } catch (error) {
    console.error('SKU Validation Error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to validate SKU. Please try again.';
    dispatch(setError(errorMessage));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const getInventoriesAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setInventories([]));
  try {
    const response = await API.get("/getAllProducts");
    
    if (response.data && Array.isArray(response.data)) {
      dispatch(setInventories(response.data));
      dispatch(setMessage(response.data.message));
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.error('Fetch Products Error:', error);
    dispatch(setError(error.response?.data?.message || 'Failed to fetch inventories.'));
    dispatch(setInventories([]));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteInventoryAction = (sku) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.delete(`/deleteItem`, {
      params: { sku }
    });
    
    if (response.status === 200 || response.status === 204) {
      Swal.fire("Item deleted successfully");
      dispatch(removeInventory(sku));
      dispatch(setMessage("Item deleted successfully"));
    } else {
      dispatch(setError(response.data.message || 'Failed to delete inventory'));
    }
  } catch (error) {
    console.error('Delete Inventory Error:', error);
    dispatch(setError(error.response?.data?.message || 'Failed to delete inventory. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProductAction = (sku, inventoryData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.put(`/updateProduct`, inventoryData, {
      params: { sku },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.status === 200 || response.status === 204) {
      Swal.fire('Item updated successfully');
      dispatch(updateInventory({ sku, data: response.data }));
      dispatch(setMessage("Item updated successfully"));
    } else {
      dispatch(setError(response.data.message || 'Failed to update inventory'));
    }
  } catch (error) {
    console.error('Update Inventory Error:', error);
    dispatch(setError(error.response?.data?.message || 'Failed to update inventory. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchStockStatusAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setStockStatus([]));
  try {
    const response = await API.get('/stock_type');
    console.log('Stock Status fetched:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      dispatch(setStockStatus(response.data));
      dispatch(setMessage(response.data.message));
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.error('Fetch Stock Status Error:', error);
    dispatch(setError(error.response?.data?.message || 'Failed to fetch stock status.'));
    dispatch(setStockStatus([]));
  } finally {
    dispatch(setLoading(false));
  }
};

export const manageInventoryAction = (inventoryData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.put("/updateInventory", inventoryData);
    
    if (response.status === 200 || response.status === 204) {
      Swal.fire("Inventory updated successfully");
      dispatch(setMessage(response.data.message || "Inventory updated successfully"));
    } else {
      dispatch(setError(response.data.message || "Failed to update inventory"));
    }
  } catch (error) {
    console.log("Error in updating inventory", error);
    dispatch(setError(error.response?.data?.message || "Error in updating inventory"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchTransactionDetails = (sku) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.get(`/get-transaction?sku=${sku}`);
    if (response.data && Array.isArray(response.data)) {
      dispatch(setTransactions(response.data));
      dispatch(setMessage("Transaction details fetched successfully"));
      return response.data; 
    } else {
      throw new Error('Invalid data format');
    }
  }catch (error) {
    console.error('Fetch transaction detail error:',error);
  }finally{
    dispatch(setLoading(false));
  }
};

export const fetchLowStockItems = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
      const response = await API.get('/low-stocks');
      if (response.data && Array.isArray(response.data)) {
          const lowStockItems = response.data.filter(item => item.current_stock <= item.reorder_level);
          dispatch(setLowStockStatus(lowStockItems));
          dispatch(setMessage("Low stock items fetched successfully"));
      } else {
          throw new Error('Invalid data format');
      }
  } catch (error) {
      console.error('Fetch Low Stock Items Error:', error);
      // dispatch(setError(error.response?.data?.message || 'Failed to fetch low stock items.'));
  } finally {
      dispatch(setLoading(false));
  }
};
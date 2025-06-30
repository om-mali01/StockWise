import Swal from "sweetalert2";
import API from "../../api";
import { 
  setLoading, 
  setError, 
  setMessage, 
  setAuthentication, 
  setUser , 
  setRoles, 
  setUsers,
  clearAuth 
} from '../reducer/loginReducer';
import { fetchLowStockItems } from './inventoryAction'; 

export const loginAction = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(clearAuth());
  try {
    const response = await API.post('/login', credentials);
    console.log("Login response: ", response.data);
    if (response.status === 200) {
      const token = response.data.access_token;
      const user_role = response.data.role;
      if (response.data.role) {
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user_role", user_role);
        }
        dispatch(setAuthentication(true));
        dispatch(setUser (response.data.role));
        dispatch(setMessage(response.data.msg));        
        dispatch(fetchLowStockItems()); 
      } else {
        dispatch(setError("Failed to login"));
      }
    }
  } catch (error) {
    console.log("Login Error:", error);
    dispatch(setError(error.response?.data?.message || "Failed to login"));
    dispatch(setAuthentication(false));
    dispatch(setUser (null));
  } finally {
    dispatch(setLoading(false));
  }
};

export const initializeAuth = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      dispatch(setAuthentication(true));
      dispatch(fetchLowStockItems());
      return true;
    } catch (error) {
      console.error("Token validation error: ", error);
      dispatch(setAuthentication(false));
      return false;
    }
  } else {
    dispatch(setAuthentication(false));
    return false;
  }
};


export const addUserAction = (userData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.post('/register', userData);
    if (response.status === 200 || response.status === 201) {
      Swal.fire("User  added successfully!!");
      dispatch(setMessage(response.data.message || "User  added successfully"));
    } else {
      dispatch(setError(response.data.message || "Oops, Failed to add user!!"));
    }
  } catch (error) {
    console.log("Failed to add user", error);
    dispatch(setError(error.response?.data?.message || "Error in adding user"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchUserRoleAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.get('/getRoles');
    if (response.data && Array.isArray(response.data)) {
      dispatch(setRoles(response.data));
      dispatch(setMessage(response.data.message));
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.log("Error in fetching user roles", error);
    dispatch(setError(error.response?.data?.message || "Error while fetching data"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const showUserAction = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.get("/get-users-list");
    if (response.data && Array.isArray(response.data)) {
      dispatch(setUsers(response.data));
      dispatch(setMessage(response.data.message));
    } else {
      throw new Error('Invalid data format');
    }
  } catch (error) {
    console.error('Fetch Users Error:', error);
    dispatch(setError(error.response?.data?.message || "Error while fetching users"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateUserAction = (userData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.put('/update_user', userData);
    if (response.status === 200 || response.status === 201) {
      Swal.fire("User  updated successfully!!");
      dispatch(setMessage(response.data.message || "User  updated successfully"));
    } else {
      dispatch(setError(response.data.message || "Oops, Failed to update user!!"));
    }
  } catch (error) {
    console.log("Failed to update user", error);
    dispatch(setError(error.response?.data?.message || "Error in updating user"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getUserByUserNameAction = (user_name) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await API.get(`/getUser Details?user_name=${user_name}`);
    
    if (response.status === 200) {
      dispatch(setUser (response.data));
      console.log("Fetched User Data:", response.data);
      dispatch(setMessage("User  fetched successfully"));
    } else {
      throw new Error('Failed to fetch user');
    }
  } catch (error) {
    console.error('Fetch User Error:', error);
    dispatch(setError(error.response?.data?.message || "Error while fetching user"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteUserAction = (user_name) => async (dispatch) =>{
  dispatch(setLoading(true));
  try {
    const response = await API.delete(`/delete_user?delete_username=${user_name}`);
    if (response.status === 200 || response.status === 201){
      Swal.fire("User deleted successfully!!");
      dispatch(setMessage(response.data.message || "User deleted successfully"));
    }
    else {
      dispatch(setError(response.data.message || "Oops, Failed to delete user!!"));
    }
  }
  catch (error){
    console.log("Failed to delete user", error);
    dispatch(setError(error.response?.data?.message || "Error in deleting user"));
  }
}

export const logoutAction = () => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    dispatch(clearAuth());
    dispatch(setMessage("Logged out successfully"));
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(setError("Error during logout"));
  }
};

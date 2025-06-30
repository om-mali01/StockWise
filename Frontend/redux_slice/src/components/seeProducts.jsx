import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectInventoryLoading, selectInventoryError, selectGetAllInventorys, selectCategories } from "../redux/selector/selector";
import { getInventoriesAction, fetchCategories } from "../redux/action/inventoryAction";
import InventoryCard from './gridView';
import ListView from './listView';
import CategoryCard from './categoryCard';

const ViewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category: categoryParam } = useParams(); 
  const loading = useSelector(selectInventoryLoading);
  const error = useSelector(selectInventoryError);
  const inventories = useSelector(selectGetAllInventorys);
  const categories = useSelector(selectCategories);
  
  const [isGridView, setIsGridView] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredInventories, setFilteredInventories] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getInventoriesAction());
  }, [dispatch]);

  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      console.log("Looking for category with param:", categoryParam);
      console.log("Available categories:", categories);
      
      const foundCategory = categories.find(cat => {
        const catId = cat.category_id || cat.id;
        const catName = cat.category_name || cat.name;
        
        return (
          (catId !== null && catId !== undefined && catId.toString() === categoryParam) || 
          (catName && catName === categoryParam)
        );
      });
      
      console.log("Found category:", foundCategory);
      if (foundCategory) {
        setSelectedCategory(foundCategory);
      }
    } else if (!categoryParam) {
      setSelectedCategory(null);
    }
  }, [categoryParam, categories]);

  useEffect(() => {
    if (selectedCategory && inventories.length > 0) {
      console.log("Selected Category:", selectedCategory);
      console.log("All Inventories:", inventories);
      
      console.log("Sample inventory object:", inventories[0]);
      
      const filtered = inventories.filter(inventory => {
        const inventoryCategoryId = inventory.category_id || inventory.categoryId;
        const inventoryCategory = inventory.category;
        const inventoryCategoryName = inventory.category_name;
        const selectedCategoryId = selectedCategory.category_id || selectedCategory.id;
        const selectedCategoryName = selectedCategory.category_name || selectedCategory.name;
        
        const categoryMatches = 
          (inventoryCategoryId !== null && inventoryCategoryId !== undefined && 
           selectedCategoryId !== null && selectedCategoryId !== undefined && 
           inventoryCategoryId === selectedCategoryId) ||
          (inventoryCategoryId !== null && inventoryCategoryId !== undefined && 
           selectedCategoryId !== null && selectedCategoryId !== undefined && 
           inventoryCategoryId.toString() === selectedCategoryId.toString()) ||
          (inventoryCategory && selectedCategoryName && 
           inventoryCategory === selectedCategoryName) ||
          (inventoryCategoryName && selectedCategoryName && 
           inventoryCategoryName === selectedCategoryName);
        
        console.log(`Inventory "${inventory.name}" category check:`, {
          inventoryCategory: inventoryCategory,
          inventoryCategoryId: inventoryCategoryId,
          inventoryCategoryName: inventoryCategoryName,
          selectedCategoryId: selectedCategoryId,
          selectedCategoryName: selectedCategoryName,
          matches: categoryMatches
        });
        
        return categoryMatches;
      });
      
      console.log("Filtered Inventories:", filtered);
      setFilteredInventories(filtered);
    } else {
      setFilteredInventories([]);
    }
  }, [selectedCategory, inventories]);

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handleCategoryClick = (category) => {
    const categoryId = category.category_id || category.id;
    const categoryName = category.category_name || category.name;
    
    console.log("Clicking category:", category);
    console.log("Category ID to navigate:", categoryId);
    
    if (categoryId !== null && categoryId !== undefined) {
      navigate(`/dashboard/view-product/${categoryId}`);
    } else if (categoryName) {
      navigate(`/dashboard/view-product/${encodeURIComponent(categoryName)}`);
    } else {
      console.error("Category has no valid ID or name:", category);
    }
  };

  const handleBackToCategories = () => {
    navigate('/dashboard/view-product');
  };

  const displayInventories = selectedCategory ? filteredInventories : [];
  const displayCount = selectedCategory ? filteredInventories.length : categories.length;

  return (
    <div className="max-w-5xl mx-auto m-10">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-800 py-5 px-6 border-b flex items-center justify-between">
          <div className="flex items-center">
            {selectedCategory && (
              <button
                onClick={handleBackToCategories}
                className="bg-gray-600 text-white rounded-lg p-2 mr-4 hover:bg-gray-700"
              >
                ← Back to Categories
              </button>
            )}
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory ? `${selectedCategory.category_name || selectedCategory.name || 'Selected Category'} Products` : 'Product Categories'}
            </h2>
          </div>
          <span className="bg-gray-600 text-white text-sm py-1 px-3 rounded-full">
            {displayCount} {selectedCategory ? 'Products' : 'Categories'}
          </span>
          {selectedCategory && (
            <button 
              onClick={toggleView}
              className="bg-gray-600 text-white rounded-lg p-2"
            >
              {isGridView ? "Switch to List View" : "Switch to Grid View"}
            </button>
          )}
        </div>
                
        <div className="p-6">
          {loading && (
            <div className="text-blue-500 text-center mb-6 py-3 bg-blue-50 rounded-md">
              <span className="font-medium">Loading...</span>
            </div>
          )}
                    
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}
                    
          {!loading && !selectedCategory && categories.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">📂</div>
              <p className="text-gray-500 text-lg">No categories available.</p>
              <p className="text-gray-400">Categories will appear here once added.</p>
            </div>
          )}

          {!loading && selectedCategory && filteredInventories.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">No products available in this category.</p>
              <p className="text-gray-400">Products will appear here once added to this category.</p>
            </div>
          )}
                    
          <div className="flex flex-wrap -mx-3">
            {!selectedCategory ? (
              categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  onClick={() => handleCategoryClick(category)}
                />
              ))
            ) : (
              isGridView ? (
                displayInventories.map((inventory) => (
                  <InventoryCard key={inventory.sku} inventory={inventory} />
                ))
              ) : (
                <ListView inventories={displayInventories} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
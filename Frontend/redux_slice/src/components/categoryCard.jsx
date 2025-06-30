import React from "react";

const CategoryCard = ({ category, onClick }) => {
  console.log("Category data:", category);
  
  const defaultIcon = "🏷️";
 
  const categoryName = category.category_name || category.name || category.title || "Unnamed Category";
  const categoryDescription = category.description || category.desc || "";

  const handleClick = () => {
    console.log("Category clicked:", category);
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
      <div 
        className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 hover:border-blue-300"
        onClick={handleClick}
      >
        <div className="p-4 relative">
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
            {defaultIcon}
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 text-center">
            {categoryName}
          </h3>
          {categoryDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 text-center">
              {categoryDescription}
            </p>
          )}
        </div>
        </div>
      </div>
  );
};

export default CategoryCard;

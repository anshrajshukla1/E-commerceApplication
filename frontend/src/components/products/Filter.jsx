import { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";
import { FormControl, InputLabel, Select, MenuItem, Tooltip, Button } from "@mui/material"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
const Filter = ({categories})=>{
  

 const [searchParams] = useSearchParams(); 
 const pathname = useLocation().pathname;
 
  const navigate = useNavigate();

  const [category,setCategory]= useState("all");
  const [sortOrder,setSortOrder]= useState("asc");
  const [searchTerm ,setSearchTerm]= useState("");

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(()=>{
    const currentCategory = searchParams.get("category")|| "all";
     const currentSortOrder = searchParams.get("sortBy")|| "asc";
      const currentSearchTerm = searchParams.get("keyword")|| "";

      setCategory(currentCategory)
      setSortOrder(currentSortOrder)
      setSearchTerm(currentSearchTerm)
  },[searchParams]);

  useEffect(() => {
  const handler = setTimeout(() => {
    const newParams = new URLSearchParams(searchParams);

    if (searchTerm) {
      newParams.set("keyword", searchTerm);
    } else {
      newParams.delete("keyword");
    }

    const q = newParams.toString();
    navigate(q ? `${pathname}?${q}` : pathname);
  }, 700);

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm, pathname, navigate, searchParams]);

  const handleCategoryChange = (event) =>{
         const selectedCategory = event.target.value;
         const newParams = new URLSearchParams(window.location.search);
         if(selectedCategory==="all"){
            newParams.delete("category")
         }
         else {
            newParams.set("category",selectedCategory)
         }
         const q = newParams.toString();
         navigate(q ? `${pathname}?${q}` : pathname);
         setCategory(selectedCategory);
  }
const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
        const newOrder = prevOrder === "asc" ? "desc" : "asc";
        const newParams = new URLSearchParams(window.location.search);
        newParams.set("sortBy", newOrder);
        const q = newParams.toString();
       setTimeout(() => {
  navigate(q ? `${pathname}?${q}` : pathname);
}, 0);
        return newOrder;
    })
}

const handleClearFilters = () => {
   setCategory("all");
   setSortOrder("asc");
   setSearchTerm("");
   const clearedParams = new URLSearchParams();
   navigate(`${pathname}?${clearedParams.toString()}`);
}


  return(
    <div className="flex lg:flex-row flex-col-reverse lg:justify-between justify-center items-center gap-4">
       <div className="relative flex items-center 2xl:w-112.5 sm:w-105 w-full">
        <input type="text"
        placeholder="Search Products" 
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        className="border border-gray-400 text-slate-800 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-[#1976d2]" />
      <FaSearch className="absolute left-3 text-slate-800" size={20} />
       </div>
       
       <div className="flex sm:flex-row flex-col gap-4 items-center">
          <FormControl 
          className="text-slate-800 border-slate-700"
          variant="outlined"
          size="small">
            <InputLabel  id="category-select-label">
            Category
            </InputLabel>
            <Select 
            className="min-w-30 tex-slate-800 border-slate-700"
            labelId="category-select-label"
            value={category}
            onChange={handleCategoryChange}
            label="Category">
               <MenuItem value="all">All</MenuItem>
               {categories.map((item)=> (
  <MenuItem key={item.categoryId} value={item.categoryName}>
    {item.categoryName}
  </MenuItem>
))}
            </Select>
         
          </FormControl>

          <Tooltip title={`Sorted by Price: ${sortOrder}`}>
            <Button
              type="button"
              variant="contained"
              onClick={toggleSortOrder}
              color="primary"
              className="flex items-center gap-2 h-10"
            >
              Sort By
              {sortOrder === "asc" ? <FaArrowUp size={20} /> : <FaArrowDown size={20} />}
            </Button>
                
                
</Tooltip>
 <button className="flex items-center gap-2 bg-rose-900 text-white px-3 py-2 rounded-md transition duration-300 ease-in shadow-md focus:outline-none"
 
 onClick={handleClearFilters}>   
   <LuRefreshCcw className="font-semibold"size={16}/>
    <span className="font-semibold">Clear Filter</span>
 </button>

       </div>
    </div>
  )
}
export default Filter;

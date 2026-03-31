import { useEffect, useState } from "react";
import { LuArrowDown, LuArrowUp, LuRefreshCcw, LuSearch } from "react-icons/lu";
import { Tooltip, Button } from "@mui/material"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
const Filter = ({categories})=>{
  

 const [searchParams] = useSearchParams(); 
 const pathname = useLocation().pathname;
 
  const navigate = useNavigate();

  const [category,setCategory]= useState("all");
  const [sortOrder,setSortOrder]= useState("asc");
  const [searchTerm ,setSearchTerm]= useState("");

  useEffect(()=>{
    const currentCategory = searchParams.get("category")|| "all";
     const currentSortOrder = searchParams.get("sortOrder")|| "asc";
      const currentSearchTerm = searchParams.get("keyword")|| "";

      const timer = setTimeout(() => {
        setCategory(currentCategory);
        setSortOrder(currentSortOrder);
        setSearchTerm(currentSearchTerm);
      }, 0);

      return () => clearTimeout(timer);
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
        newParams.set("sortOrder", newOrder);
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
    <div className="surface-card flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
       <div className="relative w-full lg:max-w-xl">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <LuSearch size={18} />
        </span>
        <input type="text"
        placeholder="Search Products" 
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
       </div>
       
       <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end lg:w-auto lg:flex-nowrap">
          <div className="flex min-w-[220px] flex-col gap-2">
            <label htmlFor="category-filter" className="text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              id="category-filter"
              value={category}
              onChange={handleCategoryChange}
              className="h-11 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All</option>
              {categories.map((item)=> (
                <option key={item.categoryId} value={item.categoryName}>
                  {item.categoryName}
                </option>
              ))}
            </select>
          </div>

          <Tooltip title={`Sorted by Price: ${sortOrder}`}>
            <Button
              type="button"
              variant="contained"
              onClick={toggleSortOrder}
              color="primary"
              className="!h-11 !rounded-lg !bg-indigo-500 !px-5 !font-semibold !shadow-[0_18px_35px_-22px_rgba(99,102,241,0.85)] hover:!bg-indigo-600"
            >
              Sort By
              {sortOrder === "asc" ? <LuArrowUp size={20} /> : <LuArrowDown size={20} />}
            </Button>
                
                
</Tooltip>
 <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
 
 onClick={handleClearFilters}>   
   <LuRefreshCcw className="font-semibold"size={16}/>
    <span className="font-semibold">Clear Filter</span>
 </button>

       </div>
    </div>
  )
}
export default Filter;

import { LuBoxes, LuHouse, LuLayoutGrid, LuShoppingCart, LuStore } from "react-icons/lu";
import { bannerImageOne, bannerImageThree, bannerImageTwo } from "./constant";

export const bannerLists =[
    {
    id: 1,
    image: bannerImageThree,
    title: "Home Comfort",
    subtitle: "Living Room",
    description: "Upgrade your space with cozy and stylish sofas",
  },
  {
    id: 2,
    image: bannerImageTwo,
    title: "Entertainment Hub",
    subtitle: "Smart TV",
    description: "Experience the latest in home entertainment",
  },
  {
    id: 3,
    image: bannerImageOne,
    title: "Playful Picks",
    subtitle: "Kids' Clothing",
    description: "Bright and fun styles for kids, up to 20% off",
}
]

export const adminNavigation = [
  {
    name: "Dashboard", 
    href: "/admin", 
    icon: LuHouse, 
    current: true 
  }, {
    name: "Orders", 
    href: "/admin/orders", 
    icon: LuShoppingCart
  }, {
    name: "Products", 
    href: "/admin/products", 
    icon: LuBoxes
  }, {
    name: "Categories", 
    href: "/admin/categories", 
    icon: LuLayoutGrid
  }, {
    name: "Sellers", 
    href: "/admin/sellers", 
    icon: LuStore
  }
];

export const sellerNavigation = [
  {
    name: "Orders", 
    href: "/admin/orders", 
    icon: LuShoppingCart,
    current: true 
  }, {
    name: "Products", 
    href: "/admin/products", 
    icon: LuBoxes
  }
];




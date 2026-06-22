import React, { useState } from "react";
import { MenuItem } from "../menuData";
import { Search, Sparkles, AlertCircle, ShoppingCart, Info } from "lucide-react";

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddToBag: (item: MenuItem) => void;
  cartItemCounts: { [itemId: string]: number };
}

export default function MenuSection({ menuItems, onAddToBag, cartItemCounts }: MenuSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isVegOnly, setIsVegOnly] = useState(false);

  // Categories
  const categories = [
    { id: "all", name: "Full Menu" },
    { id: "thali", name: "Daily Thalis" },
    { id: "starters", name: "Starters" },
    { id: "biryani", name: "Biryani & Rice" },
    { id: "curry", name: "Homely Curries" },
    { id: "breads", name: "Chapatis & Breads" }
  ];

  // Filters application
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marathiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesVeg = !isVegOnly || item.isVegetarian;

    return matchesSearch && matchesCategory && matchesVeg;
  });

  return (
    <div id="digital-menu-section" className="space-y-6">
      {/* Category selectors & search bars */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50 border border-zinc-200/60 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-600 border-amber-600 text-white shadow-xs"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Thali, Biryani, Saoji..."
            className="w-full bg-white border border-zinc-200 pl-9 pr-4 py-2 rounded-xl text-xs md:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-amber-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
        </div>
      </div>

      {/* Special Veg Flag and details */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-amber-50/40 rounded-xl border border-amber-100">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isVegOnly}
            onChange={(e) => setIsVegOnly(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
          <span className="ms-3 text-xs md:text-sm font-semibold text-zinc-800 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-600 inline-block" /> Vegetarian Only Mode
          </span>
        </label>
        <div className="text-zinc-500 text-[10px] md:text-xs flex items-center">
          <Info className="h-3.5 w-3.5 text-amber-500 mr-1 shrink-0" />
          Unlimited Thali for <span className="font-bold text-zinc-800 mx-1">₹150 Only</span> (Ask for refill anytime!)
        </div>
      </div>

      {/* Food items display grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200">
          <AlertCircle className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
          <h4 className="font-semibold text-zinc-700 text-sm">No items found matching your filter</h4>
          <p className="text-xs text-zinc-400 mt-1">Try resetting the search or exploring our full homely menu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const count = cartItemCounts[item.id] || 0;
            return (
              <div
                key={item.id}
                id={`menu-item-${item.id}`}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-zinc-200/80 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-amber-200"
              >
                {/* Image and Badges */}
                <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // fallback for image loads
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  {/* Veg/Nonveg label */}
                  <span className="absolute top-3 left-3 flex h-5 w-5 items-center justify-center rounded bg-white p-0.5 shadow-sm">
                    <span
                      className={`h-3.5 w-3.5 border-2 rounded-sm flex items-center justify-center ${
                        item.isVegetarian ? "border-green-600" : "border-red-600"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          item.isVegetarian ? "bg-green-600" : "bg-red-600"
                        }`}
                      />
                    </span>
                  </span>

                  {/* Pricing Badge */}
                  <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-bold">
                    ₹{item.price}
                  </div>

                  {/* Highlights and popular label */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    {item.isPopular && (
                      <span className="bg-amber-500 font-sans text-[9px] font-black text-white uppercase px-2 py-0.5 rounded shadow-sm flex items-center">
                        <Sparkles className="h-2 w-2 mr-0.5" /> Popular
                      </span>
                    )}
                    {item.isUnlimited && (
                      <span className="bg-green-600 font-sans text-[9px] font-bold text-white uppercase px-2 py-0.5 rounded shadow-sm">
                        Unlimited
                      </span>
                    )}
                  </div>
                </div>

                {/* Info and action */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-zinc-900 leading-tight group-hover:text-amber-800 transition-colors">
                        {item.name}
                      </h4>
                    </div>
                    {/* Marathi Name */}
                    <p className="text-[11px] font-semibold text-zinc-400 font-sans">
                      {item.marathiName}
                    </p>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed font-sans pt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[9px] bg-zinc-100 text-zinc-600 py-0.5 px-1.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions add container */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100/60">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      Pack Portion
                    </span>
                    <button
                      id={`add-to-bag-${item.id}`}
                      onClick={() => onAddToBag(item)}
                      className={`flex items-center justify-center text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${
                        count > 0
                          ? "bg-amber-600 text-white shadow-xs scale-102"
                          : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                      }`}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {count > 0 ? `Added to Desk (${count})` : "Add to Plate"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

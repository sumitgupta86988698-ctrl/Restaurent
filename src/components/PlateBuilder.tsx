import React, { useState } from "react";
import { MenuItem } from "../menuData";
import { ChefHat, Plus, ShoppingCart, Trash2, Check, Sparkles } from "lucide-react";

interface PlateBuilderProps {
  menuItems: MenuItem[];
  onAddPlateToCart: (customPlate: {
    items: MenuItem[];
    totalCost: number;
    title: string;
  }) => void;
}

export default function PlateBuilder({ menuItems, onAddPlateToCart }: PlateBuilderProps) {
  // Selections
  const [selectedMain, setSelectedMain] = useState<MenuItem | null>(
    menuItems.find((m) => m.id === "veg-thali-unlimited") || null
  );
  const [selectedDal, setSelectedDal] = useState<MenuItem | null>(
    menuItems.find((m) => m.id === "dal-fry-comfort") || null
  );
  const [selectedRice] = useState<MenuItem | null>(
    menuItems.find((m) => m.id === "regular-thali") || null // Let's use steamed rice context
  );
  const [selectedBread, setSelectedBread] = useState<MenuItem | null>(
    menuItems.find((m) => m.id === "tawa-chapati") || null
  );
  const [selectedExtra, setSelectedExtra] = useState<MenuItem | null>(
    menuItems.find((m) => m.id === "unlimited-sweet-gulab") || null
  );

  // Filter available subcategories
  const mains = menuItems.filter((i) => i.category === "thali" || i.id === "paneer-masala-curry");
  const dalsAndGravies = menuItems.filter((i) => i.category === "curry");
  const breads = menuItems.filter((i) => i.category === "breads");
  const extras = menuItems.filter((i) => i.category === "dessert" || i.id === "chicken-kabab");

  // Cost calculation
  const getPlateCost = () => {
    let cost = 0;
    if (selectedMain) cost += selectedMain.price;
    if (selectedDal) cost += selectedDal.price;
    if (selectedBread) cost += selectedBread.price * 2; // Assume two chapatis standard
    if (selectedExtra) cost += selectedExtra.price;
    return cost;
  };

  const handleAssembleAndOrder = () => {
    const activeItems: MenuItem[] = [];
    if (selectedMain) activeItems.push(selectedMain);
    if (selectedDal) activeItems.push(selectedDal);
    if (selectedBread) {
      // Add two soft chapatis
      activeItems.push({
        ...selectedBread,
        name: `${selectedBread.name} (x2)`,
        price: selectedBread.price * 2,
      });
    }
    if (selectedExtra) activeItems.push(selectedExtra);

    onAddPlateToCart({
      items: activeItems,
      totalCost: getPlateCost(),
      title: `${selectedMain?.name.split(" ")[0] || "Custom"} Comfort Plate`,
    });
  };

  return (
    <div
      id="plate-builder"
      className="rounded-3xl border border-amber-100 bg-linear-to-b from-amber-50/50 to-white p-6 shadow-md transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Visual Steel Plate canvas */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80 rounded-full bg-linear-to-tr from-zinc-300 via-zinc-200 to-zinc-400 border-8 border-zinc-400/80 shadow-2xl overflow-visible">
            {/* Stainless Steel Center shine reflection */}
            <div className="absolute inset-4 rounded-full bg-linear-to-br from-zinc-100/40 via-transparent to-zinc-800/10 pointer-events-none" />

            {/* Inner design line */}
            <div className="absolute inset-2.5 rounded-full border border-zinc-300 pointer-events-none" />

            {/* Visual elements slots on the Indian Stainless Steel Thali */}
            {/* 1. Main Curry / Thali Speciality slot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <div
                className={`flex h-20 w-20 md:h-24 md:w-24 flex-col items-center justify-center rounded-full border-4 ${
                  selectedMain ? "border-amber-600/80 bg-amber-50" : "border-dashed border-zinc-400 bg-zinc-200/50"
                } p-2 text-center shadow-lg transition-transform hover:scale-105 duration-200`}
              >
                {selectedMain ? (
                  <>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide leading-none">
                      Daily Main
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-zinc-800 mt-1 line-clamp-2">
                      {selectedMain.name.replace(" Thali Special", "").replace(" (Unlimited)", "")}
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold mt-0.5">₹{selectedMain.price}</span>
                  </>
                ) : (
                  <span className="text-zinc-500 text-xs font-medium">Select Main</span>
                )}
              </div>
            </div>

            {/* 2. Dal Slot (Top Left) */}
            <div className="absolute top-8 left-8 md:top-10 md:left-10">
              <div
                className={`flex h-16 w-16 md:h-18 md:w-18 flex-col items-center justify-center rounded-full border-3 ${
                  selectedDal ? "border-yellow-600/80 bg-yellow-50" : "border-dashed border-zinc-300 bg-zinc-200/50"
                } p-1 text-center shadow-inner transition-all hover:scale-105`}
              >
                {selectedDal ? (
                  <>
                    <span className="text-[9px] font-bold text-yellow-800 uppercase leading-none">Sauji/Dal</span>
                    <span className="text-[9px] font-medium text-zinc-800 mt-0.5 truncate w-full">
                      {selectedDal.name.replace(" Saoji ", "").replace(" Tadka", "")}
                    </span>
                    <span className="text-[9px] text-yellow-700 font-bold">₹{selectedDal.price}</span>
                  </>
                ) : (
                  <span className="text-zinc-400 text-[10px]">Add Curry</span>
                )}
              </div>
            </div>

            {/* 3. Sweets & Extras Slot (Top Right) */}
            <div className="absolute top-8 right-8 md:top-10 md:right-10">
              <div
                className={`flex h-16 w-16 md:h-18 md:w-18 flex-col items-center justify-center rounded-full border-3 ${
                  selectedExtra ? "border-amber-700/80 bg-red-50/50" : "border-dashed border-zinc-300 bg-zinc-200/50"
                } p-1 text-center shadow-inner transition-all hover:scale-105`}
              >
                {selectedExtra ? (
                  <>
                    <span className="text-[9px] font-bold text-amber-800 uppercase leading-none">Sweet</span>
                    <span className="text-[9px] font-medium text-zinc-800 mt-0.5 truncate w-full">
                      {selectedExtra.name.replace(" Starter (Quarter)", "").replace(" (2 Pcs)", "")}
                    </span>
                    <span className="text-[9px] text-amber-700 font-bold">₹{selectedExtra.price}</span>
                  </>
                ) : (
                  <span className="text-zinc-400 text-[10px]">Add Sweet</span>
                )}
              </div>
            </div>

            {/* 4. Hot Chapati Slot (Bottom Left) */}
            <div className="absolute bottom-6 left-12 md:bottom-8 md:left-14">
              <div
                className={`flex h-16 w-16 md:h-18 md:w-18 flex-col items-center justify-center rounded-full border-3 ${
                  selectedBread ? "border-amber-900/40 bg-orange-50/70" : "border-dashed border-zinc-300 bg-zinc-200/50"
                } p-1 text-center shadow-md transition-all hover:scale-105`}
              >
                {selectedBread ? (
                  <>
                    <span className="text-[9px] font-bold text-amber-950/70 uppercase leading-none">Bread (x2)</span>
                    <span className="text-[9px] font-medium text-zinc-800 mt-0.5 truncate w-full">
                      {selectedBread.name}
                    </span>
                    <span className="text-[9px] text-amber-800 font-bold">₹{selectedBread.price * 2}</span>
                  </>
                ) : (
                  <span className="text-zinc-400 text-[10px]">No bread</span>
                )}
              </div>
            </div>

            {/* 5. Nagpur Comfort Salad Slot (Bottom Right) */}
            <div className="absolute bottom-6 right-12 md:bottom-8 md:right-14">
              <div className="flex h-16 w-16 md:h-18 md:w-18 flex-col items-center justify-center rounded-full border-3 border-emerald-600/60 bg-emerald-50 p-1 text-center shadow-md">
                <span className="text-[9px] font-semibold text-emerald-800 uppercase leading-none">Comp Salad</span>
                <span className="text-[8px] text-zinc-500 mt-0.5">Pickle + Onion</span>
                <span className="text-[9px] font-bold text-emerald-700 mt-0.5">FREE</span>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Customized Plate Est.</p>
            <h3 className="text-2xl font-bold font-sans text-zinc-900 mt-0.5">₹{getPlateCost()}</h3>
            <p className="text-[10px] text-amber-600 font-medium">Includes free salad & savory home-style house pickle</p>
          </div>
        </div>

        {/* Configuration Selectors */}
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 mb-2">
              <ChefHat className="mr-1 h-3.5 w-3.5" /> Thali Designer
            </span>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Build Your Comfort Meal</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Select elements below to design your custom meal. It mimics our traditional Indian mess tray.
            </p>
          </div>

          {/* Selector 1: Main Course */}
          <div className="space-y-1.5" id="pbs-main">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">1. Select Main Dish</label>
            <div className="grid grid-cols-2 gap-2">
              {mains.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMain(m)}
                  className={`flex flex-col justify-between items-start p-2.5 rounded-xl border text-left transition-all ${
                    selectedMain?.id === m.id
                      ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-xs font-bold text-zinc-800 line-clamp-1">{m.name.replace(" Special", "")}</span>
                  <div className="flex justify-between items-center w-full mt-1.5">
                    <span className="text-[10px] font-bold text-amber-600">₹{m.price}</span>
                    {selectedMain?.id === m.id && <Check className="h-3 w-3 text-amber-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector 2: Dal & Gravy */}
          <div className="space-y-1.5" id="pbs-gravy">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">2. Choose Curry/Dal</label>
            <div className="grid grid-cols-2 gap-2">
              {dalsAndGravies.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDal(d)}
                  className={`flex flex-col justify-between p-2.5 rounded-xl border text-left transition-all ${
                    selectedDal?.id === d.id
                      ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-xs font-bold text-zinc-800 line-clamp-1">{d.name}</span>
                  <div className="flex justify-between items-center w-full mt-1.5">
                    <span className="text-[10px] font-bold text-amber-600">₹{d.price}</span>
                    {selectedDal?.id === d.id && <Check className="h-3 w-3 text-amber-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector 3: Hot Flatbreads */}
          <div className="space-y-1.5" id="pbs-bread">
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">3. Add Flatbread (2 pcs)</label>
            <div className="flex gap-2">
              {breads.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBread(b)}
                  className={`flex-1 flex justify-between items-center p-2.5 rounded-xl border transition-all ${
                    selectedBread?.id === b.id
                      ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <div className="text-left">
                    <span className="text-xs font-bold block text-zinc-800">{b.name}</span>
                    <span className="text-[10px] text-zinc-400">Gauranteed Homely</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600">₹{b.price * 2}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selector 4: Sweet Touch */}
          {extras.length > 0 && (
            <div className="space-y-1.5" id="pbs-extra">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">4. Optional Sweet / Side</label>
              <div className="flex gap-2">
                {extras.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedExtra(selectedExtra?.id === e.id ? null : e)}
                    className={`flex-1 flex justify-between items-center p-2 rounded-xl border transition-all ${
                      selectedExtra?.id === e.id
                        ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20"
                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <span className="text-xs font-semibold text-zinc-800">{e.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-amber-600">₹{e.price}</span>
                      {selectedExtra?.id === e.id ? (
                        <Trash2 className="h-3.5 w-3.5 text-red-500 hover:scale-110" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit plate configuration */}
          <button
            id="assemble-plate-btn"
            onClick={handleAssembleAndOrder}
            className="w-full mt-4 flex items-center justify-center p-3 rounded-2xl bg-amber-600 text-white font-bold text-sm tracking-wide shadow-lg hover:bg-amber-700 hover:shadow-xl transition-all active:scale-98"
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Assemble & Add to Cart (₹{getPlateCost()})
          </button>
        </div>
      </div>
    </div>
  );
}

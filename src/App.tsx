import React, { useState, useEffect } from "react";
import {
  ChefHat,
  Phone,
  MapPin,
  Clock,
  Star,
  ShoppingBag,
  ThumbsUp,
  CheckCircle,
  TrendingUp,
  Heart,
  Utensils,
  ChevronRight,
  User,
  Plus,
  Minus,
  Trash2,
  Bookmark,
  Share2,
  Map,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Info,
  ExternalLink,
  X,
  Mail,
  Copy,
  Check
} from "lucide-react";

import { RESTAURANT_INFO, MENU_ITEMS, MOCK_REVIEWS, MenuItem } from "./menuData";
import { CartItem, OrderConfirmation, OrderType, CustomerDetails } from "./types";
import MenuSection from "./components/MenuSection";
import PlateBuilder from "./components/PlateBuilder";
import KakaChat from "./components/KakaChat";

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "designer" | "reviews" | "about">("overview");

  // Core Cart Operations
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Reviews submission state
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [justSubmittedReview, setJustSubmittedReview] = useState(false);

  // Order Details
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);

  // Active status tracker interval
  const [currentTrackingStep, setCurrentTrackingStep] = useState(0);

  // Favorites tracking
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [isSavedRestaurant, setIsSavedRestaurant] = useState(false);

  // Popular hours daily selection (Nagpur Sundays peak etc)
  const [selectedDay, setSelectedDay] = useState<"Sunday" | "Weekday">("Sunday");

  // Auto increment tracking steps simulation
  useEffect(() => {
    let timer: any;
    if (orderConfirmation && currentTrackingStep < 3) {
      timer = setInterval(() => {
        setCurrentTrackingStep((prev) => prev + 1);
      }, 12000); // Progress tracker simulates every 12s
    }
    return () => clearInterval(timer);
  }, [orderConfirmation, currentTrackingStep]);

  // Pricing math helper
  const getSubtotal = () => {
    return cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  };
  const getPackagingCharge = () => (orderType === "dine-in" ? 0 : 15);
  const getDeliveryCharge = () => (orderType === "delivery" ? 30 : 0);
  const getTotalAmount = () => getSubtotal() + getPackagingCharge() + getDeliveryCharge();

  // Toast Notification System
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "info" | "error" }>>([]);
  const addToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = `${Date.now() + Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Modern Modal Controllers
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Help desk support form state
  const [supportName, setSupportName] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportType, setSupportType] = useState("catering");
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportTicketResponse, setSupportTicketResponse] = useState<string | null>(null);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportName || !supportPhone || !supportMessage) {
      addToast("Please fill in all required fields (Name, Phone, and Message).", "error");
      return;
    }
    setIsSubmittingSupport(true);
    playSynthSound("button");
    
    setTimeout(() => {
      const ticketNum = `RK-TICKET-${Math.floor(1000 + Math.random() * 9000)}`;
      setSupportTicketResponse(ticketNum);
      setIsSubmittingSupport(false);
      addToast(`Support ticket ${ticketNum} opened successfully!`, "success");
      playSynthSound("success");
    }, 1200);
  };

  const resetSupportForm = () => {
    setSupportName("");
    setSupportPhone("");
    setSupportEmail("");
    setSupportType("catering");
    setSupportMessage("");
    setSupportTicketResponse(null);
  };

  // Saved bookmark notification
  const toggleSaveRestaurant = () => {
    const nextSaved = !isSavedRestaurant;
    setIsSavedRestaurant(nextSaved);
    if (nextSaved) {
      addToast("Saved to your favorites! ❤️", "success");
    } else {
      addToast("Removed from your favorites.", "info");
    }
  };

  // Add standard menu item
  const handleAddMenuItemToBag = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prevCart.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
    // Trigger drawer open to guide checkout
    setIsCartOpen(true);
    playSynthSound("button");
    addToast(`${item.name} added to your food tray!`, "success");
  };

  // Add custom plate assembled through PlateBuilder
  const handleAddPlateToCart = (customPlate: { items: MenuItem[]; totalCost: number; title: string }) => {
    const customItem: MenuItem = {
      id: `custom-plate-${Date.now()}`,
      name: customPlate.title,
      marathiName: "Your Custom Combo Plate",
      price: customPlate.totalCost,
      category: "thali",
      description: `Includes: ${customPlate.items.map((i) => i.name).join(", ")}. Designed by you in Plate Designer.`,
      isVegetarian: customPlate.items.every((i) => i.isVegetarian)
    };

    setCart((prev) => [...prev, { item: customItem, quantity: 1 }]);
    setIsCartOpen(true);
    triggerFoodConfetti();
    addToast("Successfully added custom thali plate to order!", "success");
  };

  // Modify cart quantity count
  const handleUpdateCartQuantity = (itemId: string, increment: boolean) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const nextQty = increment ? ci.quantity + 1 : ci.quantity - 1;
            return { ...ci, quantity: nextQty };
          }
          return ci;
        })
        .filter((ci) => ci.quantity > 0)
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  // Submit Order to Back-end API (Simulated client-side for immediate success & tracker stability)
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      addToast("Please provide your name and contact phone number!", "error");
      return;
    }
    if (cart.length === 0) {
      addToast("Your order tray is currently empty! Select dishes first.", "error");
      return;
    }

    setIsSubmittingOrder(true);
    playSynthSound("button");

    // Simulate authentic preparation/congratulatory timeout
    setTimeout(() => {
      const orderId = `RK-ORDER-${Math.floor(1000 + Math.random() * 9000)}`;
      const itemsTotal = getSubtotal();
      const packagingCharge = getPackagingCharge();
      const deliveryCharge = getDeliveryCharge();
      const totalAmount = getTotalAmount();

      const itemsDescription = cart.map((ci) => `${ci.quantity}x ${ci.item.name}`).join(" + ");

      const mockConfirmation: OrderConfirmation = {
        orderId,
        eta: orderType === "dine-in" 
          ? "10-12 mins (Freshly Served on Plate)" 
          : orderType === "takeaway" 
            ? "15 mins (Ready for Desk Pickup)" 
            : "25-30 mins (Home Delivery)",
        paymentMethod,
        customer: {
          name: customerName,
          phone: customerPhone,
          address: orderType === "delivery" ? customerAddress : undefined
        },
        totals: {
          itemsTotal,
          packagingCharge,
          deliveryCharge,
          totalAmount
        }
      };

      // Add to CRM simulationOrders list
      const newSimOrder = {
        id: orderId,
        customer: `${customerName} (${orderType.toUpperCase()})`,
        area: orderType === "delivery" ? (customerAddress || "Nagpur Local") : "Dine lounge desk",
        items: itemsDescription,
        time: "Just now",
        status: "Waiting for Kaka to Ring CRM Bell 🔔",
        price: totalAmount,
        isPopular: false
      };

      setSimulationOrders((prev) => [newSimOrder, ...prev]);
      setOrderConfirmation(mockConfirmation);
      setCurrentTrackingStep(0);
      setIsSubmittingOrder(false);

      // Clean cart
      setCart([]);
      playSynthSound("success");
      triggerFoodConfetti();
      addToast(`Order ${orderId} successfully dispatched! 🚀`, "success");
    }, 1200);
  };

  // Add review offline context handler
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewComment) {
      addToast("Please fill out your name and sweet review message!", "error");
      return;
    }

    const newRevObj = {
      id: `custom-rev-${Date.now()}`,
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      relativeTime: "Just now"
    };

    setReviewsList((prev) => [newRevObj, ...prev]);
    setNewReviewName("");
    setNewReviewComment("");
    setNewReviewRating(5);
    setJustSubmittedReview(true);
    addToast("Thank you for your valuable feedback! Loaded below. ❤️", "success");
    setTimeout(() => setJustSubmittedReview(false), 5000);
  };

  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [festiveMode, setFestiveMode] = useState<boolean>(false);
  const [spiceLevel, setSpiceLevel] = useState<"homely" | "chamtamit" | "saoji">("chamtamit");
  const [celebrationParticles, setCelebrationParticles] = useState<Array<{
    id: number;
    char: string;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);

  const [simulationOrders, setSimulationOrders] = useState([
    { id: "RK-SIM-312", customer: "Amit Kulkarni (VNIT Nagpur)", area: "Abhyankar Nagar", items: "🍛 Custom Veg Plate + Extra Gulab Jamun", time: "Just now", status: "Waiting for Kaka to Ring CRM Bell 🔔", price: 180, isPopular: true },
    { id: "RK-SIM-313", customer: "Pranali Deshmukh", area: "Dharampeth Ground", items: "🍗 Saoji Chicken Thali + Extra Chapati", time: "1 min ago", status: "Simulated", price: 192 },
    { id: "RK-SIM-314", customer: "Swapnil Patwardhan", area: "Ramdaspeth Desk", items: "🍽️ Unlimited Veg Thali for ₹150", time: "3 mins ago", status: "Delivered & Happy" }
  ]);

  // Audio synths: crisp, lightweight, no-external asset dependencies web sound generator
  const playSynthSound = (type: string) => {
    if (!soundOn) return;
    try {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === "button") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "sizzle") {
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1400;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        source.stop(ctx.currentTime + 0.25);
      } else if (type === "bell") {
        // Double harmony bell sounds for Kaka's kitchen bell
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 key
        gain1.gain.setValueAtTime(0.25, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6 harmonic
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 1.2);
        osc2.stop(ctx.currentTime + 1.2);
      } else if (type === "success") {
        const notes = [440, 554, 659, 880]; // A Major beautiful chord arpeggio
        const now = ctx.currentTime;
        notes.forEach((f, i) => {
          const oscObj = ctx.createOscillator();
          const gainObj = ctx.createGain();
          oscObj.type = "sine";
          oscObj.frequency.setValueAtTime(f, now + i * 0.08);
          gainObj.gain.setValueAtTime(0.12, now + i * 0.08);
          gainObj.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.35);
          oscObj.connect(gainObj);
          gainObj.connect(ctx.destination);
          oscObj.start(now + i * 0.08);
          oscObj.stop(now + i * 0.08 + 0.35);
        });
      }
    } catch (e) {
      console.log("Synthesizer bypassed (requires interaction fallback)", e);
    }
  };

  // Triggers beautiful floating food ingredients celebrating
  const triggerFoodConfetti = () => {
    const foodEmojis = ["🍛", "🫓", "🌶️", "🌶️", "🧅", "✨", "🌸", "⭐", "🍗", "🍚", "🧁"];
    const newList = Array.from({ length: 28 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      char: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
      x: Math.random() * 85 + 5, // random screen percentage
      y: 100,
      size: Math.random() * 22 + 18,
      delay: Math.random() * 0.4,
      duration: Math.random() * 1.5 + 2.5
    }));
    setCelebrationParticles(newList);
    playSynthSound("success");
    setTimeout(() => {
      setCelebrationParticles([]);
    }, 4200);
  };

  // Ring the bell when Kaka approves orders on dashboard
  const handleCookRingBellSimulated = (id: string) => {
    setSimulationOrders((prev) =>
      prev.map((ord) =>
        ord.id === id ? { ...ord, status: "DISPATCHED TO KAKA'S HOT FURNACE! 👨‍🍳🔥" } : ord
      )
    );
    playSynthSound("bell");
    triggerFoodConfetti();
  };

  const cartItemCounts = cart.reduce((acc, curr) => {
    acc[curr.item.id] = (acc[curr.item.id] || 0) + curr.quantity;
    return acc;
  }, {} as { [id: string]: number });

  return (
    <div id="hotel-applet-root" className="min-h-screen bg-linear-to-b from-[#fdfcf7] to-[#fcfaf2] text-zinc-900 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden">
      
      {/* Inject custom Keyframe style natively for absolute animation robustness */}
      <style>{`
        @keyframes customFloatUp {
          0% {
            transform: translateY(0vh) rotate(0deg) scale(0.6);
            opacity: 1;
          }
          50% {
            opacity: 1;
            transform: translateY(-40vh) rotate(180deg) scale(1.1);
          }
          100% {
            transform: translateY(-85vh) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes sparkleSlowRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-slow-rotate {
          animation: sparkleSlowRotate 20s linear infinite;
        }
      `}</style>

      {/* Floating Celebrate Confetti Render container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {celebrationParticles.map((pt) => (
          <div
            key={pt.id}
            className="absolute"
            style={{
              left: `${pt.x}%`,
              bottom: "0px",
              fontSize: `${pt.size}px`,
              animation: `customFloatUp ${pt.duration}s cubic-bezier(0.25, 1, 0.5, 1) ${pt.delay}s forwards`,
            }}
          >
            {pt.char}
          </div>
        ))}
      </div>
      
      {/* Top micro brand address bar */}
      <div id="top-hospitality-info-bar" className="bg-zinc-900 text-[11px] md:text-xs text-amber-100 py-2.5 px-4 sticky top-0 z-40 shadow-xs border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-amber-300 font-medium">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              KG Roy Rd, Dharampeth, Nagpur, MH 440010
            </span>
            <span className="hidden md:flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-amber-400" /> Opens soon: 12 PM - 3:30 PM & 7 PM - 11:30 PM
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1 text-amber-400" />
              098901 28111
            </span>
            <span className="bg-emerald-600 text-white rounded-xs px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              Active Nagpur Order Desk
            </span>
          </div>
        </div>
      </div>

      {/* Main Elegant Header Area */}
      <header id="main-restaurant-jumbo" className="relative bg-white border-b border-zinc-200/80 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6">
            
            {/* Left section: Identity */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center flex-wrap gap-2">
                <span className="bg-amber-100 text-amber-805 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center shadow-xs">
                  <ChefHat className="h-3.5 w-3.5 mr-1 text-amber-700" /> Best Homely Mess
                </span>
                <span className="border border-green-600/30 text-green-700 bg-green-50 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" /> Unlimited Food Menu
                </span>
                <span className="bg-red-50 border border-red-200 text-red-750 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center shadow-xs">
                  🌶️ Famous Saoji
                </span>
              </div>
              
              <div className="space-y-1">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 font-sans leading-tight">
                  Rajkamal Mess And Restaurant
                </h1>
                <h2 className="text-lg md:text-2xl font-bold text-amber-700 font-sans flex items-center gap-2">
                  <span>Nagpur's Premium Dining Kitchen</span>
                  <span className="text-xs text-zinc-400 font-normal">| Est. 1995 | Nagpur</span>
                </h2>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-zinc-500 text-xs md:text-sm py-1 font-sans">
                <div className="flex items-center gap-1 font-bold text-zinc-800">
                  <span className="bg-amber-500 text-white font-extrabold py-0.5 px-2 rounded-md flex items-center gap-0.5">
                    4.1 <Star className="h-3.5 w-3.5 fill-current" />
                  </span>
                  <span className="text-zinc-700 hover:underline cursor-pointer">(942 Google maps reviews)</span>
                </div>
                <span>•</span>
                <span className="font-semibold text-zinc-700">₹100–200 avg per head</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Daily Specials Are Live
                </span>
              </div>

              <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed max-w-xl">
                Experience Nagpur's legendary traditional hospitality! Offering pure hand-rolled tawa chapatis directly from Kaka's furnace, rich spicy Saoji gravies, and customizable thali plates cooked in pure hygiene.
              </p>
            </div>

            {/* Right section: Beautiful Visual Showcase Photo Banner */}
            <div className="lg:col-span-5 relative w-full h-48 sm:h-60 lg:h-64 rounded-3xl overflow-hidden shadow-lg border-4 border-amber-100/80 group">
              <img
                src="/src/assets/images/rajkamal_mess_banner_1782049120412.jpg"
                alt="Rajkamal Mess Nagpur Authentic Thali"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Elegant dark gradient overlay for branding text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-transparent pointer-events-none" />
              
              {/* Image Badges */}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="bg-black/9D backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-zinc-700 shadow-sm uppercase tracking-wider">
                  🔥 Kitchen Fresh
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Rajkamal Speciality</p>
                <p className="text-sm font-bold truncate">Premium Maharashtrian Steel Thali Setup</p>
                <p className="text-[9px] text-zinc-350 mt-0.5">Prepared daily with raw local Nagpur ingredients</p>
              </div>
            </div>

          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-zinc-100 pt-5">
            {/* Left section: Instant Utility Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  const targetState = !soundOn;
                  setSoundOn(targetState);
                  if (targetState) {
                    setTimeout(() => playSynthSound("button"), 100);
                  }
                }}
                id="restaurant-sound-btn"
                className={`flex items-center space-x-2 text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-all ${
                  soundOn
                    ? "bg-amber-150 text-amber-900 border-amber-300 shadow-xs"
                    : "bg-zinc-100 text-zinc-400 border-zinc-200"
                }`}
                title="Toggle Web Interactive Chime Sound Effects"
              >
                <span>{soundOn ? "🔊 Sounds: Active" : "🔇 Sounds: Muted"}</span>
              </button>

              <button
                onClick={() => {
                  const targetState = !festiveMode;
                  setFestiveMode(targetState);
                  if (targetState) {
                    triggerFoodConfetti();
                  } else {
                    playSynthSound("button");
                  }
                }}
                id="restaurant-festival-btn"
                className={`flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all animate-pulse ${
                  festiveMode
                    ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white border-orange-500 shadow-md"
                    : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50/50"
                }`}
                title="Celebrate Indian Traditional Food Greetings"
              >
                <span>{festiveMode ? "✨ Festive Mode: Active 🎉" : "✨ Festive Celebration Mode"}</span>
              </button>

              <button
                onClick={() => {
                  toggleSaveRestaurant();
                  playSynthSound("button");
                }}
                id="restaurant-bookmark-btn"
                className={`flex items-center space-x-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                  isSavedRestaurant
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSavedRestaurant ? "fill-current" : ""}`} />
                <span>{isSavedRestaurant ? "Saved to Favorites" : "Save to Maps History"}</span>
              </button>

              <button
                onClick={() => {
                  playSynthSound("button");
                  setIsShareOpen(true);
                }}
                id="restaurant-share-btn"
                className="flex items-center space-x-2 text-xs font-bold bg-white text-zinc-700 border border-zinc-200 px-4 py-2.5 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                <Share2 className="h-4 w-4" />
                <span>Share & Invite Friends</span>
              </button>

              <button
                onClick={() => {
                  playSynthSound("bell");
                  const num = "09890128111";
                  window.location.href = `tel:${num}`;
                }}
                id="restaurant-phone-btn"
                className="flex items-center space-x-2 text-xs font-bold bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Call Owner (098901 28111)</span>
              </button>
            </div>
          </div>

          {/* Secondary Features list */}
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 border-t border-zinc-100 py-3 text-xs font-medium text-zinc-600 mt-4">
            <span className="flex items-center text-zinc-800 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> Dine-In
            </span>
            <span className="flex items-center text-zinc-800 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> Drive-Through
            </span>
            <span className="flex items-center text-zinc-800 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> No-Contact Delivery
            </span>
            <span className="flex items-center text-zinc-800 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-2" /> Custom Saoji Style
            </span>
          </div>

          {/* Elegant Page Tab buttons */}
          <div className="flex border-b border-zinc-200/60 mt-4 overflow-x-auto scroller-none">
            {[
              { id: "overview", label: "Overview & Highlights", icon: Utensils },
              { id: "menu", label: "Homely Menu", icon: ShoppingBag },
              { id: "designer", label: "Plate Designer (Visual Thali)", icon: ChefHat },
              { id: "reviews", label: `Reviews (942)`, icon: Star },
              { id: "about", label: "Hours & Directions", icon: Map }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    playSynthSound("button");
                  }}
                  className={`flex items-center space-x-2 py-3 px-5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap focus:outline-none ${
                    activeTab === tab.id
                      ? "border-amber-600 text-amber-700 font-bold"
                      : "border-transparent text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </header>

      {/* Main Content Layout Container */}
      <main id="applet-central-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Festive Traditional Greeting Banner */}
        {festiveMode && (
          <div className="mb-6 p-4 rounded-3xl bg-linear-to-r from-red-600 via-orange-500 to-red-600 text-center text-white border-4 border-yellow-400 shadow-xl animate-bounce duration-3000 relative">
            <span className="absolute -top-3 left-10 text-xl font-bold">🌸</span>
            <span className="absolute -top-3 right-10 text-xl font-bold">🌸</span>
            <h2 className="text-lg md:text-xl font-bold tracking-wider font-serif">
               A Warm & Hearty Welcome to Rajkamal Mess!
            </h2>
            <p className="text-[11px] text-yellow-100 font-sans mt-0.5 font-bold">
              Pure homely ingredients, tawa flatbreads directly from clay furnaces & signature Nagpur Saoji gravy.
            </p>
          </div>
        )}

        {/* Banner Announcement for Unlimited Thali */}
        <div className="mb-8 p-6 rounded-3xl bg-linear-to-r from-amber-600 to-orange-500 text-white shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-48 bg-radial-to-bl from-white/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-widest banner-amber-sub">
                Nagpur Dharampeth Local Special
              </span>
              <h3 className="text-2xl font-black">Unlimited Veg Thali for ₹150 Only!</h3>
              <p className="text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
                Taste authentic hand-cooked spices by Nagpur’s finest mess and restaurant. Includes unlimited vegetable curries, paneer dishes, yellow homely lentil dal, soft wheat chapatis, salad, and pickle. Simple yet satisfying!
              </p>
            </div>
            <button
              onClick={() => {
                const unlimitedItem = MENU_ITEMS.find((m) => m.id === "veg-thali-unlimited");
                if (unlimitedItem) {
                  handleAddMenuItemToBag(unlimitedItem);
                  playSynthSound("sizzle");
                }
              }}
              id="order-banner-unlimited-btn"
              className="bg-white text-amber-950 font-extrabold text-xs md:text-sm px-6 py-3 rounded-2xl shadow-md hover:bg-amber-50 active:scale-95 transition-all text-center shrink-0 w-full md:w-auto"
            >
              Add Thali directly to Order Desk (₹150)
            </button>
          </div>
        </div>

        {/* Tab contents switches */}

        {/* TAB 1: OVERVIEW & HIGHLIGHTS */}
        {activeTab === "overview" && (
          <div id="tab-overview" className="space-y-8 animate-in fade-in duration-200">

            {/* NEW: Nagpur Spice & Kaka's Pride Lounge Double Core Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4" id="kakas-pride-row">
              
              {/* Card 1: Nagpur Spicy Heat Selector */}
              <div className="relative rounded-3xl p-6 border transition-all duration-350 shadow-md bg-linear-to-b from-white to-orange-50/20 border-orange-100" id="spice-selector-box">
                <div className="absolute right-4 top-4 text-3xl opacity-20">🌶️</div>
                <div className="space-y-1.5">
                  <span className="bg-orange-100 text-orange-850 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Nagpur Spices Simulator
                  </span>
                  <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-1.5 mt-1">
                    Authentic Saoji Spice-O-Meter 🌡️
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                    Adjust the spice quotient slider below to preview how Kaka refines recipe seasonings, gravy thickness, and direct seasoning heat instantly!
                  </p>
                </div>

                {/* Slider bar selector */}
                <div className="mt-5 space-y-4">
                  <div className="flex justify-between items-center bg-zinc-50 p-2 text-zinc-700 rounded-2xl border border-zinc-200 gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => { setSpiceLevel("homely"); playSynthSound("button"); }}
                      className={`flex-1 py-2 px-2.5 text-center text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                        spiceLevel === "homely" ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      🟢 Mild / Homely
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSpiceLevel("chamtamit"); playSynthSound("sizzle"); }}
                      className={`flex-1 py-1.5 px-2.5 text-center text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                        spiceLevel === "chamtamit" ? "bg-amber-600 text-white shadow-sm" : "text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      🌶️ Medium / Aromatic
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSpiceLevel("saoji"); playSynthSound("sizzle"); triggerFoodConfetti(); }}
                      className={`flex-1 py-1.5 px-2.5 text-center text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                        spiceLevel === "saoji" ? "bg-red-600 text-white shadow-sm" : "text-zinc-650 hover:bg-zinc-100"
                      }`}
                    >
                      🔥 Saoji / Spicy Hot!
                    </button>
                  </div>

                  {/* Level Descriptions based on selected state */}
                  <div className="rounded-2xl p-4 transition-all duration-300 border bg-white"
                       style={{
                         borderColor: spiceLevel === "saoji" ? "#fecaca" : spiceLevel === "chamtamit" ? "#fef3c7" : "#d1fae5",
                         backgroundColor: spiceLevel === "saoji" ? "#fff5f5" : spiceLevel === "chamtamit" ? "#fffbeb" : "#f0fdf4"
                       }}
                       id="spice-level-desc"
                  >
                    {spiceLevel === "homely" && (
                      <div className="space-y-1 animate-in fade-in duration-200">
                        <p className="text-xs font-extrabold text-emerald-800">🟢 Level 1: Homely Comfort (Mild Taste)</p>
                        <p className="text-[11px] text-emerald-700 leading-relaxed font-sans">
                          Sautéed in gentle hand-milled spices, mild lentils, and absolute safety. Perfect for Nagpur students eating twice-daily who seek comforting meals that cause zero stomach burns!
                        </p>
                      </div>
                    )}
                    {spiceLevel === "chamtamit" && (
                      <div className="space-y-1 animate-in fade-in duration-200">
                        <p className="text-xs font-extrabold text-amber-800">🌶️ Level 2: Medium Pepper Selection (Spicy & Medium)</p>
                        <p className="text-[11px] text-amber-700 leading-relaxed font-sans">
                          Balanced perfectly with home-roasted coriander powder, cumin, pepper and ginger-garlic ghee. True local Dharampeth chef signature style! Warm, aromatic, but eyes stay dry!
                        </p>
                      </div>
                    )}
                    {spiceLevel === "saoji" && (
                      <div className="space-y-1 animate-in fade-in duration-200">
                        <p className="text-xs font-extrabold text-red-850">🔥 Level 3: Intense Traditional Saoji (Extra Hot Spicy!)</p>
                        <p className="text-[11px] text-red-700 leading-relaxed font-sans">
                          Features original authentic Saoji black-clove hot spicy gravy. Rich, intense roasted spices, and pure local passion. <span className="font-extrabold text-red-800">Kaka says: Keep cool curd or soft wheat flats nearby! Always a hit!</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Chef Kaka's Pride Dashboard & Simulated Orders Panel */}
              <div className="rounded-3xl p-6 border border-zinc-200/80 bg-linear-to-b from-white to-zinc-50 shadow-md relative" id="kaka-crm-box">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-widest flex items-center gap-1.5">
                      👑 Kaka's Royal Kitchen Console
                    </h3>
                    <p className="text-[11px] text-amber-800 font-bold">Kitchen Master Dispatch Desk (CRM Dispatch Board)</p>
                  </div>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <p className="text-[11px] text-zinc-500 leading-relaxed mt-2.5 font-sans">
                  Check how orders stream inside Nagpur counters. Tap the blinking bell on simulated items to ring the actual kitchen brass bell gong, process meals, and let food confetti bloom!
                </p>

                {/* Simulated Order Feeds list */}
                <div className="mt-4 space-y-2.5">
                  {simulationOrders.map((ord) => {
                    const isNew = ord.status.includes("Waiting");
                    return (
                      <div
                        key={ord.id}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 transition-all ${
                          isNew ? "bg-amber-50/70 border-amber-300 shadow-xs scale-101" : "bg-white border-zinc-150"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-zinc-850">{ord.customer}</span>
                            <span className="text-[9px] font-mono text-zinc-400">({ord.area})</span>
                          </div>
                          <p className="text-[11px] text-zinc-600 font-semibold mt-0.5">{ord.items}</p>
                          <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${isNew ? "text-amber-700 animate-pulse animate-duration-1000" : "text-emerald-750"}`}>
                            <span className={`inline-block h-1.5 w-1.5 rounded-full ${isNew ? "bg-amber-600 animate-ping" : "bg-emerald-600"}`} />
                            {ord.status}
                          </p>
                        </div>
                        {isNew ? (
                          <button
                            type="button"
                            onClick={() => handleCookRingBellSimulated(ord.id)}
                            className="bg-zinc-900 text-white font-extrabold hover:bg-zinc-800 py-2 px-3.5 rounded-xl flex items-center gap-1 text-[10px] shrink-0 transition shadow-xs cursor-pointer active:scale-95"
                          >
                            <span>🔔 Ring Kitchen</span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0 border border-emerald-100">
                            Prepped ✅
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bento Grid Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Highlight 1: Comfort homestyle food description */}
              <div className="md:col-span-2 rounded-2xl bg-white border border-zinc-200/80 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center">
                    <TrendingUp className="text-amber-600 mr-2 h-5 w-5" /> The Taste of Homely Nagpur Foods
                  </h3>
                  <p className="text-zinc-600 text-sm mt-2 leading-relaxed">
                    Rajkamal Mess and Restaurant is structured around providing fresh, consistent, and satisfying meal cycles everyday in Dharampeth, Nagpur. Whether you are a student, young working professional, or simply craving the comfort of home-cooked spices, our unlimited kitchen operates to serve you deep satisfaction.
                  </p>
                  <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                    “With a menu designed to give a homely feel they have captured the taste of home.” — Many of our weekly customers join us specifically because our light gravies and pure wheat chapatis never feel heavy on the stomach.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
                  <div className="text-center p-2 rounded-xl bg-orange-50/40">
                    <p className="text-amber-800 font-extrabold text-lg">940+</p>
                    <p className="text-zinc-500 text-[10px]">Google reviews</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-amber-50/40">
                    <p className="text-amber-800 font-extrabold text-lg">₹150</p>
                    <p className="text-zinc-500 text-[10px]">Unlimited Thali</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-emerald-50/40">
                    <p className="text-emerald-700 font-extrabold text-lg">100%</p>
                    <p className="text-zinc-500 text-[10px]">Whole Wheat Flatbreads</p>
                  </div>
                </div>
              </div>

              {/* Highlight 2: Popular hours widget */}
              <div className="rounded-2xl bg-white border border-zinc-200/80 p-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Popular Times</h3>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value as any)}
                      className="text-xs bg-zinc-50 border border-zinc-200 py-1 px-2.5 rounded-lg text-zinc-700 font-semibold focus:outline-none"
                    >
                      <option value="Sunday">Sundays</option>
                      <option value="Weekday">Mon-Sat</option>
                    </select>
                  </div>
                  
                  <p className="text-xs text-zinc-400 mt-1">
                    Busy hours chart (Shows highest crowd at dinner timing on {selectedDay}s).
                  </p>

                  {/* Hourly peak graph */}
                  <div className="flex h-32 items-end space-x-1.5 pt-6 border-b border-zinc-150 relative">
                    {/* Graph bars representation based on data */}
                    {[
                      { hr: "12 PM", val: selectedDay === "Sunday" ? 50 : 70 },
                      { hr: "1 PM", val: selectedDay === "Sunday" ? 80 : 90 },
                      { hr: "2 PM", val: selectedDay === "Sunday" ? 95 : 85 },
                      { hr: "3 PM", val: selectedDay === "Sunday" ? 60 : 40 },
                      { hr: "7 PM", val: selectedDay === "Sunday" ? 75 : 60 },
                      { hr: "8 PM", val: selectedDay === "Sunday" ? 95 : 85 },
                      { hr: "9 PM", val: selectedDay === "Sunday" ? 100 : 90 },
                      { hr: "10 PM", val: selectedDay === "Sunday" ? 90 : 80 },
                      { hr: "11 PM", val: selectedDay === "Sunday" ? 45 : 30 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                        <div
                          style={{ height: `${item.val}%` }}
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            item.val > 80 ? "bg-amber-600 group-hover:bg-amber-700" : "bg-amber-300 group-hover:bg-amber-400"
                          }`}
                        />
                        <span className="text-[8px] text-zinc-400 mt-1 overflow-hidden h-3 rotate-45 select-none origin-left capitalize">
                          {item.hr}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 leading-tight">
                  <span className="font-bold text-zinc-700">Kaka's Tip:</span> Sunday nights (8 PM - 10:30 PM) are packed for Saoji Chicken & Unlimited Veg Thali. Order takeaways early or walk-in!
                </div>
              </div>

            </div>

            {/* Quick action: Explore full Menu / Customize Thali Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-[#faf8f0] border border-amber-100 flex items-start gap-4">
                <div className="p-3 bg-amber-600 text-white rounded-xl shrink-0">
                  <Utensils className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-zinc-900">Explore Interactive Menu</h4>
                  <p className="text-zinc-600 text-sm mt-1 mb-3">
                    Check out all items, filter based on Vegetarian Only dietary requirements, search by names, and place order.
                  </p>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center"
                  >
                    View Homely Menu <ChevronRight className="h-4 w-4 ml-0.5" />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#faf8f0] border border-amber-100 flex items-start gap-4">
                <div className="p-3 bg-amber-600 text-white rounded-xl shrink-0">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-zinc-900">Interactive Visual Thali Builder</h4>
                  <p className="text-zinc-600 text-sm mt-1 mb-3">
                    Don’t want pre-designed thalis? Design your steel plate by picking custom Mains, Breads, and Curries interactively!
                  </p>
                  <button
                    onClick={() => setActiveTab("designer")}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center"
                  >
                    Launch Designer <ChevronRight className="h-4 w-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Section: The Best Seller Dishes carousel */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-zinc-900">Popular Signature Plates</h3>
                <button onClick={() => setActiveTab("menu")} className="text-xs font-bold text-amber-700 hover:underline">
                  View Full Menu
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {MENU_ITEMS.filter((i) => i.isPopular).slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-amber-200 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-36 bg-zinc-50">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <span className="absolute bottom-2 left-2 bg-zinc-900/80 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                        ₹{item.price}
                      </span>
                    </div>
                    <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-zinc-400 font-semibold">{item.marathiName}</p>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleAddMenuItemToBag(item)}
                        className="w-full text-center text-xs font-bold bg-amber-50 text-amber-700 py-1.5 rounded-lg border border-amber-200/80 hover:bg-amber-100"
                      >
                        + Add to Plate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chef Kaka Message box */}
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <span className="text-3xl">🍛</span>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wider">A Personal Note from Kaka</h4>
                  <p className="text-zinc-700 text-xs md:text-sm mt-1 italic">
                    "My target is not fancy plating. I aim that any boy or girl away from home in Nagpur who wants real, hygienic, comforting home food is welcomed in our Dharampeth dining room, gets hot tawa chapatis directly from furnace and special home mango pickles. Eat as much as your heart desires!"
                  </p>
                </div>
                <button
                  onClick={() => {
                    const btn = document.getElementById("kaka-chat-btn");
                    if (btn) btn.click();
                  }}
                  className="bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold py-2 px-4 rounded-xl shrink-0"
                >
                  Consult Kaka (AI Assistant)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MENU DISPLAY */}
        {activeTab === "menu" && (
          <div id="tab-menu" className="animate-in fade-in duration-200">
            <MenuSection
              menuItems={MENU_ITEMS}
              onAddToBag={handleAddMenuItemToBag}
              cartItemCounts={cartItemCounts}
            />
          </div>
        )}

        {/* TAB 3: CUSTOM PLATE DESIGNER */}
        {activeTab === "designer" && (
          <div id="tab-designer" className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white border border-zinc-200/70 p-4 rounded-2xl">
              <h2 className="text-lg font-bold text-zinc-900">Stainless Steel Thali Assembly Lounge 🫓</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Customize your own traditional steel plate menu interactively. Your chosen selections render instantly.
              </p>
            </div>
            <PlateBuilder
              menuItems={MENU_ITEMS}
              onAddPlateToCart={handleAddPlateToCart}
            />
          </div>
        )}

        {/* TAB 4: REVIEWS CORNER */}
        {activeTab === "reviews" && (
          <div id="tab-reviews" className="space-y-8 animate-in fade-in duration-200">
            
            {/* Reviews Summary Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border border-zinc-200/80">
              <div className="text-center md:border-r border-zinc-200 py-2">
                <h3 className="text-5xl font-black text-zinc-950">4.1</h3>
                <div className="flex justify-center text-amber-500 my-1">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5/10 fill-current text-zinc-300" />
                </div>
                <p className="text-xs text-zinc-400 uppercase tracking-widest font-mono">942 Google Reviews</p>
              </div>

              {/* Progress Bar of stars */}
              <div className="md:col-span-2 space-y-1.5 py-1">
                {[
                  { star: 5, pct: "65%" },
                  { star: 4, pct: "20%" },
                  { star: 3, pct: "8%" },
                  { star: 2, pct: "4%" },
                  { star: 1, pct: "3%" }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center text-xs text-zinc-500">
                    <span className="w-12 text-zinc-600 font-bold">{row.star} Stars</span>
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full mx-3 overflow-hidden">
                      <div style={{ width: row.pct }} className="h-full bg-amber-500" />
                    </div>
                    <span className="w-8 text-right font-medium text-zinc-700">{row.pct}</span>
                  </div>
                ))}
              </div>

              {/* Key Highlights of reviews */}
              <div className="text-xs text-zinc-500 space-y-2.5 py-1 flex flex-col justify-center">
                <p className="flex items-start">
                  <span className="text-green-600 mr-1.5">✔</span>
                  <span>"Homely comforting environment, hygienic meals."</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-1.5">✔</span>
                  <span>"Regular thali at ₹100 is unmatched value in Dharampeth."</span>
                </p>
                <p className="flex items-start">
                  <span className="text-green-600 mr-1.5">✔</span>
                  <span>"Saoji Chicken curry thali is spicy & absolute gold."</span>
                </p>
              </div>
            </div>

            {/* Review submitting form + list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Write review panel */}
              <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl h-fit space-y-4">
                <h4 className="font-bold text-zinc-900 border-b border-zinc-100 pb-2.5">Submit Your Experience</h4>
                
                {justSubmittedReview && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>Sukhiya (Aabhar)! Thank you for writing a review.</span>
                  </div>
                )}

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700 uppercase">Your Name</label>
                    <input
                      type="text"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Rahul Deshpande"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs md:text-sm text-zinc-800 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700 uppercase">Star Rating</label>
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewReviewRating(s)}
                          className="focus:outline-none focus:scale-110 transform transition"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              s <= newReviewRating ? "text-amber-500 fill-current" : "text-zinc-200"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-700 uppercase">Comment</label>
                    <textarea
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Share your homely dining experience, thoughts about Nagpur Saoji spicy gravy, or soft wheat flatbread quality..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs md:text-sm text-zinc-800 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-zinc-900 text-white font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase hover:bg-zinc-800 transition"
                  >
                    Post Review (Offline Only)
                  </button>
                </form>
              </div>

              {/* Reviews Feed display */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-zinc-900 uppercase tracking-widest text-xs border-b border-zinc-100 pb-2">
                  Customer Review Feed
                </h4>

                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white border border-zinc-200/60 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {rev.name.substring(0, 2)}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs md:text-sm text-zinc-800 flex items-center">
                            {rev.name}
                            {rev.isLocalGuide && (
                              <span className="ml-1.5 bg-orange-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-xs tracking-wider">
                                Local Guide
                              </span>
                            )}
                          </h5>
                          {rev.numReviews && (
                            <p className="text-[9px] text-zinc-400">
                              {rev.numReviews} review{rev.numReviews > 1 ? "s" : ""}
                              {rev.numPhotos && ` • ${rev.numPhotos} photos`}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-medium">{rev.relativeTime}</span>
                    </div>

                    {/* Star Row */}
                    <div className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < rev.rating ? "fill-current" : "text-zinc-200"}`}
                        />
                      ))}
                    </div>

                    <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: HOURS & DIRECTIONS */}
        {activeTab === "about" && (
          <div id="tab-about" className="space-y-8 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Detailed schedule and phone */}
              <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-2">Business Hours</h3>
                  <div className="mt-3 space-y-2.5 text-xs md:text-sm">
                    {[
                      { day: "Sunday Specials", timing: "12:00 PM - 3:30 PM & 7:00 PM - 11:30 PM", active: true },
                      { day: "Monday", timing: "12:00 PM - 3:30 PM & 7:00 PM - 11:30 PM" },
                      { day: "Tuesday", timing: "12:00 PM - 3:30 PM & 7:00 PM - 11:30 PM" },
                      { day: "Wednesday", timing: "12:00 PM - 3:30 PM & 7:00 PM - 11:30 PM" },
                      { day: "Thursday", timing: "12:00 PM - 3:30 PM & 7:00 PM - 11:30 PM" },
                      { day: "Friday", timing: "12:00 PM - 3:30 PM & 7:00 PM - 11:30 PM" },
                      { day: "Saturday", timing: "12:00 PM - 3:30 PM & 7:00 PM - 11:30 PM" }
                    ].map((row, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center py-1 ${
                          row.active ? "text-amber-700 font-bold" : "text-zinc-600"
                        }`}
                      >
                        <span>{row.day}</span>
                        <span>{row.timing}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-4 space-y-3">
                  <h4 className="font-bold text-zinc-900 text-sm">Contact Information & Help</h4>
                  <p className="text-xs text-zinc-500">
                    If you are facing custom requirements for corporate ordering, mess subscription plans, monthly packages inside Dharampeth, reach out directly.
                  </p>
                  <div className="flex items-center space-x-3 text-xs md:text-sm text-zinc-700 font-bold">
                    <Phone className="h-4.5 w-4.5 text-amber-500" />
                    <span>098901 28111 / 9145229302</span>
                  </div>
                </div>
              </div>

              {/* Location display, Plus Codes and Directions visual Mock */}
              <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-zinc-900">Map & Directions</h3>
                
                <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">
                  <span className="font-bold text-zinc-800">Address:</span> KG Roy, Hanuman Mandir Rd, Dharampeth, Nagpur, Maharashtra 440010
                </p>

                <div className="p-3 bg-zinc-50 border rounded-xl text-xs space-y-1">
                  <p className="font-bold text-zinc-700 flex items-center">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" /> Google Plus Code:
                  </p>
                  <p className="text-zinc-500 font-mono pl-4">43R7+VP Nagpur, Maharashtra, India</p>
                </div>

                {/* Simulated Maps card */}
                <div className="relative h-56 rounded-xl border overflow-hidden bg-zinc-100 flex items-center justify-center">
                  {/* Mock beautiful geographic map texture with a center marker */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-100" />
                  
                  {/* Central roads simulation lines */}
                  <div className="absolute top-1/2 left-0 right-0 h-4 bg-zinc-200" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-4 bg-zinc-200" />
                  
                  {/* Hanuman Mandir road label */}
                  <span className="absolute left-2 top-20 text-[10px] text-zinc-400 font-bold bg-white/70 px-1 rounded transform -rotate-12">
                    Hanuman Mandir Road
                  </span>

                  {/* KG Roy road label */}
                  <span className="absolute left-1/3 top-28 text-[10px] text-zinc-400 font-bold bg-white/70 px-1 rounded transform rotate-90 origin-top-left">
                    KG Roy Road
                  </span>

                  {/* Red Location pin of Rajkamal Mess */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 border-2 border-white shadow-lg animate-bounce duration-1000">
                      <ChefHat className="h-6 w-6 text-white" />
                    </div>
                    <span className="bg-zinc-900 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold mt-2 shadow-md uppercase tracking-wider block">
                      Rajkamal Mess 🍛
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-zinc-950/80 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg">
                    Dharampeth Base Map
                  </div>
                </div>

                {/* Redirect details */}
                <a
                  href="https://maps.google.com/?q=Rajkamal+Mess+and+Restaurant+Dharampeth+Nagpur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center flex items-center justify-center p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-amber-800 font-bold text-xs"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Navigate on Google Maps
                </a>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Floating Interactive shopping bag panel triggers */}
      {cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          id="floating-order-desk-btn"
          className="fixed bottom-6 left-6 z-50 flex items-center space-x-2.5 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 animate-bounce"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 text-amber-400" />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 border border-zinc-900 text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
              {cart.reduce((t, c) => t + c.quantity, 0)}
            </span>
          </div>
          <span className="text-xs md:text-sm font-bold tracking-wide">
            Checkout Plate (₹{getTotalAmount()})
          </span>
        </button>
      )}

      {/* Order Desk Drawer (Shopping Basket overlay) */}
      {isCartOpen && (
        <div id="order-desk-drawer" className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md transform transition-all duration-300">
              <div className="h-full flex flex-col bg-white shadow-2xl overflow-y-scroll">
                
                {/* Drawer Header */}
                <div className="px-5 py-5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5 text-amber-400" />
                    <div>
                      <h3 className="text-base font-bold font-sans">Rajkamal Order Desk</h3>
                      <p className="text-[10px] text-amber-200">Nagpur Dharampeth Comfort Delivery/Dine-In</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-zinc-400 hover:text-white focus:outline-none"
                  >
                    Close [✖]
                  </button>
                </div>

                {/* Drawer Body content */}
                <div className="flex-1 py-4 overflow-y-auto px-5 space-y-6">
                  
                  {cart.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center justify-center h-full space-y-3">
                      <Utensils className="h-10 w-10 text-zinc-300" />
                      <h4 className="font-bold text-zinc-700 text-sm">Your order basket is empty</h4>
                      <p className="text-xs text-zinc-400 max-w-xs">
                        Flip through the homely menu or design your customized stainless steel thali to add items!
                      </p>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setActiveTab("menu");
                        }}
                        className="bg-amber-600 font-bold hover:bg-amber-700 text-white text-xs px-4 py-2 rounded-xl mt-2"
                      >
                        Explore Menu
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Active Basket items list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b pb-1.5">
                          Assembled Plate elements:
                        </h4>
                        
                        {cart.map((ci) => (
                          <div
                            key={ci.item.id}
                            className="flex items-start justify-between gap-3 p-3 bg-zinc-50 border rounded-xl"
                          >
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-zinc-800 line-clamp-2 leading-tight">
                                {ci.item.name}
                              </h5>
                              <p className="text-[10px] text-amber-700 font-bold mt-1">₹{ci.item.price} each</p>
                            </div>

                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => handleUpdateCartQuantity(ci.item.id, false)}
                                className="h-6 w-6 rounded-md bg-white border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-xs"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-bold text-zinc-800 font-mono w-4 text-center">
                                {ci.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateCartQuantity(ci.item.id, true)}
                                className="h-6 w-6 rounded-md bg-white border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-xs"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleRemoveFromCart(ci.item.id)}
                                className="h-6 w-6 rounded-md text-red-500 hover:bg-red-50 flex items-center justify-center text-xs ml-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Options selection form */}
                      <form onSubmit={handlePlaceOrder} className="space-y-4 pt-4 border-t border-zinc-100">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b pb-1">
                          Delivery / dine options:
                        </h4>

                        {/* Order Type picker */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "dine-in", label: "Dine-In", price: "Free setup" },
                            { id: "takeaway", label: "Takeaway", price: "₹15 Pack" },
                            { id: "delivery", label: "Delivery", price: "₹30 Rider" }
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setOrderType(t.id as any)}
                              className={`p-2 rounded-xl border text-center transition-all ${
                                orderType === t.id
                                  ? "border-amber-600 bg-amber-50 text-amber-800 ring-1 ring-amber-500/20 font-bold"
                                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                              }`}
                            >
                              <p className="text-xs">{t.label}</p>
                              <p className="text-[9px] text-zinc-400 mt-1">{t.price}</p>
                            </button>
                          ))}
                        </div>

                        {/* Input details name/phone */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase">Customer Name *</label>
                            <input
                              type="text"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="e.g. Anand"
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 md:p-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase">Phone Number (Nagpur) *</label>
                            <input
                              type="tel"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="e.g. 098901 xxxxx"
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 md:p-2.5 text-xs text-zinc-800 focus:outline-none"
                              required
                            />
                          </div>

                          {orderType === "delivery" && (
                            <div className="space-y-1 animate-in fade-in duration-200">
                              <label className="block text-[10px] font-bold text-zinc-500 uppercase">Delivery Address *</label>
                              <textarea
                                rows={2}
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                                placeholder="Apartment / Lane details near Dharampeth..."
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 md:p-2.5 text-xs text-zinc-800 focus:outline-none"
                                required
                              />
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase">Payment Method</label>
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs text-zinc-700 font-bold focus:outline-none"
                            >
                              <option value="cash">Pay with Cash at Mess Desk</option>
                              <option value="upi">UPI / GPay (At Counter)</option>
                            </select>
                          </div>
                        </div>

                        {/* Charges Summary breakdown */}
                        <div className="bg-zinc-50 p-4 rounded-2xl border text-xs gap-2 flex flex-col">
                          <div className="flex justify-between text-zinc-600">
                            <span>Plate items Subtotal:</span>
                            <span>₹{getSubtotal()}</span>
                          </div>
                          {orderType !== "dine-in" && (
                            <div className="flex justify-between text-zinc-600">
                              <span>Packaging Container Surcharge:</span>
                              <span>₹{getPackagingCharge()}</span>
                            </div>
                          )}
                          {orderType === "delivery" && (
                            <div className="flex justify-between text-zinc-600">
                              <span>Rider Delivery Surcharge:</span>
                              <span>₹{getDeliveryCharge()}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-extrabold text-sm text-zinc-950 pt-2 border-t border-dashed border-zinc-200">
                            <span>TOTAL COST:</span>
                            <span className="text-amber-700">₹{getTotalAmount()}</span>
                          </div>
                        </div>

                        {/* Place Order submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmittingOrder || cart.length === 0}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 transition disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md"
                        >
                          {isSubmittingOrder ? "Stamping Order..." : "Confirm & Dispatch Order"}
                        </button>
                      </form>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Complete Live Tracking Modal Dialog popup */}
      {orderConfirmation && (
        <div id="live-order-tracker-overlay" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-100">
            
            {/* Header branding */}
            <div className="bg-emerald-600 text-white py-5 px-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-white" />
                <div>
                  <h3 className="font-extrabold text-base">Rajkamal Order Dispatch!</h3>
                  <p className="text-xs text-emerald-100">Cook ID: {orderConfirmation.orderId}</p>
                </div>
              </div>
              <button
                onClick={() => setOrderConfirmation(null)}
                className="text-white hover:text-emerald-100 font-extrabold focus:outline-none"
              >
                Close [✖]
              </button>
            </div>

            {/* Tracker status content */}
            <div className="p-6 space-y-6">
              
              {/* ETA Display */}
              <div className="text-center bg-zinc-50 p-4 rounded-2xl border space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Estimated Preparation & Service timing:
                </span>
                <p className="text-lg font-black text-amber-700">{orderConfirmation.eta}</p>
                <p className="text-[10px] text-zinc-500">
                  Address details: {orderConfirmation.customer.name} • {orderConfirmation.customer.phone}
                </p>
              </div>

              {/* Progress tracker stepper visual */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Live Preparation Steps:</h4>
                <div className="relative pl-6 space-y-4">
                  {/* Vertical bar line */}
                  <div className="absolute top-1.5 bottom-1.5 left-2 w-0.5 bg-zinc-200" />

                  {[
                    { title: "Order Confirmed", desc: "Received at Dharampeth counters, kitchen prepped.", stepIdx: 0 },
                    { title: "Rassa Preparing", desc: "Saoji spices or yellow lentils being stirred by Kaka.", stepIdx: 1 },
                    { title: "Hot Chapati Cooking", desc: "Whole wheat chapatis placed on hot clay furnace.", stepIdx: 2 },
                    { title: "Ready for Delivery/Handover", desc: "Containers packed tightly with comforting aroma.", stepIdx: 3 }
                  ].map((track, i) => {
                    const isCompleted = currentTrackingStep >= track.stepIdx;
                    const isActive = currentTrackingStep === track.stepIdx;

                    return (
                      <div key={i} className="relative flex items-start space-x-3">
                        {/* Stepper Bullet circle indicator */}
                        <div
                          className={`absolute -left-6 transform -translate-x-[2px] h-3.5 w-3.5 rounded-full border-2 transition-all ${
                            isCompleted
                              ? "bg-emerald-600 border-emerald-600 scale-110"
                              : "bg-white border-zinc-300"
                          }`}
                        />
                        <div>
                          <h5
                            className={`text-xs font-bold ${
                              isActive ? "text-emerald-800" : isCompleted ? "text-zinc-800" : "text-zinc-400"
                            }`}
                          >
                            {track.title}
                            {isActive && (
                              <span className="ml-2 py-0.5 px-2 bg-emerald-100 text-emerald-800 rounded-sm text-[8px] font-bold animate-pulse uppercase">
                                Cooking Now
                              </span>
                            )}
                          </h5>
                          <p className="text-[11px] text-zinc-500">{track.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order total info display */}
              <div className="border-t border-zinc-100 pt-4 font-sans text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Order Items total:</span>
                  <span>₹{orderConfirmation.totals.itemsTotal}</span>
                </div>
                <div className="flex justify-between text-zinc-500 mt-1">
                  <span>Convenience Delivery/Packaging:</span>
                  <span>₹{orderConfirmation.totals.packagingCharge + orderConfirmation.totals.deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-800 mt-1.5">
                  <span>Grand Total Payment due ({orderConfirmation.paymentMethod.toUpperCase()}):</span>
                  <span className="text-amber-800">₹{orderConfirmation.totals.totalAmount}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-zinc-600 text-center leading-relaxed font-sans">
                💡 <span className="font-bold text-zinc-800">Chef Kaka says:</span> "We do not compromise on hygiene or flavor. We are preparing your meal now. Relax, don't worry!"
              </div>

            </div>

            <div className="bg-zinc-50 py-3.5 px-6 flex justify-end">
              <button
                onClick={() => setOrderConfirmation(null)}
                className="bg-zinc-900 border text-white font-bold text-xs py-2 px-5 rounded-xl hover:bg-zinc-800 transition"
              >
                Okay, understood!
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Kaka Chatbot Consultation element */}
      <KakaChat />

      {/* Footer copyright */}
      <footer id="main-restaurant-footer" className="bg-zinc-900 text-white pt-12 pb-6 mt-16 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-zinc-850">
            <div className="space-y-3">
              <h4 className="font-extrabold text-[#fcfaf2] tracking-wider text-sm uppercase">About Rajkamal Mess</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Located in Nagpur's bustling Dharampeth sector, Rajkamal Mess and Restaurant has been a highly beloved homely dinner kitchen. Providing premium ingredients, pure wheat breads, and unforgettable traditional spiced curries.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-extrabold text-[#fcfaf2] tracking-wider text-sm uppercase font-sans">Contact & Help</h4>
              <p className="text-zinc-400 text-xs font-sans">
                Dharampeth, Nagpur, Maharashtra 440010<br />
                Near Hanuman Mandir<br />
                Call Desk: <a href="tel:09890128111" className="text-amber-500 hover:underline font-bold">098901 28111</a>
              </p>
              <button
                onClick={() => {
                  playSynthSound("button");
                  setIsHelpDeskOpen(true);
                }}
                className="mt-2 text-xs font-bold bg-amber-600 hover:bg-amber-750 text-white py-1.5 px-3 rounded-lg transition-all cursor-pointer text-left block"
              >
                📬 Support & Catering Desk
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="font-extrabold text-[#fcfaf2] tracking-wider text-sm uppercase">Interactive Hub</h4>
              <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                Try out our steel plate customization lounges, read 942 verified review aggregates, or interact with Rajkamal Kaka's custom conversational chat systems securely.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 text-zinc-500 text-xs">
            <p>© 2026 Rajkamal Mess and Restaurant Nagpur, Inc. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span>Authentic Homemade Comfort</span>
              <span>•</span>
              <span className="text-zinc-400 cursor-pointer hover:text-white transition" onClick={() => addToast("Kaka says: All menu rates are 100% verified and approved!", "info")}>Approved Price Rates</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Stack of Toasts */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none" id="toasts-portal">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-350 ${
              toast.type === "success"
                ? "bg-emerald-900 border-emerald-805 text-white"
                : toast.type === "error"
                  ? "bg-red-900 border-red-805 text-white"
                  : "bg-zinc-900 border-zinc-805 text-white"
            }`}
          >
            {toast.type === "success" && <Check className="h-5 w-5 text-emerald-300 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-300 shrink-0" />}
            {toast.type === "info" && <Info className="h-5 w-5 text-amber-300 shrink-0" />}
            <span className="text-xs font-bold leading-tight">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Modern Interactive Share & Invite Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-205" id="share-modal-overlay">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-zinc-150 shadow-2xl relative animate-in zoom-in-95 duration-205 flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-linear-to-r from-amber-50 to-orange-50/20">
              <div>
                <h3 className="font-extrabold text-[#78350f] text-sm uppercase tracking-wider flex items-center gap-1.5">
                  🍲 Share Rajkamal Dinner Kitchen
                </h3>
                <p className="text-[11px] text-zinc-500 font-sans">Spread hot, homely meals with friends & family in Nagpur</p>
              </div>
              <button
                onClick={() => {
                  playSynthSound("button");
                  setIsShareOpen(false);
                  setShareCopied(false);
                }}
                className="text-zinc-400 hover:text-zinc-650 hover:bg-zinc-150 p-2 rounded-xl transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 font-sans">
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 relative">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Share Invite Text Preview</p>
                <p className="text-xs text-zinc-700 leading-relaxed mt-2 italic font-semibold">
                  "Hey! You must check out Rajkamal Dinner Kitchen located in Dharampeth, Nagpur. They serve authentic Unlimited Veg Thalis for just ₹150 and traditional spicy Saoji. Check out the menu and order online: {window.location.origin}"
                </p>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(`Hey! You must check out Rajkamal Dinner Kitchen in Dharampeth, Nagpur. They serve authentic Unlimited Veg Thalis for just ₹150, pure wheat chapatis & traditional Saoji! Check out menu: ${window.location.origin}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                    playSynthSound("success");
                    addToast("Opened WhatsApp Web shared page!", "success");
                  }}
                  className="bg-emerald-600 text-white font-bold p-3 rounded-2xl hover:bg-emerald-700 transition flex flex-col items-center justify-center gap-1.5 text-xs shadow-xs cursor-pointer active:scale-95"
                >
                  <Phone className="h-5 w-5 text-emerald-100 shrink-0" />
                  <span>Send WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`Hey! Check out Rajkamal Dinner Kitchen in Dharampeth, Nagpur: ${window.location.origin}`);
                    setShareCopied(true);
                    playSynthSound("success");
                    addToast("Restaurant link copied to clipboard!", "success");
                    setTimeout(() => setShareCopied(false), 3000);
                  }}
                  className="bg-zinc-900 text-white font-bold p-3 rounded-2xl hover:bg-zinc-800 transition flex flex-col items-center justify-center gap-1.5 text-xs shadow-xs cursor-pointer active:scale-95"
                >
                  {shareCopied ? (
                    <>
                      <Check className="h-5 w-5 text-amber-300 shrink-0" />
                      <span className="text-amber-300 font-extrabold">Link fields Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 text-zinc-300 shrink-0" />
                      <span>Copy link URL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="border-t border-zinc-100 pt-4 flex items-center justify-between gap-2.5">
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-zinc-800">Support Call Helpline</p>
                  <p className="text-[10px] text-zinc-500">Need caterings or big parcels? Call directly</p>
                </div>
                <a
                  href="tel:09890128111"
                  className="bg-amber-600 text-white font-extrabold text-[11px] px-4 py-2 rounded-xl hover:bg-amber-700 transition flex items-center gap-1 shrink-0"
                >
                  <Phone className="h-3 w-3" />
                  <span>098901 28111</span>
                </a>
              </div>
            </div>

            {/* Close footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  playSynthSound("button");
                  setIsShareOpen(false);
                }}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modern Interactive Support & Help Desk Modal */}
      {isHelpDeskOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-205" id="helpdesk-modal-overlay">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-zinc-150 shadow-2xl relative animate-in zoom-in-95 duration-205 flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-linear-to-r from-amber-50 to-orange-50/20">
              <div>
                <h3 className="font-extrabold text-[#78350f] text-sm uppercase tracking-wider flex items-center gap-1.5">
                  📬 Nagpur Support & Catering Desk
                </h3>
                <p className="text-[11px] text-zinc-500 font-sans">Reach Chef Kaka directly for catering query, order assist or tips</p>
              </div>
              <button
                onClick={() => {
                  playSynthSound("button");
                  setIsHelpDeskOpen(false);
                  resetSupportForm();
                }}
                className="text-zinc-400 hover:text-zinc-650 hover:bg-zinc-150 p-2 rounded-xl transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] font-sans">
              
              {!supportTicketResponse ? (
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-zinc-700 uppercase">Your Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={supportName}
                        onChange={(e) => setSupportName(e.target.value)}
                        placeholder="e.g. Ramesh Patil"
                        required
                        className="w-full bg-zinc-50 border border-zinc-250 p-2.5 text-xs rounded-xl text-zinc-805"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-zinc-700 uppercase">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        placeholder="e.g. 098901 28111"
                        required
                        className="w-full bg-zinc-50 border border-zinc-250 p-2.5 text-xs rounded-xl text-zinc-805"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="patil@gmail.com"
                      className="w-full bg-zinc-50 border border-zinc-250 p-2.5 text-xs rounded-xl text-zinc-805"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase">Query Category Type</label>
                    <select
                      value={supportType}
                      onChange={(e) => setSupportType(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-250 p-2.5 text-xs rounded-xl font-bold text-zinc-750 focus:outline-none"
                    >
                      <option value="catering">🍽️ Wedding/Party Catering Request</option>
                      <option value="complaint">🔔 Food/Tray Service Feedback</option>
                      <option value="refund">💰 Transaction/Billing Query</option>
                      <option value="partnership">💼 Business Lease or Mess Tie-up</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-zinc-700 uppercase">Detailed Message <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      required
                      placeholder="Describe what you want to inquire about..."
                      className="w-full bg-zinc-50 border border-zinc-250 p-2.5 text-xs rounded-xl text-zinc-805 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingSupport}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition cursor-pointer active:scale-99 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {isSubmittingSupport ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Secure Ticket...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-amber-300" />
                        <span>Submit Live Query</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-205">
                  <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-150">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900 uppercase">Support Ticket Generated!</h4>
                    <span className="text-emerald-700 font-mono text-xs font-bold bg-emerald-50 border border-emerald-250 px-3 py-1 rounded-full inline-block mt-1">{supportTicketResponse}</span>
                    <p className="text-zinc-500 text-xs mt-3 leading-relaxed max-w-sm mx-auto font-sans">
                      Chef Kaka's assistant coordinator will contact you at <span className="font-bold text-zinc-800">{supportPhone}</span> directly. We will address your query immediately!
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/70 border border-amber-200/50 rounded-2xl text-left">
                    <p className="text-xs font-bold text-amber-905 flex items-center gap-1">👨‍🍳 Kaka's Offline Guarantee:</p>
                    <p className="text-[11px] text-zinc-600 leading-relaxed font-sans mt-1">
                      "I receive your query at the kitchen counter door! Relax - my service team addresses every review and bulk catering inquiry individually. Don't worry, your food concerns or event queries are safe with us!"
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetSupportForm}
                    className="bg-zinc-900 text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-zinc-850 transition cursor-pointer shadow-xs active:scale-95"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

            </div>

            {/* Close footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  playSynthSound("button");
                  setIsHelpDeskOpen(false);
                  resetSupportForm();
                }}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs py-2 px-5 rounded-xl transition cursor-pointer"
              >
                Close Desk
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

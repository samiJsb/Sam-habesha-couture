import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  Send, 
  Calendar, 
  User as UserIcon, 
  CheckCircle2, 
  Heart, 
  X,
  CreditCard,
  QrCode,
  Globe,
  Share2,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Compass,
  FileText,
  Star,
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const { 
    menu, 
    cart, 
    coupon,
    addToCart, 
    removeFromCart, 
    updateCartQty, 
    applyCoupon, 
    submitOrder, 
    submitReservation 
  } = useRestaurant();
  
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Search, Categories, Wishlist
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('habesha_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  // UI Panels
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [comparisonProducts, setComparisonProducts] = useState<any[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Checkout Form State
  const [name, setName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phoneNumber || '');
  const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'TELEBIRR' | 'CBE_BIRR' | 'CHAPA' | 'CASH_ON_DELIVERY'>('CHAPA');
  const [couponCode, setCouponCode] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);

  // Bespoke Fitting / Showroom Booking State
  const [bookName, setBookName] = useState(profile?.displayName || '');
  const [bookEmail, setBookEmail] = useState(profile?.email || '');
  const [bookPhone, setBookPhone] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('14:30');
  const [bookOccasion, setBookOccasion] = useState('Wedding Bespoke Gown Consultation');
  const [bookRequests, setBookRequests] = useState('');
  const [bookSuccess, setBookSuccess] = useState(false);

  // Selected Product Sizing
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'BESPOKE'>('M');
  const [customChest, setCustomChest] = useState('');
  const [customWaist, setCustomWaist] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  // Showroom Virtual Showcase state
  const [activeHotspot, setActiveHotspot] = useState<string>('mannequins');

  // Cart Aggregate Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const discountAmount = coupon ? Math.round(cartSubtotal * (coupon.value / 100)) : 0;
  const deliveryFee = deliveryType === 'DELIVERY' && cartSubtotal > 0 ? 350 : 0; // Premium shipping
  const vAt = Math.round((cartSubtotal - discountAmount) * 0.15 * 10) / 10;
  const cartTotal = cartSubtotal - discountAmount + deliveryFee + vAt;

  // Sync Wishlist to local storage
  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = wishlist.includes(id) 
      ? wishlist.filter(x => x !== id) 
      : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem('habesha_wishlist', JSON.stringify(updated));
  };

  // Sync Piece Comparison Limit 3
  const toggleComparison = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (comparisonProducts.find(p => p.id === product.id)) {
      setComparisonProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (comparisonProducts.length >= 3) {
        alert("You can compare up to 3 luxury fashion pieces simultaneously.");
        return;
      }
      setComparisonProducts(prev => [...prev, product]);
    }
  };

  const handleOrderCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || (deliveryType === 'DELIVERY' && !address)) {
      alert("Please fill out all required shipping fields.");
      return;
    }

    const outcome = await submitOrder({
      customerName: name,
      customerPhone: phone,
      deliveryType,
      deliveryAddress: address,
      paymentMethod
    });

    if (outcome.success) {
      setSubmitSuccess({
        id: outcome.order?.id,
        total: outcome.order?.total,
        payment: paymentMethod,
        redirect: outcome.redirectUrl
      });
      setCheckoutOpen(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName || !bookPhone || !bookDate) {
      alert("Please specify Client Name, Phone, and Consultation Date.");
      return;
    }
    const success = await submitReservation({
      name: bookName,
      email: bookEmail,
      phone: bookPhone,
      date: bookDate,
      time: bookTime,
      guestsCount: 1, 
      occasion: bookOccasion,
      specialRequests: `${bookRequests} | Size preference: ${selectedSize}. ${
        selectedSize === 'BESPOKE' ? `Bespoke ratios: Chest:${customChest} Waist:${customWaist} Height:${customHeight}` : ''
      }`
    });
    if (success) {
      setBookSuccess(true);
      setTimeout(() => setBookSuccess(false), 8000);
      setBookName('');
      setBookPhone('');
      setBookDate('');
      setBookRequests('');
      setBookingOpen(false);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const success = applyCoupon(couponCode);
    if (!success) {
      alert("This coupon code is invalid or has expired.");
    }
  };

  // Filtered Grid
  const filteredProducts = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNavCategoryClick = (category: string) => {
    setActiveCategory(category);
    setTimeout(() => {
      const element = document.getElementById('avenue');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return menu.length;
    return menu.filter(item => item.category === catId).length;
  };

  return (
    <div className="min-h-screen bg-[#030303] text-[#F5F5F7] font-sans selection:bg-[#D4C3AC]/30 selection:text-[#D4C3AC] overflow-x-hidden">
      
      {/* Editorial Luxury Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#030303]/85 backdrop-blur-md border-b border-[#141414] py-6 px-6 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex flex-col select-none">
            <span className="text-sm tracking-[0.35em] font-serif font-black text-[#D4C3AC] leading-none">HABESHA</span>
            <span className="text-[8px] tracking-[0.45em] font-serif font-black text-white/50 mt-1 leading-none">COUTURE</span>
          </Link>
 
          {/* Minimalist Navigation Category Tags */}
          <nav className="hidden lg:flex items-center gap-10 text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-bold">
            <button 
              onClick={() => handleNavCategoryClick('all')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeCategory === 'all' ? 'text-[#D4C3AC] border-b border-[#D4C3AC]' : ''}`}
            >
              The Avenue
            </button>
            <button 
              onClick={() => handleNavCategoryClick('traditional')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeCategory === 'traditional' ? 'text-[#D4C3AC] border-b border-[#D4C3AC]' : ''}`}
            >
              Traditional Kemis
            </button>
            <button 
              onClick={() => handleNavCategoryClick('jewelry')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeCategory === 'jewelry' ? 'text-[#D4C3AC] border-b border-[#D4C3AC]' : ''}`}
            >
              Axum Gold
            </button>
            <button 
              onClick={() => handleNavCategoryClick('shoes')} 
              className={`hover:text-white transition-colors cursor-pointer ${activeCategory === 'shoes' ? 'text-[#D4C3AC] border-b border-[#D4C3AC]' : ''}`}
            >
              Awash Leather
            </button>
            <button 
              onClick={() => setBookingOpen(true)}
              className="text-[#D4C3AC] hover:text-white transition-colors cursor-pointer border-b border-dashed border-[#D4C3AC] pb-0.5"
            >
              VIP Tailoring visit
            </button>
          </nav>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setWishlistOpen(true)}
            className="p-1 text-zinc-400 hover:text-white transition-colors relative cursor-pointer"
            title="Wishlist Repository"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4C3AC] text-black text-[7px] font-bold px-1 rounded-full">{wishlist.length}</span>
            )}
          </button>

          <button 
            onClick={() => setCartOpen(true)}
            className="p-1 text-zinc-400 hover:text-white transition-colors relative flex items-center gap-2 cursor-pointer"
            title="Consignment Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[10px] font-mono text-zinc-300 font-bold">{cart.length}</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            )}
          </button>

          <Link 
            to="/login"
            className="hidden sm:inline-flex text-[9px] uppercase tracking-[0.2em] font-bold text-black bg-[#D4C3AC] hover:bg-white transition-all px-4 py-2 rounded-md"
          >
            {profile ? 'Atelier Control' : 'Client Login'}
          </Link>
        </div>
      </header>

      {/* Cinematic Editorial Campaign Showcase (Hero) */}
      <section className="relative min-h-[92vh] flex items-center px-6 md:px-16 lg:px-24 border-b border-[#141414]">
        {/* Campaign Visual Layer */}
        <div className="absolute inset-0 bg-cover bg-center filter brightness-[1.1] contrast-[1.02]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1800')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent"></div>
        
        <div className="max-w-4xl text-left space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[9px] font-bold text-[#D4C3AC] tracking-[0.35em] uppercase font-mono"
          >
            PREMIUM ETHIOPIAN HERITAGE COUTURE &bull; AUTUMN CAMPAIGN
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-black uppercase tracking-tight leading-[1.0] text-neutral-100"
          >
            THE LUXE WEAVE OF <br />
            <span className="font-serif italic text-[#D4C3AC] font-light">HABESHA LANDS</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-zinc-400 font-sans text-xs md:text-sm max-w-xl leading-relaxed"
          >
            Hand-spun organic high-altitude cotton looms, handwoven with historic Axumite embroidery cascading on floor-length dresses, 21kt gold hand-sculpted filigree cuffs, and premium Awash Valley natural leather footwear. Underpinned with strict modern minimalist design patterns.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <a 
              href="#avenue" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.25em] font-bold rounded-none hover:bg-[#D4C3AC] transition-all text-center"
            >
              Shop The Avenue
            </a>
            <button 
              onClick={() => setBookingOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-[0.25em] font-bold rounded-none transition-all text-center cursor-pointer"
            >
              Atelier Appointment
            </button>
          </motion.div>
        </div>

        {/* Bottom Campaign Coordinates */}
        <div className="absolute bottom-8 left-8 hidden md:flex items-center gap-12 text-zinc-600 text-[8px] font-mono uppercase tracking-[0.25em]">
          <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#D4C3AC]" /> Bole Showroom, Addis Ababa</div>
          <div className="flex items-center gap-2"><Compass className="w-3 h-3 text-[#D4C3AC]" /> 9.0300° N, 38.7400° E</div>
        </div>
      </section>

      {/* Narrative Editorial Section */}
      <section className="py-28 px-6 md:px-16 lg:px-24 border-b border-[#141414] bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[8px] font-bold tracking-[0.4em] text-[#D4C3AC] uppercase font-mono block">CRAFT PHILOSOPHY</span>
            <h3 className="text-3xl sm:text-4xl font-serif text-white tracking-tight uppercase leading-snug">
              WHERE TIMELESS GEOMETRY CONVERGES WITH FINE THREADS
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed">
              Every garment in our Habesha collection is forged through weeks of painstaking manual work by multi-generational master weavers. We sourced pure cotton from Gonder valleys and combined it with traditional Axumite motifs woven with golden and silver threads.
            </p>
            <div className="border-t border-[#141414] pt-6 flex items-center gap-10">
              <div>
                <span className="text-xl font-serif font-bold text-white block">14+</span>
                <span className="text-[8px] tracking-widest text-zinc-500 uppercase">WEAVING DAYS</span>
              </div>
              <div className="w-[1px] h-10 bg-[#141414]" />
              <div>
                <span className="text-xl font-serif font-bold text-white block">21kt</span>
                <span className="text-[8px] tracking-widest text-zinc-500 uppercase">GOLD ACCENTS</span>
              </div>
              <div className="w-[1px] h-10 bg-[#141414]" />
              <div>
                <span className="text-xl font-serif font-bold text-white block">100%</span>
                <span className="text-[8px] tracking-widest text-zinc-500 uppercase">HANDSPUN COTTON</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-zinc-900 overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600" 
                alt="Empress Saba Traditional" 
                className="w-full h-full object-cover brightness-100 contrast-[1.02] group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-wider font-bold text-white font-serif">TRADITIONAL HERITAGE</span>
            </div>
            <div className="aspect-[3/4] bg-zinc-900 translate-y-8 overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600" 
                alt="Modern Suit Jacket" 
                className="w-full h-full object-cover brightness-100 contrast-[1.02] group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-wider font-bold text-white font-serif">MODERN STRUCTURE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive virtual luxury showroom section (Bole Showroom) */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#030303] border-b border-[#141414] overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[8px] font-[900] tracking-[0.45em] text-[#D4C3AC] uppercase font-mono block">BOLE CORRIDOR ATELIER</span>
            <h3 className="text-2xl sm:text-4xl font-serif text-white tracking-tight uppercase">
              THE VIP PRIVATE SHOWROOM
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-lg mx-auto">
              Inspect our high-altitude high-fashion dressing vault. We’ve brought the physical sanctuary on-screen. Hover or click on the glowing indicators to inspect active details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Interactive Image - Columns 1 to 8 */}
            <div className="lg:col-span-8 relative group rounded-none overflow-hidden border border-[#141414] shadow-2xl">
              {/* Luxury dark showroom Image */}
              <img 
                src="/vip_showroom.jpg" 
                alt="Habesha Couture VIP Showroom" 
                className="w-full aspect-[16/10] object-cover brightness-[102%] contrast-[1.02] transition-transform duration-700 select-none group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Glowing Interactive Hotspots */}
              {[
                {
                  id: 'mannequins',
                  x: '25%',
                  y: '48%',
                  title: 'Imperial Silhouette Glass Case',
                },
                {
                  id: 'marble',
                  x: '52%',
                  y: '72%',
                  title: 'Noir Marble Accessory Block',
                },
                {
                  id: 'racks',
                  x: '84%',
                  y: '40%',
                  title: 'Brushed Gold Wardrobe Rails',
                }
              ].map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot.id)}
                  onMouseEnter={() => setActiveHotspot(spot.id)}
                  style={{ left: spot.x, top: spot.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-3 cursor-pointer group/spot focus:outline-none"
                >
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-[#D4C3AC]/30 animate-ping" />
                  <span className={`relative inline-flex rounded-full h-4.5 w-4.5 items-center justify-center transition-all ${activeHotspot === spot.id ? 'bg-[#D4C3AC] scale-125 shadow-lg' : 'bg-white hover:bg-[#D4C3AC]'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  </span>
                </button>
              ))}
            </div>

            {/* Sidebar displaying active hotspot specs - Columns 9 to 12 */}
            <div className="lg:col-span-4 h-full flex flex-col justify-between">
              <div className="p-8 bg-[#070709] border border-[#141414] rounded-none space-y-6 h-full flex flex-col justify-center min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4C3AC]" />
                    <span className="text-[8px] font-bold tracking-[0.3em] font-mono text-[#D4C3AC] uppercase">Interactive Cabinet Showcase</span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {(() => {
                      const spot = [
                        {
                          id: 'mannequins',
                          title: 'Imperial Silhouette Glass Case',
                          desc: 'Featuring our signature custom-tailored Emperor & Empress wedding gowns draped with champagne silk linings and handloom silver thread borders, exactly matching our premium bridal and black halter silhouettes.'
                        },
                        {
                          id: 'marble',
                          title: 'Noir Marble Accessory Block',
                          desc: 'Handcrafted pure premium leather accessories on dark emperador marble. Exhibits quilted lambskin clutches with gold chain shoulder straps, luxury perfumes, and genuine sun-dried leather pumps.'
                        },
                        {
                          id: 'racks',
                          title: 'Brushed Gold Wardrobe Rails',
                          desc: 'Exquisite evening dresses and modern couture jackets elegantly displayed on heavy gold-plated clothing rails, offering custom trial measurements during private VIP consultations.'
                        }
                      ].find(s => s.id === activeHotspot);

                      if (!spot) return null;

                      return (
                        <motion.div
                          key={spot.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          <h4 className="text-sm font-serif font-black text-white uppercase tracking-wider">{spot.title}</h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">{spot.desc}</p>
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                <div className="h-[1px] bg-[#141414]" />

                <div className="space-y-3">
                  <span className="text-[8px] tracking-widest text-zinc-600 uppercase font-mono block">ATELIER PRIVILEGE</span>
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="w-full py-3 bg-[#D4C3AC] hover:bg-white text-black text-[9px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
                  >
                    Request Showroom Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Piece Comparison Banner */}
      {comparisonProducts.length > 0 && (
        <section className="bg-[#121212] border-b border-[#D4C3AC]/20 py-4 px-6 md:px-16 lg:px-24 flex items-center justify-between gap-4 sticky bottom-0 z-30 shadow-2xl">
          <div className="flex items-center gap-6">
            <span className="text-[9px] font-bold tracking-widest text-[#D4C3AC] uppercase font-mono">Comparing ({comparisonProducts.length}):</span>
            <div className="flex gap-3">
              {comparisonProducts.map(p => (
                <div key={p.id} className="flex items-center gap-1.5 p-1 px-2.5 bg-black rounded border border-[#141414] text-[9px] uppercase tracking-wider font-bold text-white">
                  <span>{p.name.split(' ')[0]}</span>
                  <button onClick={(e) => toggleComparison(p, e)} className="text-zinc-500 hover:text-white ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => {
              setSelectedProduct(comparisonProducts[0]);
              // Trigger inspection with side-by-side specs
            }}
            className="text-[9px] uppercase tracking-widest font-black text-black bg-[#D4C3AC] px-4 py-2 hover:bg-white transition-all cursor-pointer"
          >
            Review Specs
          </button>
        </section>
      )}

      {/* The Avenue Showroom Catalog */}
      <section id="avenue" className="py-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header Controls for Selection & Sizing */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-[#141414] pb-6">
            <div className="space-y-2">
              <span className="text-[8px] font-bold tracking-[0.4em] text-zinc-500 uppercase font-mono">SELECTED WORKS</span>
              <h3 className="text-2xl sm:text-3xl font-serif text-white uppercase tracking-tight">THE BOUTIQUE AVENUE</h3>
            </div>

            {/* Catalog search and settings */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              {/* Search Widget */}
              <div className="relative flex-1 md:flex-none">
                <Search className="w-3.5 h-3.5 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by title..."
                  className="bg-[#0A0A0A] border border-[#141414] text-[10px] text-white p-3.5 pl-10 w-full md:w-48 placeholder-zinc-600 focus:outline-none focus:border-[#D4C3AC] uppercase font-mono tracking-wider"
                />
              </div>

              {/* Reset Categories */}
              {activeCategory !== 'all' && (
                <button 
                  onClick={() => setActiveCategory('all')} 
                  className="text-[8px] text-zinc-500 uppercase tracking-widest hover:text-white border-b border-zinc-500 cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          {/* Real-time Category Selector Rail */}
          <div className="flex items-center gap-2 overflow-x-auto text-[9px] uppercase tracking-[0.2em] scrollbar-none border-b border-[#141414]/10 pb-4 font-bold">
            {[
              { id: 'all', name: 'ALL COLLECTION' },
              { id: 'traditional', name: 'TRADITIONAL KEMIS' },
              { id: 'clothing', name: 'MODERN COUTURE' },
              { id: 'jewelry', name: 'AXUM GOLD' },
              { id: 'shoes', name: 'PREMIUM FOOTWEAR' },
              { id: 'cosmetics', name: 'AMBER RESINS' },
              { id: 'boutique', name: 'SILK WRAPS' },
            ].map((cat, idx) => {
              const count = getCategoryCount(cat.id);
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-2 px-3.5 break-keep shrink-0 transition-all cursor-pointer flex items-center gap-2 border border-[#141414] rounded-none ${
                    isActive 
                      ? "text-black bg-[#D4C3AC] border-[#D4C3AC]" 
                      : "text-zinc-500 hover:text-white bg-[#0A0A0C]"
                  }`}
                >
                  <span className={`text-[7px] font-mono ${isActive ? "text-black/60" : "text-zinc-600"}`}>0{idx + 1}</span>
                  <span className="tracking-widest">{cat.name}</span>
                  <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 ${isActive ? "bg-black/10 text-black" : "bg-[#141414] text-[#D4C3AC]"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Pieces Catalog Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map(product => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div 
                  key={product.id} 
                  className="group flex flex-col space-y-4"
                >
                  {/* Photo Section */}
                  <div className="aspect-[3/4] bg-zinc-900 border border-[#141414] overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover brightness-[1.02] contrast-[1.02] group-hover:scale-105 transition-all duration-500 ease-out" 
                    />
                    
                    {/* Action Selectors on Image hover */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2.5 rounded-full backdrop-blur-md border cursor-pointer transition-all ${
                          isWishlisted 
                            ? "bg-white text-black border-white" 
                            : "bg-black/60 text-white border-white/10 hover:bg-black"
                        }`}
                        title="Repository"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                      </button>

                      <button 
                        onClick={(e) => toggleComparison(product, e)}
                        className={`p-2.5 rounded-full backdrop-blur-md border cursor-pointer transition-all ${
                          comparisonProducts.find(p => p.id === product.id)
                            ? "bg-[#D4C3AC] text-black border-[#D4C3AC]"
                            : "bg-black/60 text-white border-white/10 hover:bg-black"
                        }`}
                        title="Compare Specifications"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Sizing Tags preview overlay */}
                    {product.preparationTime && (
                      <span className="absolute bottom-4 left-4 bg-black/60 border border-white/5 text-[8px] font-bold text-zinc-300 px-2 py-1 uppercase tracking-widest">
                        {product.preparationTime} DAY DELIVERY
                      </span>
                    )}
                  </div>

                  {/* Descriptions Section */}
                  <div className="space-y-1.5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white line-clamp-1">{product.name}</h4>
                      <span className="text-[11px] font-mono tracking-wider text-[#D4C3AC] shrink-0 font-bold">{product.price.toLocaleString()} ETB</span>
                    </div>
                    <span className="text-[8px] tracking-widest text-zinc-500 uppercase font-mono">{product.category}</span>
                    <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2 mt-1">{product.description}</p>
                    
                    {/* Button trigger modal to Inspect Sizing & Order */}
                    <button 
                      onClick={() => {
                        setSelectedProduct(product);
                        setSelectedSize('M');
                      }}
                      className="text-[8px] uppercase tracking-widest font-black text-zinc-500 group-hover:text-[#D4C3AC] border-b border-[#141414] group-hover:border-[#D4C3AC] py-2 w-fit pt-4 transition-all cursor-pointer"
                    >
                      Inspect Specs & Order
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State visual checker */}
          {filteredProducts.length === 0 && (
            <div className="p-16 text-center border border-dashed border-[#141414] rounded">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">No active boutique pieces match your query</p>
              <button 
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                className="text-[9px] uppercase tracking-widest text-[#D4C3AC] border-b border-[#D4C3AC] mt-4 font-bold cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* INSPECTION MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-4xl bg-[#0A0A0A] border border-[#141414] grid grid-cols-1 md:grid-cols-2 relative shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/60 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Photo */}
              <div className="aspect-[3/4] md:aspect-auto bg-zinc-900 border-r border-[#141414]">
                <img src={selectedProduct.image} alt="" className="w-full h-full object-cover brightness-[1.02] contrast-[1.02]" />
              </div>

              {/* Right Specs & Ordering controls */}
              <div className="p-8 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[8px] font-bold tracking-[0.4em] text-zinc-500 uppercase font-mono block">{selectedProduct.category}</span>
                  <h3 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-tight">{selectedProduct.name}</h3>
                  <div className="text-lg font-mono text-[#D4C3AC] font-bold">{selectedProduct.price.toLocaleString()} ETB</div>
                  
                  <div className="h-[1px] bg-[#141414]" />
                  
                  <p className="text-zinc-400 text-xs leading-relaxed">{selectedProduct.description}</p>
                  
                  {/* Sizing Picker */}
                  <div className="space-y-2.5">
                    <span className="text-[8px] font-bold tracking-widest text-[#D4C3AC] uppercase font-mono block">SELECT CUSTOM RATIO</span>
                    <div className="grid grid-cols-6 gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'BESPOKE'].map(sz => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz as any)}
                          className={`py-2 text-[9px] font-bold tracking-wider rounded border cursor-pointer transition-all ${
                            selectedSize === sz 
                              ? "bg-white text-black border-white" 
                              : "bg-black/40 text-white border-[#141414] hover:border-zinc-700"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bespoke ratio inputs */}
                  {selectedSize === 'BESPOKE' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 'auto', height: 'auto' }}
                      className="p-4 bg-[#141414]/30 border border-[#D4C3AC]/15 space-y-3"
                    >
                      <span className="text-[8px] font-bold tracking-widest text-zinc-400 uppercase font-mono block">ATELIER MEASUREMENT RATIOS (cm):</span>
                      <div className="grid grid-cols-3 gap-3">
                        <input 
                          type="number" 
                          value={customChest}
                          onChange={e => setCustomChest(e.target.value)}
                          placeholder="Chest width"
                          className="bg-black text-[9px] font-mono border border-[#141414] text-white p-2 w-full"
                        />
                        <input 
                          type="number" 
                          value={customWaist}
                          onChange={e => setCustomWaist(e.target.value)}
                          placeholder="Waist width"
                          className="bg-black text-[9px] font-mono border border-[#141414] text-white p-2 w-full"
                        />
                        <input 
                          type="number" 
                          value={customHeight}
                          onChange={e => setCustomHeight(e.target.value)}
                          placeholder="Height"
                          className="bg-black text-[9px] font-mono border border-[#141414] text-white p-2 w-full"
                        />
                      </div>
                      <p className="text-[7px] text-[#D4C3AC] uppercase tracking-normal">OUR MASTER SEWERS WILL CONSTRUCT THIS GARMENT SECURELY ACCORDING TO THESE METRICS.</p>
                    </motion.div>
                  )}
                </div>

                {/* Confirm order and close */}
                <div className="pt-4 border-t border-[#141414]">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, {
                        size: selectedSize,
                        ratios: selectedSize === 'BESPOKE' ? `Chest:${customChest} Waist:${customWaist} Height:${customHeight}` : undefined
                      });
                      setSelectedProduct(null);
                      setCartOpen(true);
                    }}
                    className="w-full py-4 bg-[#D4C3AC] hover:bg-white text-black text-[10px] uppercase tracking-[0.2em] font-black transition-all cursor-pointer shadow-lg"
                  >
                    Consign Piece to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART OVERLAY DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-[#070707] border-l border-[#141414] h-full flex flex-col justify-between shadow-2xl relative">
              
              {/* Header */}
              <div className="p-6 border-b border-[#141414] flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[7px] font-mono tracking-widest text-zinc-500 uppercase">LEDGER</span>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4C3AC]">CONSIGNMENT CART</h4>
                </div>
                <button 
                  onClick={() => setCartOpen(false)} 
                  className="p-1 px-2.5 rounded bg-zinc-900 border border-white/5 hover:text-white text-zinc-500 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Sizing list item queue */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <ShoppingBag className="w-8 h-8 text-zinc-700 mb-4" />
                    <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">Your consignment is empty</p>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="text-[9px] uppercase tracking-widest text-[#D4C3AC] border-b border-[#D4C3AC] mt-3 font-bold cursor-pointer"
                    >
                      Shop Avenue Catalog
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="p-4 bg-[#0A0A0A] border border-[#141414] rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <img src={item.menuItem.image} alt="" className="w-12 h-16 object-cover rounded" />
                        <div className="flex-1 space-y-0.5">
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-white line-clamp-1">{item.menuItem.name}</h5>
                          <p className="text-[8px] font-bold text-[#D4C3AC] uppercase tracking-widest font-mono">
                            {item.menuItem.price.toLocaleString()} ETB
                          </p>
                          {item.specialInstructions && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-900 border border-white/5 text-[7px] text-[#D4C3AC] uppercase tracking-widest font-mono">
                              Spec: {item.specialInstructions}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-600 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold">Consignment count</span>
                        <div className="flex items-center gap-2">
                          <button 
                            disabled={item.quantity <= 1}
                            onClick={() => updateCartQty(item.id, item.quantity - 1)}
                            className="p-1 px-2.5 bg-zinc-900 border border-white/5 hover:text-white transition-colors cursor-pointer text-[10px]"
                          >
                            -
                          </button>
                          <span className="text-[10px] font-mono text-white font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.id, item.quantity + 1)}
                            className="p-1 px-2.5 bg-zinc-900 border border-white/5 hover:text-white transition-colors cursor-pointer text-[10px]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Settlement accounting logs */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#09090C] border-t border-[#141414] space-y-4">
                  {/* Coupon Code section */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="ENTER VOUCHER..."
                      className="flex-1 bg-black text-[9px] font-mono border border-[#141414] p-3 text-white uppercase placeholder-zinc-700"
                    />
                    <button type="submit" className="bg-[#D4C3AC] text-black text-[8px] font-black uppercase tracking-widest px-4 font-sans hover:bg-white cursor-pointer">
                      APPLY
                    </button>
                  </form>
                  {coupon && (
                    <p className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">
                      Voucher Loaded: {coupon.code} (-{coupon.value}%)
                    </p>
                  )}

                  <div className="space-y-1.5 font-mono text-[9px] text-zinc-400">
                    <div className="flex justify-between">
                      <span>Consignment Base:</span>
                      <span>{cartSubtotal.toLocaleString()} ETB</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-500">
                        <span>Heritage discount:</span>
                        <span>-{discountAmount.toLocaleString()} ETB</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>15% Net VAT:</span>
                      <span>{vAt.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Courier Handling:</span>
                      <span>{deliveryFee.toLocaleString()} ETB</span>
                    </div>
                    <div className="h-[1px] bg-[#141414] my-2" />
                    <div className="flex justify-between text-[11px] font-bold text-[#D4C3AC]">
                      <span>Aggregate Bill:</span>
                      <span>{cartTotal.toLocaleString()} ETB</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#D4C3AC] transition-all cursor-pointer"
                  >
                    CONSIGN SETTLEMENT
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT SETTLEMENT OVERLAY */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl bg-[#0A0A0A] border border-[#141414] rounded-xl p-8 space-y-6 relative"
            >
              <button 
                onClick={() => setCheckoutOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>

              <div className="space-y-1">
                <span className="text-[8px] font-mono tracking-widest text-[#D4C3AC] uppercase">SETTLEMENT INTEGRATION</span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white font-serif">DISPATCH BILLING ADVICE</h3>
                <p className="text-[11px] text-zinc-500">Submit your settlement instructions. Chapa, Telebirr, and CBE Birr instant wallet clearing rules are mapped.</p>
              </div>

              <form onSubmit={handleOrderCheckout} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase font-mono block">Consign Name *</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder=" Bethlehem Nega"
                      className="w-full bg-black border border-[#141414] rounded p-3 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold tracking-widest text-[#D4C3AC] uppercase font-mono block">Contact Phone *</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+251 9..."
                      className="w-full bg-black border border-[#141414] rounded p-3 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase font-mono block">Logistics Courier Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('DELIVERY')}
                      className={`py-3 text-[9px] font-bold uppercase tracking-wider rounded border cursor-pointer transition-all ${
                        deliveryType === 'DELIVERY' 
                          ? "bg-white text-black border-white" 
                          : "bg-black text-white border-[#141414] hover:border-zinc-700"
                      }`}
                    >
                      EXPRESS SHIPPING (+350 ETB)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('PICKUP')}
                      className={`py-3 text-[9px] font-bold uppercase tracking-wider rounded border cursor-pointer transition-all ${
                        deliveryType === 'PICKUP' 
                          ? "bg-white text-black border-white" 
                          : "bg-black text-white border-[#141414] hover:border-zinc-700"
                      }`}
                    >
                      BOLE FLAGSHIP CORRIDOR COUTURES
                    </button>
                  </div>
                </div>

                {deliveryType === 'DELIVERY' && (
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase font-mono block">Physical Coordinates/Address *</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Bole Century Mall, Apt 3B"
                      className="w-full bg-black border border-[#141414] rounded p-3 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[8px] font-bold tracking-widest text-[#D4C3AC] uppercase font-mono block">Settlement Channel Gateway</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'CHAPA', name: 'Chapa Pay' },
                      { id: 'TELEBIRR', name: 'Telebirr' },
                      { id: 'CBE_BIRR', name: 'CBE Birr' },
                      { id: 'CASH_ON_DELIVERY', name: 'COD courier' }
                    ].map(ch => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setPaymentMethod(ch.id as any)}
                        className={`p-2 py-3 rounded text-[8px] uppercase font-bold tracking-widest border cursor-pointer transition-all ${
                          paymentMethod === ch.id 
                            ? "bg-[#D4C3AC] text-black border-[#D4C3AC]" 
                            : "bg-black border-[#141414] text-zinc-400"
                        }`}
                      >
                        {ch.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/60 rounded flex items-start gap-3 text-[9px] text-zinc-400 leading-relaxed uppercase">
                  <Info className="w-3.5 h-3.5 text-[#D4C3AC] shrink-0 mt-0.5" />
                  <p>Settlement clearances are instantaneous. Digital verification tokens are signed through secure SHA512 rules.</p>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#D4C3AC] transition-all cursor-pointer"
                >
                  DEPOSIT CONSIGNMENT ({(cartTotal).toLocaleString()} ETB)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIGNED SETTLEMENT NOTIFICATION MODAL */}
      <AnimatePresence>
        {submitSuccess && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#070707] border-2 border-[#D4C3AC]/20 p-8 text-center space-y-6 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#D4C3AC_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              <div className="w-12 h-12 bg-[#D4C3AC]/10 border border-[#D4C3AC]/30 rounded-full flex items-center justify-center mx-auto text-[#D4C3AC]">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-[7px] font-mono tracking-widest text-[#D4C3AC] uppercase">TRANSACTION LOCKED</span>
                <h3 className="text-xl font-serif text-white uppercase tracking-tight">HERITAGE CLEARANCE SIGNED</h3>
                <p className="text-[10px] text-zinc-400 leading-relaxed uppercase font-sans">
                  The order ledger registered ID: <span className="text-white font-bold">{submitSuccess.id}</span>
                </p>
                <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">
                  Expected custom hand-crafting turnaround is noted securely in Bole Atelier registers. Keep this advice token active.
                </p>
              </div>

              {submitSuccess.redirect && (
                <a 
                  href={submitSuccess.redirect}
                  className="inline-flex text-[9px] uppercase tracking-[0.25em] font-black text-black bg-[#D4C3AC] px-6 py-3 hover:bg-white transition-all font-sans"
                >
                  Clearance payment link
                </a>
              )}

              <div className="pt-4 border-t border-[#141414] flex justify-between text-zinc-600 text-[8px] font-mono">
                <span>GATEWAY: {submitSuccess.payment}</span>
                <span>STATUS: STABLE</span>
              </div>

              <button 
                onClick={() => {
                  setSubmitSuccess(null);
                  window.location.reload();
                }}
                className="w-full py-3 bg-zinc-900 border border-white/5 text-white text-[9px] uppercase tracking-widest font-bold hover:bg-zinc-850 cursor-pointer"
              >
                Close advice log
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* WISHLIST DRAWER OVERLAY */}
      <AnimatePresence>
        {wishlistOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-sm bg-[#070707] border-l border-[#141414] h-full flex flex-col justify-between shadow-2xl relative">
              
              <div className="p-6 border-b border-[#141414] flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[7px] font-mono tracking-widest text-zinc-500 uppercase">VAULT</span>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4C3AC]">WISHLIST REPOSITORY</h4>
                </div>
                <button onClick={() => setWishlistOpen(false)} className="px-3 py-1.5 rounded bg-zinc-900 border border-white/5 hover:text-white text-zinc-500 cursor-pointer">
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Heart className="w-6 h-6 text-zinc-800 mb-3" />
                    <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-500">Repository is clear</p>
                  </div>
                ) : (
                  menu.filter(p => wishlist.includes(p.id)).map(p => (
                    <div key={p.id} className="p-4 bg-[#0A0A0A] border border-[#141414] rounded flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-14 object-cover rounded" />
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-white line-clamp-1">{p.name}</h5>
                          <span className="text-[8px] font-mono text-zinc-500 block uppercase mt-0.5">{p.price.toLocaleString()} ETB</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleWishlist(p.id)}
                        className="text-zinc-600 hover:text-white p-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-[#141414] bg-[#09090C]">
                <button 
                  onClick={() => {
                    setWishlistOpen(false);
                  }}
                  className="w-full py-4 bg-zinc-900 text-white border border-white/5 text-[9px] font-black uppercase tracking-widest hover:text-[#D4C3AC] transition-all cursor-pointer"
                >
                  Return to avenue Catalog
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Fitting Modal */}
      {bookingOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#09090C] border border-[#141414] p-8 space-y-6 relative rounded-lg"
          >
            <button 
              onClick={() => setBookingOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[8px] tracking-widest text-[#D4C3AC] uppercase font-mono block">VIP CONSULTATION RESERVATION</span>
              <h3 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-tight">COUTURE FITTING SCHEDULE</h3>
              <p className="text-[11px] text-zinc-500">Plan your custom measurements session or private design review at our Bole Millennium showroom.</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-500 uppercase font-bold block">Client Name *</label>
                  <input 
                    type="text" 
                    value={bookName}
                    onChange={e => setBookName(e.target.value)}
                    placeholder=" Bethlehem Nega"
                    className="w-full bg-black border border-[#141414] text-xs text-white p-3 rounded focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-500 uppercase font-bold block">Private Phone *</label>
                  <input 
                    type="tel" 
                    value={bookPhone}
                    onChange={e => setBookPhone(e.target.value)}
                    placeholder="+251 9..."
                    className="w-full bg-black border border-[#141414] text-xs text-white p-3 rounded focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono text-zinc-500 uppercase font-bold block">Client Email</label>
                <input 
                  type="email" 
                  value={bookEmail}
                  onChange={e => setBookEmail(e.target.value)}
                  placeholder="name@exclusive.com"
                  className="w-full bg-black border border-[#141414] text-xs text-white p-3 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-[#D4C3AC] uppercase font-bold block">Preferred Date *</label>
                  <input 
                    type="date" 
                    value={bookDate}
                    onChange={e => setBookDate(e.target.value)}
                    className="w-full bg-black border border-[#141414] text-xs text-white p-3 rounded focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-mono text-zinc-500 uppercase font-bold block">Arrival Slot</label>
                  <select 
                    value={bookTime}
                    onChange={e => setBookTime(e.target.value)}
                    className="w-full bg-black border border-[#141414] text-xs text-white p-3 rounded focus:outline-none"
                  >
                    <option value="10:00">10:00 AM (Morning Loom)</option>
                    <option value="12:00">12:00 PM (Showroom review)</option>
                    <option value="14:30">02:30 PM (Private measures)</option>
                    <option value="16:00">04:00 PM (VIP Exclusive)</option>
                    <option value="18:00">06:00 PM (Sunset fittings)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono text-zinc-500 uppercase font-bold block">Couture Purpose</label>
                <select 
                  value={bookOccasion} 
                  onChange={e => setBookOccasion(e.target.value)}
                  className="w-full bg-black border border-[#141414] text-xs text-white p-3 rounded focus:outline-none"
                >
                  <option value="Wedding Bespoke Gown Consultation">ENGAGEMENT & WEDDING EMBROIDERY BESPOKE</option>
                  <option value="Axum Gold Styling Session">AXUM GOLD JEWELRY CUSTOM MEASUREMENTS</option>
                  <option value="Traditional Custom Kemis Sizing">TRADITIONAL KEMIS HANDLOOM SELECTION</option>
                  <option value="VIP Runway Collection Private Order">RUNWAY FIRST-LOOK COUTURE ORDER</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-mono text-zinc-500 uppercase font-bold block">Special requests (Optional)</label>
                <textarea 
                  value={bookRequests} 
                  onChange={e => setBookRequests(e.target.value)}
                  placeholder="Thread tones, design codes, or unique custom proportions..."
                  className="w-full bg-black border border-[#141414] text-xs text-white p-3 h-20 rounded focus:outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-white text-black text-[10px] uppercase font-black tracking-widest hover:bg-[#D4C3AC] transition-all cursor-pointer"
              >
                REQUEST PRIVATE PASS
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Tailor Pass Success Dialog */}
      {bookSuccess && (
        <div className="fixed bottom-10 right-10 z-[100] max-w-sm">
          <div className="p-4 bg-zinc-950 border border-emerald-500 rounded flex items-start gap-3 shadow-2xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">Showroom reservation logged</h5>
              <p className="text-[8px] text-zinc-400 mt-1 uppercase">Our master design coordinator has approved your Bole showroom session. A pass code was generated.</p>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Editorial Footer */}
      <footer className="bg-black border-t border-[#141414] py-16 px-6 md:px-16 lg:px-24 text-zinc-500 text-xs text-center space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-6">
          <div className="space-y-1 text-left">
            <span className="text-[10px]/none font-serif font-bold text-white tracking-widest block">HABESHA COUTURE</span>
            <span className="text-[8px] text-zinc-600 block mt-1">EMBEDDED WITH TRADITION. DESIGNED FOR DISCERNING TASTES.</span>
          </div>
          <div className="flex gap-8 text-[9px] uppercase tracking-widest font-mono text-zinc-500">
            <span>BOLE FLAGGSHIP ADDRES: CENTURY MALL, 3rd FLOOR</span>
            <span>SUPPORT: ATELIER@HABESHACUT.COM</span>
          </div>
        </div>
        <div className="text-[8px] tracking-widest text-zinc-700 uppercase pt-12 border-t border-[#141414] mt-12 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <span>HABESHA COUTURE LTD &copy; {new Date().getFullYear()}</span>
          <span>CRAFTED COUTURES ACCORDING TO SYSTEM CONFIGURATIONS</span>
        </div>
      </footer>

    </div>
  );
}

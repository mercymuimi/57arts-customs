import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styleCategories = [
  { key: 'old-money',    label: 'Old Money',    icon: '🎩', desc: 'Understated luxury. Quiet wealth.',       img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', count: 6 },
  { key: 'streetwear',  label: 'Streetwear',   icon: '🧢', desc: 'Bold. Raw. Culture-coded.',               img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', count: 8 },
  { key: 'official-wear', label: 'Official Wear', icon: '💼', desc: 'Power dressing for the boardroom.',    img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', count: 5 },
  { key: 'denim-wear',  label: 'Denim Wear',   icon: '👖', desc: 'Artisan-distressed. Hand-finished.',      img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', count: 6 },
  { key: 'afro-luxury', label: 'Afro Luxury',  icon: '🌍', desc: 'Heritage craft meets high fashion.',      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600', count: 7 },
  { key: 'resort-wear', label: 'Resort Wear',  icon: '🌊', desc: 'Sun-drenched and effortlessly elegant.',  img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', count: 4 },
];

const allProducts = {
  'old-money': [
    { id: 'om1', name: 'Regency Silk Polo',      price: 'KES 18,500', priceUSD: '$320',  desc: 'Premium knit cream silk with mother-of-pearl buttons.',    tag: 'New',       tagLabel: 'CUSTOM SERIES',   inStock: true,  materials: ['100% Mulberry Silk','Mother-of-pearl buttons'],  sizes: ['S','M','L','XL'],        img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500', imgs: ['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'], vendor: 'Fatima Al-Hassan' },
    { id: 'om2', name: 'Cashmere Overcoat',      price: 'KES 64,000', priceUSD: '$890',  desc: 'Double-faced Italian cashmere overcoat. Notched lapel, structured shoulders.', tag: 'Exclusive', tagLabel: 'BESPOKE FIT', inStock: true, materials: ['Italian Cashmere','Silk Satin Lining'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500', imgs: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'], vendor: 'Master Julian' },
    { id: 'om3', name: 'Linen Riviera Set',      price: 'KES 24,000', priceUSD: '$450',  desc: 'Hand-dyed Belgian linen shirt and trousers set.', tag: '', tagLabel: 'VAULT EXCLUSIVE', inStock: true, materials: ['Belgian Linen','Natural Dyes'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', imgs: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'], vendor: 'Adaeze Obi' },
    { id: 'om4', name: 'Heritage Blazer',        price: 'KES 38,000', priceUSD: '$550',  desc: 'Single-button wool blazer in stone grey. Dual vent, hand-stitched lapels.', tag: '', tagLabel: '', inStock: false, materials: ['100% Merino Wool','Copper-tone buttons'], sizes: ['M','L','XL'], img: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', imgs: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800'], vendor: 'Fatima Al-Hassan' },
    { id: 'om5', name: 'Pearl Knit Vest',        price: 'KES 12,500', priceUSD: '$190',  desc: 'Fine-gauge merino wool vest. Ribbed edges, subtle pearl sheen yarn.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Merino Wool','Pearl-thread yarn'], sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', imgs: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], vendor: 'Abena Asante' },
    { id: 'om6', name: 'Ivory Trench Coat',      price: 'KES 52,000', priceUSD: '$760',  desc: 'Gabardine trench in off-white. Storm shield, double breast, belted waist.', tag: 'Limited', tagLabel: 'LIMITED', inStock: true, materials: ['Cotton Gabardine','Tortoise-shell buttons'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500', imgs: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800'], vendor: 'Fatima Al-Hassan' },
  ],
  'streetwear': [
    { id: 'sw1', name: 'Midnight Denim',         price: 'KES 28,000', priceUSD: '$450',  desc: 'Hand-distressed raw denim jacket with hand-painted chest graphic.', tag: 'HOT', tagLabel: 'VAULT EXCLUSIVE', inStock: true, materials: ['Raw Japanese Denim','Hand-applied Graphic'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Kofi Mensah' },
    { id: 'sw2', name: 'Aura Metallic Tee',      price: 'KES 8,500',  priceUSD: '$120',  desc: '400GSM heavyweight cotton tee with foil-print tribal pattern. Boxy fit.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['400GSM Cotton','Metallic Foil Print'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', imgs: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'], vendor: 'Kofi Mensah' },
    { id: 'sw3', name: 'Artifact Wide Leg',      price: 'KES 22,000', priceUSD: '$320',  desc: 'Custom paint-finish cargo trousers. Side pockets, drawstring waist.', tag: '', tagLabel: '', inStock: true, materials: ['Cotton Twill','Hand-applied Paint'], sizes: ['28','30','32','34','36'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Kofi Mensah' },
    { id: 'sw4', name: 'Shadow Rider Leather',   price: 'KES 45,000', priceUSD: '$660',  desc: 'Boxy moto jacket in matte black lambskin. Asymmetric zip, quilted panels.', tag: 'Limited', tagLabel: 'LIMITED', inStock: true, materials: ['Lambskin Leather','YKK Hardware'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500', imgs: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'], vendor: 'Adaeze Obi' },
    { id: 'sw5', name: 'Cyber Hoodie v.2',       price: 'KES 16,000', priceUSD: '$230',  desc: 'Tech fleece oversized hoodie with mesh panelling and reflective embroidery.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Tech Fleece','Reflective Thread'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', imgs: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'], vendor: 'Kofi Mensah' },
    { id: 'sw6', name: 'Kente Cargo Set',        price: 'KES 32,000', priceUSD: '$470',  desc: 'Two-piece cargo set with hand-woven Kente panels at pockets and hem.', tag: '', tagLabel: '', inStock: true, materials: ['Cotton Ripstop','Hand-woven Kente'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=500', imgs: ['https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=800'], vendor: 'Abena Asante' },
    { id: 'sw7', name: 'Neo-Tribal Bomber',      price: 'KES 39,000', priceUSD: '$570',  desc: 'Embroidered satin bomber jacket with Yoruba geometric motifs on the back.', tag: 'HOT', tagLabel: 'HOT', inStock: false, materials: ['Satin','Hand Embroidery Thread'], sizes: ['M','L','XL'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', imgs: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], vendor: 'Adaeze Obi' },
    { id: 'sw8', name: 'Graffiti Denim Set',     price: 'KES 35,000', priceUSD: '$510',  desc: 'Matching jacket and jeans with hand-painted cityscape running across the set.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Rigid Denim','Acrylic Paint'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Kofi Mensah' },
  ],
  'official-wear': [
    { id: 'ow1', name: 'Midnight Velvet Blazer', price: 'KES 58,000', priceUSD: '$850',  desc: 'Double-weave midnight velvet blazer with boned internal structure.', tag: 'Exclusive', tagLabel: 'SIGNATURE', inStock: true, materials: ['Double-weave Velvet','Boned Lining'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500', imgs: ['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'], vendor: 'Fatima Al-Hassan' },
    { id: 'ow2', name: 'Power Suit — Slate',     price: 'KES 72,000', priceUSD: '$1050', desc: 'Two-piece slim-fit suit in charcoal wool-blend. Notch lapel, side pockets.', tag: 'New', tagLabel: 'BESPOKE FIT', inStock: true, materials: ['Wool-Polyester Blend','Viscose Lining'], sizes: ['36','38','40','42','44'], img: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500', imgs: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800'], vendor: 'Fatima Al-Hassan' },
    { id: 'ow3', name: 'Ankara Boardroom Dress', price: 'KES 34,000', priceUSD: '$500',  desc: 'Structured midi dress in premium Ankara. Padded shoulders, concealed zip.', tag: '', tagLabel: '', inStock: true, materials: ['Premium Ankara','Shoulder Padding'], sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', imgs: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'], vendor: 'Adaeze Obi' },
    { id: 'ow4', name: 'Obsidian Blazer',        price: 'KES 85,000', priceUSD: '$890',  desc: 'Three-piece contemporary agbada in ivory damask with gold thread embroidery.', tag: 'Exclusive', tagLabel: 'BESPOKE FIT', inStock: true, materials: ['Ivory Damask','Gold Thread Embroidery'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=500', imgs: ['https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=800'], vendor: 'Adaeze Obi' },
    { id: 'ow5', name: 'Monochrome Coord Set',   price: 'KES 26,000', priceUSD: '$380',  desc: 'Matching wide-leg trousers and relaxed blazer in all-black crepe.', tag: '', tagLabel: '', inStock: true, materials: ['Crepe Fabric','Satin Trim'], sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', imgs: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], vendor: 'Fatima Al-Hassan' },
  ],
  'denim-wear': [
    { id: 'dw1', name: 'Golden Distressed Denim',price: 'KES 32,000', priceUSD: '$470',  desc: 'Hand-distressed selvedge denim jacket. Gold leaf detailing on collar and cuffs.', tag: 'HOT', tagLabel: 'HOT', inStock: true, materials: ['Selvedge Denim','24k Gold Leaf'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Kofi Mensah' },
    { id: 'dw2', name: 'Indigo Wide-Leg Jeans',  price: 'KES 18,000', priceUSD: '$260',  desc: 'Hand-dyed Japanese indigo wide-leg denim. High rise, relaxed through the leg.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Japanese Denim','Natural Indigo Dye'], sizes: ['26','28','30','32','34'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Kofi Mensah' },
    { id: 'dw3', name: 'Patchwork Denim Coat',   price: 'KES 48,000', priceUSD: '$700',  desc: 'Floor-length denim coat assembled from 8 vintage denim fabrics. One-of-one.', tag: 'Limited', tagLabel: 'LIMITED', inStock: true, materials: ['8 Vintage Denims'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Adaeze Obi' },
    { id: 'dw4', name: 'Raw Edge Trucker',        price: 'KES 22,000', priceUSD: '$320',  desc: 'Classic trucker jacket in raw unwashed denim. Exposed seams, raw hem.', tag: '', tagLabel: '', inStock: true, materials: ['Raw Unwashed Denim','Exposed Seam Finish'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Kofi Mensah' },
    { id: 'dw5', name: 'Bleached Cargo Jeans',   price: 'KES 16,500', priceUSD: '$240',  desc: 'Sun-bleached hand-finished cargo denim. Six pockets, relaxed fit.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Cotton Denim','Sun-bleach Finish'], sizes: ['28','30','32','34','36'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Kofi Mensah' },
    { id: 'dw6', name: 'Embroidered Denim Set',  price: 'KES 54,000', priceUSD: '$790',  desc: 'Matching jacket and straight-leg jeans with hand-embroidered floral panels.', tag: 'Exclusive', tagLabel: 'EXCLUSIVE', inStock: false, materials: ['Stretch Denim','Silk Embroidery Thread'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Abena Asante' },
  ],
  'afro-luxury': [
    { id: 'al1', name: 'Aso-Oke Agbada',         price: 'KES 96,000', priceUSD: '$1400', desc: 'Hand-woven Aso-Oke agbada in indigo and copper thread. 8-week lead time.', tag: 'Exclusive', tagLabel: 'CUSTOM', inStock: true, materials: ['Hand-woven Aso-Oke','Copper Thread'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', imgs: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800','https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=800'], vendor: 'Adaeze Obi' },
    { id: 'al2', name: 'Kente Wrap Coat',         price: 'KES 48,000', priceUSD: '$700',  desc: 'Hand-woven Kente wrap coat with structured shoulders and bold geometric borders.', tag: 'HOT', tagLabel: 'HOT', inStock: true, materials: ['Hand-woven Kente','Interfacing'], sizes: ['S','M','L'], img: 'https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=500', imgs: ['https://images.unsplash.com/photo-1596752765962-c89db2f87768?w=800'], vendor: 'Abena Asante' },
    { id: 'al3', name: 'Adire Silk Set',          price: 'KES 41,000', priceUSD: '$600',  desc: 'Hand-dyed adire silk co-ord in indigo. Top and palazzo trousers.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Silk','Natural Indigo Dye'], sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', imgs: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], vendor: 'Adaeze Obi' },
    { id: 'al4', name: 'Bogolanfini Bomber',      price: 'KES 35,000', priceUSD: '$510',  desc: 'Contemporary bomber in hand-made Malian mud cloth. Brown and cream geometric.', tag: '', tagLabel: '', inStock: true, materials: ['Mud Cloth','Satin Lining'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500', imgs: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800'], vendor: 'Adaeze Obi' },
    { id: 'al5', name: 'Dashiki Shirt',           price: 'KES 14,000', priceUSD: '$200',  desc: 'Contemporary long dashiki in gold embroidered cotton voile. Relaxed collar.', tag: '', tagLabel: '', inStock: true, materials: ['Cotton Voile','Gold Embroidery'], sizes: ['S','M','L','XL','XXL'], img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', imgs: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'], vendor: 'Adaeze Obi' },
    { id: 'al6', name: 'Ndebele Maxi Dress',      price: 'KES 29,000', priceUSD: '$420',  desc: 'Maxi dress with Ndebele geometric beading at neckline and cuffs.', tag: 'Limited', tagLabel: 'LIMITED', inStock: false, materials: ['Linen','Ndebele Beadwork'], sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', imgs: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'], vendor: 'Amina Yusuf' },
    { id: 'al7', name: 'Gele Headwrap Set',       price: 'KES 18,000', priceUSD: '$260',  desc: 'Pre-styled gele headwrap with matching iro and buba in coral aso-oke.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Coral Aso-Oke'], sizes: ['One Size'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', imgs: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'], vendor: 'Adaeze Obi' },
  ],
  'resort-wear': [
    { id: 'rw1', name: 'Linen Riviera Set',       price: 'KES 24,000', priceUSD: '$350',  desc: 'Hand-dyed Belgian linen shirt and trousers in sage. Open collar, relaxed fit.', tag: 'New', tagLabel: 'NEW', inStock: true, materials: ['Belgian Linen','Natural Dyes'], sizes: ['S','M','L','XL'], img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', imgs: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'], vendor: 'Adaeze Obi' },
    { id: 'rw2', name: 'Silk Wrap Dress',         price: 'KES 31,000', priceUSD: '$450',  desc: 'Hand-painted silk wrap dress with abstract coastal motif. Adjustable tie.', tag: '', tagLabel: '', inStock: true, materials: ['Silk Charmeuse','Hand-painted'], sizes: ['XS','S','M','L'], img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', imgs: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], vendor: 'Fatima Al-Hassan' },
    { id: 'rw3', name: 'Cotton Kaftan',           price: 'KES 19,500', priceUSD: '$285',  desc: 'Block-printed cotton kaftan in terracotta and cream. Embroidered neckline.', tag: '', tagLabel: '', inStock: true, materials: ['Cotton','Block Print'], sizes: ['One Size'], img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500', imgs: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800'], vendor: 'Adaeze Obi' },
    { id: 'rw4', name: 'Linen Wide-Leg Pant',     price: 'KES 14,000', priceUSD: '$205',  desc: 'High-rise wide-leg linen in natural ecru. Elasticated waist, side pockets.', tag: '', tagLabel: '', inStock: true, materials: ['Linen'], sizes: ['XS','S','M','L','XL'], img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', imgs: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'], vendor: 'Abena Asante' },
  ],
};

const allFlat = Object.entries(allProducts).flatMap(([catKey, prods]) =>
  prods.map(p => ({ ...p, catKey }))
);

const Fashion = () => {
  const navigate = useNavigate();
  const [view, setView]                       = useState('home');
  const [activeCategory, setActiveCategory]   = useState(null);
  const [activeProduct, setActiveProduct]     = useState(null);
  const [wishlist, setWishlist]               = useState([]);
  const [cart, setCart]                       = useState([]);
  const [selectedSize, setSelectedSize]       = useState('');
  const [addedToCart, setAddedToCart]         = useState(false);
  const [activeImg, setActiveImg]             = useState(0);
  const [activeCatFilter, setActiveCatFilter] = useState('all');
  const [searchQuery, setSearchQuery]         = useState('');
  const [searchOpen, setSearchOpen]           = useState(false);
  const searchInputRef                        = useRef(null);
  const [synEmail, setSynEmail]               = useState('');
  const [synName, setSynName]                 = useState('');
  const [synStep, setSynStep]                 = useState('form');
  const [synCode, setSynCode]                 = useState('');

  const filteredAll = activeCatFilter === 'all'
    ? allFlat
    : allFlat.filter(p => p.catKey === activeCatFilter);

  const searchResults = searchQuery.trim().length > 1
    ? allFlat.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const toggleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const openCategory = (cat) => { setActiveCategory(cat); setView('category'); window.scrollTo(0, 0); };
  const openAllProducts = (catKey = 'all') => { setActiveCatFilter(catKey); setView('all'); window.scrollTo(0, 0); };
  const openProduct = (product, cat) => {
    if (cat) setActiveCategory(cat);
    setActiveProduct(product); setSelectedSize(''); setAddedToCart(false); setActiveImg(0);
    setView('detail'); window.scrollTo(0, 0); setSearchOpen(false); setSearchQuery('');
  };
  const goHome     = () => { setView('home');     window.scrollTo(0, 0); };
  const goCategory = () => { setView('category'); window.scrollTo(0, 0); };

  const handleAddToCart = () => {
    if (!selectedSize && activeProduct.sizes.length > 1) return;
    setCart(prev => [...prev, { ...activeProduct, size: selectedSize }]);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleSyndicateSubmit = (e) => {
    e.preventDefault();
    if (!synEmail || !synName) return;
    setSynStep('loading');
    setTimeout(() => {
      const code = 'SYND-' + Math.random().toString(36).substring(2,6).toUpperCase() + '-' + Math.random().toString(36).substring(2,6).toUpperCase();
      setSynCode(code);
      setSynStep('pending');
    }, 1800);
  };

  const products = activeCategory ? (allProducts[activeCategory.key] || []) : [];
  const featuredProducts = [
    { ...allProducts['streetwear'][0], catKey: 'streetwear' },
    { ...allProducts['old-money'][0],  catKey: 'old-money' },
    { ...allProducts['official-wear'][3], catKey: 'official-wear' },
  ];

  const S = {
    nav: { backgroundColor: 'rgba(5,5,0,0.97)', borderBottom: '1px solid #1a1800', position: 'sticky', top: 0, zIndex: 30, padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '52px', backdropFilter: 'blur(12px)' },
    page: { minHeight: '100vh', backgroundColor: '#080800', color: '#fff' },
    gold: '#c8a32c',
    dark: '#080800',
  };

  const Navbar = () => (
    <nav style={S.nav}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = S.gold} onMouseLeave={e => e.currentTarget.style.color = '#666'}>
        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={goHome} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: view === 'home' ? S.gold : '#555', fontWeight: 900, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: view === 'home' ? 'underline' : 'none', textUnderlineOffset: '4px' }}
          onMouseEnter={e => { if (view !== 'home') e.currentTarget.style.color = S.gold; }} onMouseLeave={e => { if (view !== 'home') e.currentTarget.style.color = '#555'; }}>
          All
        </button>
        <span style={{ color: '#2a2800' }}>|</span>
        {styleCategories.map(cat => {
          const isActive = view === 'category' && activeCategory?.label === cat.label;
          return (
            <button key={cat.key} onClick={() => openCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isActive ? S.gold : '#555', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: isActive ? 'underline' : 'none', textUnderlineOffset: '4px' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = S.gold; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#555'; }}>
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0f0f00', border: `1px solid ${S.gold}`, borderRadius: '6px', padding: '5px 10px', gap: '6px' }}>
              <svg width="12" height="12" fill="none" stroke={S.gold} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
              <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search pieces..."
                style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '11px', width: '160px' }} />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0f0f00', border: '1px solid #2a2800', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}>
              <svg width="12" height="12" fill="none" stroke="#666" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
              <span style={{ color: '#444', fontSize: '11px' }}>Search...</span>
            </button>
          )}
          {searchOpen && searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '300px', backgroundColor: '#0a0a00', border: '1px solid #2a2800', borderRadius: '8px', overflow: 'hidden', zIndex: 50, boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
              {searchResults.map(p => {
                const cat = styleCategories.find(c => c.key === p.catKey);
                return (
                  <div key={p.id} onClick={() => openProduct(p, cat)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #1a1800' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1800'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <img src={p.img} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#fff', fontSize: '11px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ color: '#555', fontSize: '10px', margin: 0 }}>{cat?.label} · {p.priceUSD}</p>
                    </div>
                    <span style={{ color: S.gold, fontSize: '10px', fontWeight: 900 }}>{p.priceUSD}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Link to="/syndicate" style={{ backgroundColor: S.gold, color: '#0a0a00', fontWeight: 900, fontSize: '10px', letterSpacing: '0.1em', padding: '7px 14px', borderRadius: '5px', textDecoration: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          The Syndicate
        </Link>
        <Link to="/cart" style={{ position: 'relative', color: '#666' }} onMouseEnter={e => e.currentTarget.style.color = S.gold} onMouseLeave={e => e.currentTarget.style.color = '#666'}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {cart.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: S.gold, color: '#0a0a00', fontSize: '8px', fontWeight: 900, width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</span>}
        </Link>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer style={{ backgroundColor: '#050500', borderTop: '1px solid #1a1800', padding: '20px 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: '0 auto' }}>
        <span style={{ color: S.gold, fontWeight: 900, fontSize: '11px', letterSpacing: '0.15em' }}>57 ARTS & CUSTOMS</span>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Membership','Privacy','Terms','Archives','Contact'].map(l => (
            <span key={l} style={{ color: '#333', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = S.gold} onMouseLeave={e => e.currentTarget.style.color = '#333'}>{l}</span>
          ))}
        </div>
        <span style={{ color: '#2a2800', fontSize: '10px' }}>© 2024 57 ARTS & CUSTOMS. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );

  const ProductCard = ({ product }) => {
    const cat = styleCategories.find(c => c.key === product.catKey);
    return (
      <div onClick={() => openProduct(product, cat)} style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #1a1800', backgroundColor: '#f5f2ec', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = S.gold} onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1800'}>
        <div style={{ position: 'relative', height: '230px', overflow: 'hidden', backgroundColor: '#e8e4dc' }}>
          <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          {!product.inStock && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ backgroundColor: '#111', color: '#777', border: '1px solid #333', fontSize: '10px', fontWeight: 900, padding: '5px 14px', borderRadius: '20px', letterSpacing: '0.1em' }}>OUT OF STOCK</span>
            </div>
          )}
          {product.tagLabel && <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(8,8,0,0.9)', color: S.gold, fontSize: '9px', fontWeight: 900, padding: '3px 7px', borderRadius: '4px', letterSpacing: '0.1em' }}>{product.tagLabel}</span>}
          {cat && <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(8,8,0,0.75)', color: '#777', fontSize: '8px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{cat.label}</span>}
        </div>
        <div style={{ padding: '12px 14px', backgroundColor: '#0a0a00', flex: 1 }}>
          <p style={{ color: '#444', fontSize: '10px', marginBottom: '2px' }}>{product.vendor}</p>
          <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '13px', marginBottom: '5px', fontFamily: 'Georgia, serif' }}>{product.name}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: S.gold, fontWeight: 900, fontSize: '13px' }}>{product.priceUSD}</p>
            <div style={{ display: 'flex', gap: '3px' }}>
              {product.sizes.slice(0,3).map(s => <span key={s} style={{ color: '#444', fontSize: '9px', border: '1px solid #1a1800', padding: '2px 5px', borderRadius: '3px', backgroundColor: '#0f0f00' }}>{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ══ PRODUCT DETAIL ════════════════════════════════════════════════════════
  if (view === 'detail' && activeProduct) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px' }}>
            <div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '520px', marginBottom: '12px' }}>
                <img src={activeProduct.imgs[activeImg]} alt={activeProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {activeProduct.imgs.length > 1 && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  {activeProduct.imgs.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: activeImg===i ? `2px solid ${S.gold}` : '2px solid #1a1800', cursor: 'pointer', padding: 0 }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={activeCategory ? goCategory : goHome} style={{ color: S.gold, fontSize: '11px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>{activeCategory?.label || 'All'}</button>
                {activeProduct.tagLabel && <span style={{ backgroundColor: '#0f0f00', border: '1px solid #2a2800', color: '#888', fontSize: '9px', fontWeight: 900, padding: '3px 8px', borderRadius: '4px' }}>{activeProduct.tagLabel}</span>}
                {!activeProduct.inStock && <span style={{ backgroundColor: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.4)', color: '#f87171', fontSize: '9px', fontWeight: 900, padding: '3px 8px', borderRadius: '4px' }}>OUT OF STOCK</span>}
              </div>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '34px', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>{activeProduct.name}</h1>
              <p style={{ color: S.gold, fontWeight: 900, fontSize: '22px', marginBottom: '18px' }}>{activeProduct.priceUSD} <span style={{ color: '#444', fontSize: '13px', fontWeight: 400 }}>/ {activeProduct.price}</span></p>
              <p style={{ color: '#777', fontSize: '13px', lineHeight: 1.7, marginBottom: '22px' }}>{activeProduct.desc}</p>
              <div style={{ marginBottom: '18px' }}>
                <p style={{ color: '#444', fontSize: '10px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Materials</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeProduct.materials.map(m => <span key={m} style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', border: '1px solid #1a1800', color: '#666', backgroundColor: '#0f0f00' }}>{m}</span>)}
                </div>
              </div>
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <p style={{ color: '#444', fontSize: '10px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Select Size</p>
                  {!selectedSize && activeProduct.sizes.length > 1 && <p style={{ color: '#f87171', fontSize: '11px' }}>Please select a size</p>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activeProduct.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)} style={{ minWidth: '44px', padding: '7px 12px', borderRadius: '7px', fontWeight: 900, fontSize: '11px', cursor: 'pointer', border: selectedSize===size ? `2px solid ${S.gold}` : '1px solid #1a1800', backgroundColor: selectedSize===size ? S.gold : '#0f0f00', color: selectedSize===size ? '#0a0a00' : '#666' }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <button onClick={handleAddToCart} disabled={!activeProduct.inStock || (!selectedSize && activeProduct.sizes.length > 1)}
                  style={{ flex: 1, padding: '13px', borderRadius: '8px', fontWeight: 900, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: activeProduct.inStock ? 'pointer' : 'not-allowed', backgroundColor: addedToCart ? '#22c55e' : (activeProduct.inStock ? S.gold : '#1a1800'), color: addedToCart ? '#fff' : (activeProduct.inStock ? '#0a0a00' : '#444'), opacity: (!activeProduct.inStock || (!selectedSize && activeProduct.sizes.length > 1)) && !addedToCart ? 0.5 : 1 }}>
                  {addedToCart ? '✓ Added!' : activeProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button onClick={e => toggleWishlist(activeProduct.id, e)} style={{ width: '48px', borderRadius: '8px', border: '1px solid #1a1800', fontSize: '16px', cursor: 'pointer', backgroundColor: wishlist.includes(activeProduct.id) ? 'rgba(239,68,68,0.15)' : '#0f0f00', color: wishlist.includes(activeProduct.id) ? '#f87171' : '#555' }}>
                  {wishlist.includes(activeProduct.id) ? '♥' : '♡'}
                </button>
              </div>
              {activeProduct.inStock && (
                <button onClick={() => navigate('/checkout')} style={{ width: '100%', padding: '13px', borderRadius: '8px', fontWeight: 900, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', backgroundColor: 'transparent', color: S.gold, border: `2px solid ${S.gold}` }}>
                  Order Now →
                </button>
              )}
              <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '7px', border: '1px solid #1a1800', backgroundColor: '#0a0a00' }}>
                <p style={{ color: '#555', fontSize: '11px', lineHeight: 1.7, margin: 0 }}>
                  Want this customised? <Link to="/custom-order" style={{ color: S.gold, fontWeight: 900 }}>Start a Custom Order →</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ══ ALL PRODUCTS VIEW ══════════════════════════════════════════════════════
  if (view === 'all') {
    const allTabs = [
      { key: 'all', label: 'All Pieces', count: allFlat.length },
      ...styleCategories.map(c => ({ key: c.key, label: c.label, count: allProducts[c.key]?.length || 0 })),
    ];
    return (
      <div style={S.page}>
        <Navbar />
        {/* Sticky tab bar */}
        <div style={{ backgroundColor: '#080800', borderBottom: '1px solid #1a1800', position: 'sticky', top: '52px', zIndex: 20 }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px', display: 'flex', gap: '0', overflowX: 'auto' }}>
            {allTabs.map(tab => {
              const isActive = activeCatFilter === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveCatFilter(tab.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 18px', borderBottom: isActive ? `2px solid ${S.gold}` : '2px solid transparent', color: isActive ? S.gold : '#555', fontWeight: isActive ? 900 : 600, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#888'; }} onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#555'; }}>
                  {tab.label} <span style={{ color: isActive ? S.gold : '#333', fontSize: '9px', marginLeft: '4px' }}>({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#555', fontSize: '12px' }}>
              Showing <strong style={{ color: '#fff' }}>{filteredAll.length}</strong> pieces
              {activeCatFilter !== 'all' && <span style={{ color: S.gold }}> · {styleCategories.find(c => c.key === activeCatFilter)?.label}</span>}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All','In Stock','New','Limited'].map(f => (
                <button key={f} style={{ padding: '5px 12px', borderRadius: '5px', border: '1px solid #1a1800', color: '#555', fontSize: '10px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', backgroundColor: '#0a0a00' }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {filteredAll.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ══ SINGLE CATEGORY VIEW ══════════════════════════════════════════════════
  if (view === 'category' && activeCategory) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
          <img src={activeCategory.img} alt={activeCategory.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,0,0.96) 40%, rgba(8,8,0,0.5) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: '64px' }}>
            <div>
              <p style={{ color: S.gold, fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>Ready-Made Vault</p>
              <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '44px', textTransform: 'uppercase', fontFamily: 'Georgia, serif', marginBottom: '6px' }}>{activeCategory.label}</h1>
              <p style={{ color: '#666', fontSize: '12px' }}>{activeCategory.desc}</p>
            </div>
          </div>
          <button onClick={goHome} style={{ position: 'absolute', top: '20px', right: '28px', color: '#666', fontSize: '11px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>← All Categories</button>
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: '#555', fontSize: '12px' }}>Showing <strong style={{ color: '#fff' }}>{products.length}</strong> pieces</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['All','In Stock','New','Limited'].map(f => <button key={f} style={{ padding: '5px 12px', borderRadius: '5px', border: '1px solid #1a1800', color: '#555', fontSize: '10px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', backgroundColor: '#0a0a00' }}>{f}</button>)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
            {products.map(product => <ProductCard key={product.id} product={{ ...product, catKey: activeCategory.key }} />)}
          </div>
          <div style={{ marginTop: '40px', borderRadius: '10px', border: '1px solid #2a2200', padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f0d00' }}>
            <div>
              <p style={{ color: S.gold, fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '5px' }}>Don't see exactly what you want?</p>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: '18px', fontFamily: 'Georgia, serif', marginBottom: '5px' }}>Commission a custom {activeCategory.label} piece.</p>
              <p style={{ color: '#555', fontSize: '12px' }}>Submit a brief and our artisans will craft it to your specifications.</p>
            </div>
            <Link to="/custom-order" style={{ flexShrink: 0, backgroundColor: S.gold, color: '#0a0a00', padding: '11px 22px', borderRadius: '7px', fontWeight: 900, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: '28px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Start Custom Order →</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ══ HOME PAGE ══════════════════════════════════════════════════════════════
  return (
    <div style={S.page}>
      <Navbar />

      {/* HERO */}
      <div style={{ position: 'relative', height: '60vh', minHeight: '420px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400" alt="Fashion Hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,0,0.95) 50%, rgba(5,5,0,0.2) 100%)' }} />
        <span style={{ position: 'absolute', bottom: '20px', right: '32px', color: 'rgba(200,163,44,0.25)', fontSize: '10px', fontWeight: 900, letterSpacing: '0.3em', fontFamily: 'Georgia, serif' }}>EST. 2024</span>
        <div style={{ position: 'relative', zIndex: 10, paddingLeft: '72px', paddingRight: '40px', maxWidth: '620px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(26,24,0,0.8)', border: '1px solid #3a3200', borderRadius: '4px', padding: '4px 10px', marginBottom: '20px' }}>
            <span style={{ color: S.gold, fontSize: '9px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>57 ARTS & CUSTOMS</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: '64px', lineHeight: 0.92, textTransform: 'uppercase', marginBottom: '18px' }}>
            <span style={{ color: '#fff', fontStyle: 'italic', display: 'block' }}>THE <span style={{ color: S.gold }}>READY-</span></span>
            <span style={{ color: S.gold, fontStyle: 'italic', display: 'block' }}>MADE</span>
            <span style={{ color: '#fff', fontStyle: 'italic', display: 'block' }}>VAULT</span>
          </h1>
          <p style={{ color: '#888', fontSize: '12px', lineHeight: 1.7, maxWidth: '360px', marginBottom: '28px' }}>
            Exclusive curated pieces, crafted for the modern visionary. High-performance fabrics meet artisanal precision.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/custom-order" style={{ backgroundColor: S.gold, color: '#0a0a00', padding: '11px 24px', borderRadius: '6px', fontWeight: 900, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>START CUSTOM ORDER →</Link>
            <button onClick={() => openAllProducts('all')} style={{ border: '1px solid #3a3200', color: S.gold, padding: '11px 24px', borderRadius: '6px', fontWeight: 900, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', backgroundColor: 'rgba(200,163,44,0.04)' }}>BROWSE ARCHIVE</button>
          </div>
        </div>
      </div>

      {/* SHOP BY ARCHIVE */}
      <div id="archive" style={{ backgroundColor: '#0a0a00', padding: '64px 56px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
            <div>
              <p style={{ color: '#555', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '5px' }}>CURATIONS</p>
              <h2 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: '28px', textTransform: 'uppercase', fontStyle: 'italic' }}>SHOP BY ARCHIVE</h2>
            </div>
            <button onClick={() => openAllProducts('all')} style={{ background: 'none', border: '1px solid #1a1800', color: '#666', padding: '7px 16px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = S.gold; e.currentTarget.style.color = S.gold; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1800'; e.currentTarget.style.color = '#666'; }}>
              View All ({allFlat.length}) →
            </button>
          </div>

          {/* 6 category cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '40px' }}>
            {styleCategories.map(cat => (
              <button key={cat.key} onClick={() => openCategory(cat)} style={{ position: 'relative', height: '160px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #1a1800', textAlign: 'left', padding: 0, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = S.gold} onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1800'}>
                <img src={cat.img} alt={cat.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.38 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,0,0.94) 0%, rgba(8,8,0,0.1) 60%)' }} />
                <div style={{ position: 'absolute', inset: 0, padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    <span style={{ backgroundColor: 'rgba(200,163,44,0.12)', color: S.gold, border: '1px solid rgba(200,163,44,0.2)', fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '3px', letterSpacing: '0.1em' }}>{cat.count} pcs</span>
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 900, fontSize: '13px', fontFamily: 'Georgia, serif', textTransform: 'uppercase', marginBottom: '2px' }}>{cat.label}</p>
                    <p style={{ color: '#555', fontSize: '10px' }}>{cat.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Featured pieces with filter tabs that open the all-products view filtered */}
          <div style={{ borderTop: '1px solid #1a1800', paddingTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <p style={{ color: '#555', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>FEATURED PIECES</p>
              <div style={{ display: 'flex', gap: '14px' }}>
                {styleCategories.slice(0,3).map(cat => (
                  <button key={cat.key} onClick={() => openAllProducts(cat.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#444', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = S.gold} onMouseLeave={e => e.currentTarget.style.color = '#444'}>
                    {cat.label} →
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {featuredProducts.map((product, i) => {
                const cat = styleCategories.find(c => c.key === product.catKey);
                return (
                  <div key={product.id} onClick={() => openProduct(product, cat)} style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#e8e4dc', transition: 'transform 0.2s', border: '1px solid transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = S.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                      <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {product.tagLabel && <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(5,5,0,0.9)', color: S.gold, fontSize: '9px', fontWeight: 900, padding: '3px 7px', borderRadius: '4px', letterSpacing: '0.1em' }}>{product.tagLabel}</span>}
                    </div>
                    <div style={{ padding: '14px', backgroundColor: '#111000' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ color: '#666', fontSize: '10px', marginBottom: '3px' }}>{i===0 ? 'VAULT EXCLUSIVE' : i===1 ? 'CUSTOM SERIES' : 'BESPOKE FIT'}</p>
                          <p style={{ color: '#fff', fontWeight: 900, fontSize: '14px', fontFamily: 'Georgia, serif' }}>{product.name}</p>
                        </div>
                        <p style={{ color: S.gold, fontWeight: 900, fontSize: '13px', flexShrink: 0, marginLeft: '10px' }}>{product.priceUSD}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* JOIN THE SYNDICATE */}
      <div id="syndicate" style={{ backgroundColor: '#050500', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <polygon points="20,2 38,14 38,26 20,38 2,26 2,14" fill="none" stroke={S.gold} strokeWidth="1.5"/>
            <polygon points="20,8 32,16 32,24 20,32 8,24 8,16" fill={S.gold} opacity="0.12"/>
            <polygon points="20,14 26,18 26,22 20,26 14,22 14,18" fill={S.gold} opacity="0.35"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: '40px', fontStyle: 'italic', textTransform: 'uppercase', color: S.gold, marginBottom: '14px', letterSpacing: '0.03em' }}>
          JOIN THE SYNDICATE
        </h2>
        <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.8, maxWidth: '440px', margin: '0 auto 36px' }}>
          Gain first-access to archival drops, bespoke consultations, and the limited "Vault Noir" collection. Membership is seasonal and highly limited.
        </p>

        {synStep === 'form' && (
          <form onSubmit={handleSyndicateSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <input type="text" placeholder="Your full name" value={synName} onChange={e => setSynName(e.target.value)} required
              style={{ width: '100%', backgroundColor: '#0f0d00', border: '1px solid #2a2200', color: '#fff', fontSize: '12px', padding: '12px 16px', borderRadius: '6px', outline: 'none', marginBottom: '10px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', marginBottom: '14px' }}>
              <input type="email" placeholder="Your email address" value={synEmail} onChange={e => setSynEmail(e.target.value)} required
                style={{ flex: 1, backgroundColor: '#0f0d00', border: '1px solid #2a2200', borderRight: 'none', color: '#fff', fontSize: '12px', padding: '12px 16px', borderRadius: '6px 0 0 6px', outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: S.gold, color: '#0a0a00', fontWeight: 900, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '12px 18px', borderRadius: '0 6px 6px 0', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '90px' }}>
                REQUEST ACCESS
              </button>
            </div>
            <p style={{ color: '#2a2800', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>RESERVED FOR THE VANGUARD ONLY.</p>
          </form>
        )}

        {synStep === 'loading' && (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '32px', height: '32px', border: '2px solid #2a2200', borderTopColor: S.gold, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#555', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Processing your dossier...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {synStep === 'pending' && (
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            {/* Confirmation card */}
            <div style={{ backgroundColor: '#0f0d00', border: '1px solid #3a3200', borderRadius: '12px', padding: '28px', marginBottom: '14px' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>✦</div>
              <p style={{ color: S.gold, fontWeight: 900, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>Dossier Received</p>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: '18px', fontFamily: 'Georgia, serif', marginBottom: '10px' }}>Welcome, {synName}.</p>
              <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.8, marginBottom: '16px' }}>
                Your application is under review. Full credentials will arrive at{' '}
                <span style={{ color: S.gold, fontWeight: 700 }}>{synEmail}</span> within 24 hours.
              </p>
              <div style={{ backgroundColor: '#1a1800', border: '1px dashed #3a3200', borderRadius: '8px', padding: '14px', marginBottom: '6px' }}>
                <p style={{ color: '#555', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px' }}>Provisional Access Code</p>
                <p style={{ color: S.gold, fontWeight: 900, fontSize: '18px', letterSpacing: '0.25em', fontFamily: 'monospace', margin: 0 }}>{synCode}</p>
              </div>
              <p style={{ color: '#333', fontSize: '10px', margin: 0 }}>Save this — you'll need it when your invitation email arrives.</p>
            </div>

            {/* Next steps */}
            <div style={{ backgroundColor: '#0a0a00', border: '1px solid #1a1800', borderRadius: '12px', padding: '22px', marginBottom: '14px', textAlign: 'left' }}>
              <p style={{ color: S.gold, fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>What Happens Next</p>
              {[
                { step: '01', title: 'Dossier Review', desc: 'Our team reviews your application — usually within 24 hours.', done: true },
                { step: '02', title: 'Email Confirmation', desc: `A verification link is sent to ${synEmail} with your full credentials.`, done: false },
                { step: '03', title: 'Activate Membership', desc: 'Click the link in your email and enter your provisional code above to activate.', done: false },
                { step: '04', title: 'Early Access Unlocked', desc: 'Browse exclusive archive drops, book bespoke consults, and receive private event invites.', done: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < 3 ? '14px' : 0, alignItems: 'flex-start' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, backgroundColor: item.done ? S.gold : '#1a1800', color: item.done ? '#0a0a00' : '#333', border: item.done ? 'none' : '1px solid #2a2200', marginTop: '1px' }}>
                    {item.done ? '✓' : item.step}
                  </div>
                  <div>
                    <p style={{ color: item.done ? '#fff' : '#555', fontWeight: 700, fontSize: '12px', marginBottom: '2px' }}>{item.title}</p>
                    <p style={{ color: item.done ? '#777' : '#333', fontSize: '11px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => openAllProducts('all')} style={{ flex: 1, backgroundColor: S.gold, color: '#0a0a00', padding: '12px', borderRadius: '7px', fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                Browse the Archive →
              </button>
              <Link to="/syndicate" style={{ flex: 1, border: '1px solid #2a2200', color: '#666', padding: '12px', borderRadius: '7px', fontWeight: 900, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Syndicate Page →
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Fashion;
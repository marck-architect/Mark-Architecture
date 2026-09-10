'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/hooks/useStore';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Eye, ShoppingBag } from 'lucide-react';
import { OrbitViewer } from '@/components/collection/OrbitViewer';

interface Product {
  title: string;
  price: number | string;
  currency?: 'USD' | 'PKR';
  category: string;
  image: string;
  description: string;
  isFeatured?: boolean;
}

const formatProductPrice = (price: number | string, currency?: 'USD' | 'PKR') => {
  if (typeof price === 'string') return price;
  if (currency === 'PKR') return `PKR ${price.toLocaleString()}`;
  return `$${price.toLocaleString()}`;
};

const products: Product[] = [
  {
    title: 'Swat Valley Walnut Lounger',
    price: 380000,
    currency: 'PKR',
    category: 'FURNITURE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdv45ZiAB-0kcsC7QWcWUYrvqGWOf63PZTgdMoX6CDz8RQuR3IP5kBOZFYn_fYfaZl59P8VTYlL5pXaiaapTdMb0oc8CGnpGAOR7rFgkKi-FAoCLawT7tFuMxDmhS4Ec3tn2of0SdhoNIkL9RAW2QKc9TShvEmO-ob1tGIUlCu1vGjQ6iw3X5INGkJN1NVdwYn8BRqre0VQCmMnCDk0t11Ta60nsbBekThEtDJcwrObL4IK4_z4nlX146QuGXDctGXG_2YzE9E-odI',
    description: 'Hand-finished lounge chair carved from local premium Swat walnut wood, showcasing subtle organic curves and traditional architectural joint work. Features custom brass connectors.',
    isFeatured: true,
  },
  {
    title: 'Balochistan Travertine Plinth',
    price: 185000,
    currency: 'PKR',
    category: 'DECOR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsCdl0mgaz1yLFj4bsGPi5W8iU8WbI7R_gea2l7KxNuKx0wtEfTJ2EwCEBjYQ_DVbPFh_jS7sbaWv3zWwZvAb6PyQwPCC7DM1w6jn1hYefm9q8VA9zZU2Ih4v9dCjyk8Zfs4VjOdUvRPGTRi1A6fdH6k1jd7bXVxNSAxtwBmPyJK7S1j6jMmkrVGsU-JnDCyM0sMDD6j_mvC3Ms9qbJ3STmeR5Wo2lzxVmB8SncnQcanqUqS1KEEW-DgwFzLNk1M8TTnKm7PwKkJGQ',
    description: 'Sculptural display plinth columns crafted from rich multi-hued travertine onyx sourced from Balochistan quarries. Meticulously cut to geometric perfection.',
  },
  {
    title: 'Khewra Monolith Salt Lamp',
    price: 45000,
    currency: 'PKR',
    category: 'ACCESSORIES',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzw15IVOU0vCHXegPxlsynbwYb-FdILW0NQM8FCesfing6wS-h2MVd4tA0iDcrrZF1078h6-7UrY-qmjIrHWvcMArHRx6wbJjfNQ7U1c6Zpk2jvhJ5bYh0BjErwyCaHiKQhkgQSQ1WPBMEhoeoXa9AKW2Wr3VNzijXaKcGupPMRq1QwB0cVN2UnqJTKDDDCf5LtGMSTNLH6TycDasA9qNEQIwMyICnm9ol9IWRQumhrHhPsqJjt06xlSiNMGZe4vxyJG_DHsfzWR1E',
    description: 'A single, raw salt crystal block from the historic Khewra mines, fitted with precision internal low-emission illumination. Casts a warm, amber, therapeutic glow.',
  },
  {
    title: 'Ethereal Lounger',
    price: 8400,
    category: 'FURNITURE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdv45ZiAB-0kcsC7QWcWUYrvqGWOf63PZTgdMoX6CDz8RQuR3IP5kBOZFYn_fYfaZl59P8VTYlL5pXaiaapTdMb0oc8CGnpGAOR7rFgkKi-FAoCLawT7tFuMxDmhS4Ec3tn2of0SdhoNIkL9RAW2QKc9TShvEmO-ob1tGIUlCu1vGjQ6iw3X5INGkJN1NVdwYn8BRqre0VQCmMnCDk0t11Ta60nsbBekThEtDJcwrObL4IK4_z4nlX146QuGXDctGXG_2YzE9E-odI',
    description: 'Exquisite minimalist lounger carved from certified dark Italian walnut and premium full-grain ivory leather. Features custom titanium supports and an ergonomic organic shape.',
  },
  {
    title: 'Monolith Vase',
    price: 1250,
    category: 'DECOR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsCdl0mgaz1yLFj4bsGPi5W8iU8WbI7R_gea2l7KxNuKx0wtEfTJ2EwCEBjYQ_DVbPFh_jS7sbaWv3zWwZvAb6PyQwPCC7DM1w6jn1hYefm9q8VA9zZU2Ih4v9dCjyk8Zfs4VjOdUvRPGTRi1A6fdH6k1jd7bXVxNSAxtwBmPyJK7S1j6jMmkrVGsU-JnDCyM0sMDD6j_mvC3Ms9qbJ3STmeR5Wo2lzxVmB8SncnQcanqUqS1KEEW-DgwFzLNk1M8TTnKm7PwKkJGQ',
    description: 'Sculptural vase carved from a single piece of premium raw black obsidian. Each piece boasts distinct volcanic crystallizations and sits on a solid, unpolished travertine plinth.',
  },
  {
    title: 'Foundry Set',
    price: 680,
    category: 'ACCESSORIES',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzw15IVOU0vCHXegPxlsynbwYb-FdILW0NQM8FCesfing6wS-h2MVd4tA0iDcrrZF1078h6-7UrY-qmjIrHWvcMArHRx6wbJjfNQ7U1c6Zpk2jvhJ5bYh0BjErwyCaHiKQhkgQSQ1WPBMEhoeoXa9AKW2Wr3VNzijXaKcGupPMRq1QwB0cVN2UnqJTKDDDCf5LtGMSTNLH6TycDasA9qNEQIwMyICnm9ol9IWRQumhrHhPsqJjt06xlSiNMGZe4vxyJG_DHsfzWR1E',
    description: 'A premium collection of desktop accessories forged in brushed bronze. Contains a weighted ink reservoir holder, a geometric alignment rule, and a paper-aligning block.',
  },
];

export default function CollectionPage() {
  const { addToCart, openQuickView } = useStore();

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20">
      {/* Store Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-20 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              THE CURATED COLLECTION
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Architectural artifacts for the <span className="italic font-light">modern sanctuary.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              Exquisite objects, furniture, and materials commissioned by MARK Architects. Crafted in limited quantities for discerning clients.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Products Grid */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Featured Product */}
          {products.filter((p) => p.isFeatured).map((p) => (
            <div
              key={p.title}
              className="md:col-span-8 group relative aspect-[16/10] overflow-hidden rounded-2xl shadow-lg border border-outline-variant/20"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  fill
                  src={p.image}
                  alt={p.title}
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors z-1" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end glass-panel z-10">
                <div>
                  <span className="font-inter text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                    {p.category}
                  </span>
                  <h3 className="font-playfair text-xl md:text-2xl font-bold mt-1 text-on-surface">
                    {p.title}
                  </h3>
                  <p className="text-tertiary font-montserrat font-bold mt-1.5">
                    {formatProductPrice(p.price, p.currency)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      openQuickView({
                        title: p.title,
                        price: formatProductPrice(p.price, p.currency),
                        category: p.category,
                        image: p.image,
                        description: p.description,
                      })
                    }
                    className="w-12 h-12 rounded-full border border-outline/50 flex items-center justify-center hover:bg-tertiary hover:text-white hover:border-tertiary transition-all cursor-pointer bg-white/80"
                    aria-label="Quick View"
                  >
                    <Eye className="w-5 h-5 text-secondary hover:text-white" />
                  </button>
                  <button
                    onClick={() =>
                      addToCart({
                        title: p.title,
                        price: p.price as number,
                        image: p.image,
                        currency: p.currency,
                      })
                    }
                    className="bg-secondary hover:bg-tertiary text-on-primary px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-inter font-bold text-xs tracking-wider uppercase active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Small Products */}
          {products.filter((p) => !p.isFeatured).map((p, idx) => (
            <div
              key={p.title}
              className="md:col-span-4 group relative aspect-square overflow-hidden rounded-2xl shadow-lg border border-outline-variant/20"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  fill
                  src={p.image}
                  alt={p.title}
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors z-1" />
              <div className="absolute bottom-0 left-0 w-full p-6 glass-panel translate-y-[70%] group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-between h-44 z-10">
                <div>
                  <span className="font-inter text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                    {p.category}
                  </span>
                  <h3 className="font-playfair text-lg font-bold mt-1 text-on-surface">
                    {p.title}
                  </h3>
                  <p className="text-tertiary font-montserrat font-bold mt-1">
                    {formatProductPrice(p.price, p.currency)}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() =>
                      openQuickView({
                        title: p.title,
                        price: formatProductPrice(p.price, p.currency),
                        category: p.category,
                        image: p.image,
                        description: p.description,
                      })
                    }
                    className="border border-outline/50 hover:bg-secondary hover:text-white px-4 py-2 text-xs font-bold font-inter tracking-wider transition-all flex-grow rounded-lg text-center cursor-pointer bg-white/80"
                  >
                    QUICK VIEW
                  </button>
                  <button
                    onClick={() =>
                      addToCart({
                        title: p.title,
                        price: p.price as number,
                        image: p.image,
                        currency: p.currency,
                      })
                    }
                    className="bg-primary text-white hover:bg-tertiary px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Medium Product (Material Library) */}
          <div className="md:col-span-8 group relative aspect-[16/10] overflow-hidden rounded-2xl shadow-lg border border-outline-variant/20">
            <div className="absolute inset-0 z-0">
              <Image
                fill
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANFzC2HgRBTyZ3c6A_8y63oqb7Fa-QIP-itKcsVhJWCZml_-LR-pnT2H6UBYxt1IxEnFmVZ4gmi2ML1NCncjxGq65LimtsLp2jsoqKjUQFnJHkXr_KGJBbsVT6PIv_wrz8LkyjaWsgTR3Sti2RtIoGnOIgDElzzHL2JGSAXKAOkOoxE662uyTdbvrsDqpmcJWZxY2x8rMSBgYLipODdAScMIke50pRHOkrEm6qx-prsFrnRDOAc1ijp5rBkbIB9WYDrZhZG64g5cIb"
                alt="Material Archive Library"
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors z-1" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end glass-panel z-10">
              <div>
                <span className="font-inter text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                  BUILDING MATERIALS
                </span>
                <h3 className="font-playfair text-xl md:text-2xl font-bold mt-1 text-on-surface">
                  Material Archive Library
                </h3>
                <p className="text-tertiary font-montserrat font-bold mt-1.5">Custom Commissions Only</p>
              </div>
              <Link
                href="/consultation"
                className="bg-secondary hover:bg-tertiary text-on-primary px-8 py-3.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 text-center inline-block"
              >
                Order Samples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Orbit 3D interactive viewer */}
      <OrbitViewer />
    </div>
  );
}

'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import Image from 'next/image';

export const CartDrawer: React.FC = () => {
  const {
    cartDrawerOpen,
    setCartDrawerOpen,
    cart,
    changeQuantity,
    removeFromCart,
    openSuccessModal,
    clearCart,
  } = useStore();

  const usdSubtotal = cart
    .filter((item) => item.currency !== 'PKR')
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  const pkrSubtotal = cart
    .filter((item) => item.currency === 'PKR')
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCartDrawerOpen(false);

    openSuccessModal(
      'Acquisition Initiated',
      'Your private requisition draft has been logged. Our concierge representative will contact you via secure email within 12 hours to arrange premium shipping options and white-glove assembly.'
    );

    clearCart();
  };

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Wrapper */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="w-screen sm:max-w-md bg-white dark:bg-zinc-950 border-l border-outline-variant/35 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low dark:bg-zinc-900">
                <h3 className="font-playfair text-xl font-bold text-secondary dark:text-white flex items-center gap-2">
                  <ShoppingBag className="text-tertiary w-5 h-5" />
                  <span>Your Collection</span>
                </h3>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Close Cart"
                >
                  <X className="text-secondary dark:text-zinc-400 w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant space-y-4">
                    <ShoppingBag className="w-12 h-12 text-outline-variant" />
                    <p className="font-playfair text-lg font-medium text-zinc-800 dark:text-zinc-200">
                      Your collection is empty
                    </p>
                    <p className="text-xs max-w-xs font-light text-zinc-500">
                      Commission an artifact from the curated store to begin your sanctuary collection.
                    </p>
                    <button
                      onClick={() => {
                        setCartDrawerOpen(false);
                        window.location.href = '/collection';
                      }}
                      className="bg-secondary text-white font-inter font-bold text-xs tracking-wider uppercase px-6 py-3 rounded-lg hover:bg-tertiary transition-colors cursor-pointer"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div
                      key={item.title}
                      className="flex gap-4 p-4 bg-surface-container-low dark:bg-zinc-900/50 border border-outline-variant/30 rounded-xl relative group"
                    >
                      <div className="relative w-20 h-20 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                        <Image
                          fill
                          src={item.image}
                          alt={item.title}
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow space-y-1 flex flex-col justify-center">
                        <h4 className="font-playfair text-sm font-bold text-secondary dark:text-zinc-200">{item.title}</h4>
                        <p className="text-tertiary font-montserrat font-semibold text-xs">
                          {item.currency === 'PKR' ? `PKR ${item.price.toLocaleString()}` : `$${item.price.toLocaleString()}`}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2.5 pt-2">
                          <button
                            onClick={() => changeQuantity(index, -1)}
                            className="w-6 h-6 border border-outline/30 hover:border-tertiary flex items-center justify-center rounded text-xs transition-colors dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-montserrat text-xs font-semibold text-secondary dark:text-zinc-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => changeQuantity(index, 1)}
                            className="w-6 h-6 border border-outline/30 hover:border-tertiary flex items-center justify-center rounded text-xs transition-colors dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="absolute top-2 right-2 text-outline-variant hover:text-red-700 transition-colors p-1 cursor-pointer"
                        aria-label="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low dark:bg-zinc-900 space-y-4">
                  <div className="flex flex-col gap-2 w-full">
                    {usdSubtotal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="font-inter text-sm text-on-surface-variant font-medium dark:text-zinc-400">
                          USD Subtotal
                        </span>
                        <span className="font-montserrat text-lg font-bold text-secondary dark:text-zinc-100">
                          ${usdSubtotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {pkrSubtotal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="font-inter text-sm text-on-surface-variant font-medium dark:text-zinc-400">
                          PKR Subtotal
                        </span>
                        <span className="font-montserrat text-lg font-bold text-secondary dark:text-zinc-100">
                          PKR {pkrSubtotal.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-light text-zinc-500 dark:text-zinc-400">
                    Custom white-glove transport and worldwide secure freight handling calculated at checkout.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-tertiary text-on-primary py-4 font-bold tracking-widest text-xs uppercase rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-center"
                  >
                    REQUEST PRIVATE CHECKOUT
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

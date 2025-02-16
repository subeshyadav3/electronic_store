import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Nav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Store', path: '/store' },
        { name: 'Contact', path: '/contact' },
    ];

    if (isAuthenticated) {
        navItems.push({ name: 'Cart', path: '/cart' });
    }

    const navClass = "text-gray-700 hover:text-purple-600 transition-colors duration-300 transform -translate-x-2 hover:translate-x-0";

    const navLinkVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        },
    };

    const mobileMenuVariants = {
        closed: { opacity: 0, x: "-100%" },
        open: { opacity: 1, x: 0 }
    };

    return (
        <motion.nav 
            className="bg-white shadow-md sticky top-0 z-50"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0 flex items-center">
                            <motion.span 
                                className="text-2xl font-bold text-purple-600"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                TechStore
                            </motion.span>
                        </NavLink>
                    </div>
                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.name}
                                variants={navLinkVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                            >
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => 
                                        `${navClass}  ${isActive ? 'text-purple-600' : ''} mx-3`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </motion.div>
                        ))}
                        <motion.div
                            variants={navLinkVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: navItems.length * 0.1 }}
                        >
                            {isAuthenticated ? (
                                <NavLink to="/dashboard" className={navClass + " flex items-center mx-3"}>
                                    <User className="w-5 h-5 mr-1" />
                                    Dashboard
                                </NavLink>
                            ) : (
                                <NavLink to="/login" className={navClass + " flex items-center mx-3"}>
                                    <User className="w-5 h-5 mr-1" />
                                    Login
                                </NavLink>
                            )}
                        </motion.div>
                    </div>
                    <div className="flex items-center sm:hidden">
                        <motion.button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        className="sm:hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="pt-2 pb-3 space-y-1">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    variants={navLinkVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) => 
                                            `${navClass} ${isActive ? 'text-purple-600' : ''} block px-3 py-2 text-base font-medium`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </NavLink>
                                </motion.div>
                            ))}
                            <motion.div
                                variants={navLinkVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: navItems.length * 0.1 }}
                            >
                                {isAuthenticated ? (
                                    <NavLink 
                                        to="/dashboard" 
                                        className={`${navClass} block px-3 py-2 text-base font-medium`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </NavLink>
                                ) : (
                                    <NavLink 
                                        to="/login" 
                                        className={`${navClass} block px-3 py-2 text-base font-medium`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </NavLink>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

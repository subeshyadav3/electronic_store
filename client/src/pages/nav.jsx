import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-scroll';
import { GiHamburgerMenu, GiCrossedBones } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';

export default function Nav() {
    const [mobileNav, setMobileNav] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const toggleNav = () => {
            setMobileNav(window.innerWidth < 700);
        };
        window.addEventListener('resize', toggleNav);
        toggleNav();
        console.log(isAuthenticated);
        return () => {
            window.removeEventListener('resize', toggleNav);
        };
    }, []);

    const handleNavBar = () => {
        setNavOpen((prev) => !prev);
    };

    const navLinkVariants = {
        hidden: { opacity: 0, x: -50, scale: 0.6 },
        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    const navClas = "nav-animation transition-all duration-300 hover:text-pink-400 -translate-x-2 hover:translate-x-0";

    return (
        <>
            {/* Navigation */}
            {!mobileNav ? (
                <motion.div

                    className="flex flex-row justify-between sm:px-10 h-[50px] items-center mb-5 border-b-2 bg-slate-100 border-gray-200 sticky top-0 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        {/* <img src={logo} alt="Logo" className="w-[90px] h-[80px] p-2" /> */}
                    </div>
                    <div className="flex flex-row w-full z-10 justify-between gap-5">
                        <div className="flex gap-5" >
                            <motion.div variants={navLinkVariants} initial="hidden" animate="visible" >
                                <NavLink to="/" className={navClas}>
                                    Home
                                </NavLink>
                            </motion.div>
                            <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                                <NavLink to="/store"  duration={500} className={navClas}>
                                    Store
                                </NavLink>
                            </motion.div>
                            <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                                <NavLink to="cart"  duration={500} className={navClas}>
                                    Cart
                                </NavLink>
                            </motion.div>
                        </div>
                        <div className="flex gap-5">
                            <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                                {!isAuthenticated ? (<NavLink to="login"  duration={500} className={navClas}>
                                    Login
                                </NavLink>)
                                :(
                                    <NavLink to="/dashboard"  duration={500} className={navClas}>
                                    Dashboard
                                </NavLink>
                                )
                                    
                                    }

                            </motion.div>
                            <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                                <NavLink to="contact"  duration={500} className={navClas}>
                                    Contact
                                </NavLink>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            ) : navOpen ? (
                <motion.div
                onClick={handleNavBar}
                    id="nav"
                    className="relative flex flex-col h-screen gap-5 items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <GiCrossedBones className="absolute top-5 right-7 w-7 h-7 cursor-pointer" aria-label="Close menu" onClick={handleNavBar} />
                    <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                        <NavLink to="/" className={navClas}>
                            Home
                        </NavLink>
                    </motion.div>
                    <motion.div variants={navLinkVariants} initial="hidden" animate="visible">

                        <NavLink to="/store" duration={500} className={navClas}>
                            Store
                        </NavLink>

                    </motion.div>
                    <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                        < NavLink to="cart" duration={500} className={navClas}>
                            Cart
                        </NavLink>
                    </motion.div>
                    <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                        <NavLink to="login"  duration={500} className={navClas}>
                            Login
                        </NavLink>
                    </motion.div>
                    <motion.div variants={navLinkVariants} initial="hidden" animate="visible">
                        <NavLink to="contact" duration={500} className={navClas}>
                            Contact
                        </NavLink>
                    </motion.div>
                </motion.div>
            ) : (
                <div className="flex justify-between pr-5 items-center hero-image-nav" id="nav">
                    <div>
                        {/* <img src={logo} alt="Logo" className="w-15 h-[60px] ml-10" /> */}
                    </div>
                    <GiHamburgerMenu className="h-[60px] w-7 cursor-pointer" onClick={handleNavBar} />
                </div>
            )}
        </>
    );
}

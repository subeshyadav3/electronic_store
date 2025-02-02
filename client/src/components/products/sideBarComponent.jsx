import { useRef, useState, useEffect } from "react";

const SidebarComponent = ({ setFilter, handlePriceRangeChange, minPrice, maxPrice }) => {
    const ref = useRef(null);
    const [activeElement, setActiveElement] = useState(null);
    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.innerHeight + window.scrollY;
            const footerThreshold = scrollHeight - 400;
            
            if (scrollPosition >= footerThreshold) {
                setIsFixed(false);
            } else {
                setIsFixed(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // buttonDesign
    const give = (e) => {
        if (activeElement) {
            activeElement.classList.remove('active-filter-product');
        }

        e.target.classList.add('active-filter-product');
        setActiveElement(e.target);
        return activeElement.classList.remove('active-filter-product');

    }
    const buttonDesign = ' bg-slate-200 hover:bg-slate-300   text-gray-800 py-2 px-4 rounded-md';

    return (
        <div className={`md:w-[220px]  lg:w-[260px] bg-slate-100 flex items-top ${isFixed ? "top-0 h-screen mt-[50px] md:fixed " : " md:relative"
            }`} onClick={give} >

            <div className="mb-4 pt-10 sm:pt-[40%] flex flex-col pl-5 space-y-5">
                <label>
                    <h1 className='text-2xl'>Category:</h1>
                    <div className='flex flex-wrap gap-2 flex-row w-full mt-5' ref={ref}>
                        <button name="category" className={`${buttonDesign}`} value="laptops" onClick={setFilter}>Laptops</button>
                        <button name="category" className={`${buttonDesign}`} value="mens-watches" onClick={setFilter}>Watches</button>
                        <button name="category" className={`${buttonDesign}`} value="smartphones" onClick={setFilter}>Smartphones</button>
                        <button name="category" className={`${buttonDesign}`} value="tablets" onClick={setFilter}>Tablets</button>
                    </div>
                </label>

                <h1 className='text-2xl'>Brands:</h1>
                <div className='flex flex-wrap gap-2 flex-row w-full mt-5' ref={ref}>
                    <button name="brands" className={`${buttonDesign}`} value="Asus" onClick={setFilter}>Asus</button>
                    <button name="brands" className={`${buttonDesign}`} value="Huawei" onClick={setFilter}>Huawei</button>
                    <button name="brands" className={`${buttonDesign}`} value="Lenovo" onClick={setFilter}>Lenovo</button>
                    <button name="brands" className={`${buttonDesign}`} value="Dell" onClick={setFilter}>Dell</button>
                    <button name="brands" className={`${buttonDesign}`} value="Rolex" onClick={setFilter}>Rolex</button>
                    <button name="brands" className={`${buttonDesign}`} value="Samsung" onClick={setFilter}>Samsung</button>
                    <button name="brands" className={`${buttonDesign}`} value="Vivo" onClick={setFilter}>Vivo</button>
                </div>

                <label >
                    <h1 className='text-2xl'>Price Range:</h1>
                    <input
                        name="min"
                        type="number"
                        value={minPrice}
                        placeholder="Min Price"
                        className='p-1  w-[50px] hover:w-[70px] mt-5 rounded-md bg-slate-200'
                        onChange={handlePriceRangeChange}
                    />
                    -
                    <input
                        name="max"
                        type="number"
                        value={maxPrice}
                        placeholder="Max Price"
                        className='p-1 w-[80px] hover:w-[100px] rounded-md bg-slate-200'
                        onChange={handlePriceRangeChange}
                    />
                </label>
            </div>


        </div>

    )
};

export default SidebarComponent;
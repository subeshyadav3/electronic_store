import { useLocation, Link } from "react-router-dom";
import { useProducts } from "../../context/productContext";
import { useState, useEffect } from "react";

const Breadcrumb = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(segment => segment);
    const { getProductById } = useProducts();
    const [title, setTitle] = useState(null);
    
    useEffect(() => {
        setTitle(null);

        const isProductAdminPage = pathSegments[0] === "dashboard" && 
                                   pathSegments[1] === "admin" && 
                                   pathSegments[2] === "products" && 
                                   pathSegments.length === 4;
                                   
        const isStoreProductPage = pathSegments[0] === 'store' && 
                                   pathSegments.length === 2;

        if (isProductAdminPage || isStoreProductPage) {         
            const fetchTitle = async () => {
                try {
                    const result = await getProductById(pathSegments[pathSegments.length - 1]);
                    if (!result) return;
                    
                    if (result.title && result.title.length > 0) {
                        setTitle(result.title);
                    } else {
                        setTitle(pathSegments[pathSegments.length - 1]);
                    }
                } catch (error) {
                    console.error("Error fetching breadcrumb title:", error);
                }
            };
    
            if (pathSegments.length > 0) {
                fetchTitle();
            }
        }
    }, [location.pathname, getProductById]);

    return (
        <nav className="mb-4 text-gray-600">
            <ul className="flex flex-wrap items-center space-x-2">
                <li>
                    <Link to="/" className="text-gray-800 hover:text-blue-500 transition-colors">Home</Link>
                    <span className="ml-2 text-gray-400">/</span>
                </li>
                {pathSegments.map((segment, index) => {
                    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;
                    const formattedSegment = segment.replaceAll("-", " ");

                    return (
                        <li key={index} className="flex items-center space-x-2">
                            {isLast ? (
                                <span className="text-blue-500 font-semibold capitalize">
                                    {title || formattedSegment}
                                </span>
                            ) : (
                                <Link to={path} className="text-gray-800 hover:text-blue-500 transition-colors capitalize">
                                    {formattedSegment}
                                </Link>
                            )}
                            {!isLast && <span className="text-gray-400">/</span>}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
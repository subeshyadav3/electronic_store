import { useLocation, Link } from "react-router-dom";
import { useProducts } from "../../context/productContext";
import { useState, useEffect } from "react";


const Breadcrumb = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(segment => segment);
    const { getProductById } = useProducts();
    const [title, setTitle] = useState(null);
    
    useEffect(() => {
        if ((pathSegments[0] === "dashboard" && pathSegments[1] === "admin" && pathSegments[2] === "products" && pathSegments.length === 4)|| pathSegments[0]==='store' ) {         
               const fetchTitle = async () => {
            
                const result = await getProductById(pathSegments[pathSegments.length - 1]);
                if(!result){ return;}
                if (result.title && result.title.length > 0) {
                    setTitle(result.title);
                } else {
                    setTitle(pathSegments[pathSegments.length - 1]);
                }
            };
    
            if (pathSegments.length > 0) {
                fetchTitle();
            }
        }
        
    }, [getProductById]);

    return (
        <nav className="mb-4 text-gray-600">
            <ul className="flex flex-wrap sm:flex space-x-2">
                <li>
                    <Link to="/" className="text-gray-800">Home</Link> /
                </li>
                {pathSegments.map((segment, index) => {
                    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathSegments.length - 1;

                    return (
                        <li key={index}>
                            {isLast ? (
                                <span className="text-blue-500 font-semibold capitalize">
                                    {title || segment.replace("-", " ")}
                                </span>
                            ) : (
                                <Link to={path} className="text-gray-800 capitalize">
                                    {segment.replace("-", " ")}
                                </Link>
                            )}
                            {!isLast && " / "}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;

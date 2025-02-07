import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(segment => segment);

    return (
        <nav className="mb-4 text-gray-600">
            <ul className="flex space-x-2">
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
                                    {segment.replace("-", " ")}
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

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-centre shadow-md">
            <Link to="/dashboard" className="text-xl font-bold tracking-wide">
                ResumeIQ
            </Link>
            {user && (
                <div className="flex items-center gap-6">
                    <Link to = "/dashboard" className="hover:text-blue-200 transition">
                        Upload File
                    </Link>
                    <Link to = "/history" className="hover:text-blue-200 transition">
                        History
                    </Link>
                    <span className="text-blue-200 text-sm">
                        Hi, {user.name}
                    </span>
                    <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50 transition">
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 px-8 py-2 pb-0 w-full bg-fuchsia-900 text-zinc-200 shadow-md z-3">
      <nav className="flex justify-between items-center mb-2">
        <NavLink to="/">
          <h1 className="font-bold border-2 rounded-2xl p-1.25">
            Shopping List
          </h1>
        </NavLink>

        <div className="flex items-center gap-4 text-sm">
          {isAuthenticated && user && (
            <span className="truncate max-w-[180px] text-zinc-200/80">
              {user.email}
            </span>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium border border-input bg-background hover:bg-slate-100 text-zinc-900 h-9 rounded-md px-3"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium border border-input bg-background hover:bg-slate-100 text-zinc-900 h-9 rounded-md px-3"
              >
                Register
              </NavLink>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium border border-input bg-background hover:bg-slate-100 text-zinc-900 h-9 rounded-md px-3"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
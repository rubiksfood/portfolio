import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 px-8 py-2 pb-0 w-full bg-fuchsia-900 text-zinc-200 shadow-md z-3">
      <nav className="flex justify-between items-center mb-2">
        <NavLink to="/">
          <h1 className="font-bold border-2 rounded-2xl p-1.25">
            Shopping List
          </h1>
        </NavLink>

        <NavLink to="/create">
          <h3 className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3">
            Add New Item
          </h3>
        </NavLink>
      </nav>
    </div>
  );
}
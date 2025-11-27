import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="w-full bg-rose-100 p-6">
      <Navbar className="sticky" />
      <Outlet />
    </div>
  );
};
export default App;
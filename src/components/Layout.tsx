  import { Link, Outlet } from "react-router-dom";
  import { Menu } from 'lucide-react';


export default function Layout() {
  return (
    <>
      <nav>
        <div className="flex items-center justify-between bg-[#1D1D1D] p-1">
          <div className="flex items-center gap-2">
            <Menu className="text-[#E7E7E7] text-2xl" />
            <Link to="/">
            <h1 className="text-[#8BD5EF] text-xl font-bold">Live MarkDown Studio</h1>
          </Link>
          </div>
          
          <Link to="/about">
            <h1 className="text-[#E7E7E7] text-sm">About</h1>
          </Link>
          
        </div>
      </nav>
      <Outlet />
    </>
  )
}
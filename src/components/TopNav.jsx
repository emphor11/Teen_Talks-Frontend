// src/components/TopNav.jsx
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const TopNav = () => {
  const baseIcon =
    "w-6 h-6 transition-colors duration-200";

  const activeIcon = "text-[#FFFD02]";
  const inactiveIcon = "text-white hover:text-[#FFFD02]";
  const {user,setUser} = useContext(AuthContext)

  return (
    <nav className="w-full bg-[#1a1a1a]  py-4 shadow-md">
      <div className="max-w-md mx-auto gap-6  flex items-center justify-center px-10">
        
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `${baseIcon} ${isActive ? activeIcon : inactiveIcon}`
          }
        >
          <HomeIcon />
        </NavLink>

        <NavLink
          to={`/profile/${user?.id}`}
          className={({ isActive }) =>
            `${baseIcon} ${isActive ? activeIcon : inactiveIcon}`
          }
        >
          <UserIcon />
        </NavLink>

        {/* <NavLink
          to="/chats"
          className={({ isActive }) =>
            `${baseIcon} ${isActive ? activeIcon : inactiveIcon}`
          }
        >
          <ChatBubbleLeftRightIcon />
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${baseIcon} ${isActive ? activeIcon : inactiveIcon}`
          }
        >
          <Cog6ToothIcon />
        </NavLink> */}

      </div>
    </nav>
  );
};

export default TopNav;

/* eslint-disable */
import React from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Navbar from '../components/Navbar';
function Layout({ children }) {
  const { collapseSidebar } = useProSidebar();
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };
  return (
    <>
      <div className='row w-100'>
        <Navbar />
      </div>
      <div style={({ height: "90vh" }, { display: "flex" })}>
        <Sidebar style={{ minHeight: "90vh" }}>
          <Menu>
            <MenuItem
              icon={<MenuOutlinedIcon />}
              onClick={() => {
                collapseSidebar();
              }}
              style={{ textAlign: "center" }}
            >
              {" "}
              <h2>Admin</h2>
            </MenuItem>

            <MenuItem icon={<HomeOutlinedIcon />}>Dashboard</MenuItem>
            <MenuItem onClick={(e)=>handleLogout()} icon={<HomeOutlinedIcon />}>Logout</MenuItem>
          </Menu>
        </Sidebar>
        <main className='p-4 w-100' style={{overflow:'hidden'}}>
          {children}
        </main>
      </div>

    </>
  )
}

export default Layout
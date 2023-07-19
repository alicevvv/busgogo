import { useState } from "react"
import { Link, NavLink } from "react-router-dom";

import { Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import logo from '../img/logo.svg'

export default function Nav(){
    const [isActive, setActive] = useState(false);

    return(
        <div className="flex items-center w-full justify-between px-12 py-3">
            <Link to="/">
                <img src={logo} alt="公車動態應用系統"></img>
            </Link>
            {/* <Button
              onClick={handleToggle}
              className="btn-navbar"
              style={{ border: "none" }}
            >
              {<MenuOutlined />}
            </Button> */}
            <div className="flex items-baseline">
                <NavLink to="/news" className="p-3 font-bold text-primary">
                  最新消息
                </NavLink>
            </div>
        </div>
    )
}
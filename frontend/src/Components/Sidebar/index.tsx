import React from 'react';
import { NavLink } from "react-router-dom";
import { FaTruck, FaUserAlt } from 'react-icons/fa';

import './index.css';

const Sidebar:React.FC = () => {
    return (
      <div className="sidebar">
        <ul>
          <li>
            <NavLink to="/cargas"><FaTruck fontSize={20}/> <p>Cargas</p></NavLink>
          </li>
          <li>
            <NavLink to="/clientes"><FaUserAlt fontSize={20}/> <p>Clientes</p></NavLink>
          </li>
        </ul>
      </div>
    );
}

export default Sidebar;

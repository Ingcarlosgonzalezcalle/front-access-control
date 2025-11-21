import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilAccountLogout,
  cilAddressBook,
  cilLockLocked,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { Link } from 'react-router-dom'

const AppHeaderDropdown = () => {

   const logOut = () => {
    localStorage.setItem("isLogin", false);
    localStorage.setItem("token", "NOK");
    window.location.href = '/login';
  }


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Atajos</CDropdownHeader>

        <CDropdownItem href="#">
          <CIcon icon={cilAddressBook} className="me-2" />
          <Link to="/admin/groups" style={{textDecoration:'none'}} >
            Grupos
          </Link>          
        </CDropdownItem>

         <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          <Link to="/admin/users" style={{textDecoration:'none'}} >
            Usuarios
          </Link>          
        </CDropdownItem>   

        <CDropdownDivider />
        <CDropdownItem  onClick={() => logOut()} href="#">
          <CIcon icon={cilAccountLogout} className="me-2"  />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

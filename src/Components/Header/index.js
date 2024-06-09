import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaHome} from 'react-icons/fa'
import {MdWork} from 'react-icons/md'
import {AiOutlineLogout} from 'react-icons/ai'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="main-header-section">
      <div className="header-nav-section-container">
        {/* Mobile Device View - Elements */}

        <div className="mobile-view-header-container">
          <Link to="/" className="mobile-view-link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="mobile-view-app-logo-image"
            />
          </Link>
          <ul className="mobile-view-nav-items">
            <Link to="/" className="mobile-view-link">
              <li className="nav-item">
                <FaHome size="20" color="white" />
              </li>
            </Link>
            <Link to="/jobs" className="mobile-view-link">
              <li className="nav-item">
                <MdWork size="20" color="white" />
              </li>
            </Link>
            <li className="nav-item">
              <button
                className="mobile-view-logout-icon-button"
                type="button"
                onClick={onClickLogout}
              >
                <AiOutlineLogout size="20" color="white" />
              </button>
            </li>
          </ul>
        </div>

        {/* Other Devices View - Elements */}

        <div className="header-container">
          <Link to="/" className="logo-link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="app-logo-image"
            />
          </Link>
          <div className="nav-items">
            <Link to="/" className="home-item-link">
              Home
            </Link>
            <Link to="/jobs" className="jobs-item-link">
              Jobs
            </Link>
          </div>
          <button
            className="logout-button"
            type="button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Header)

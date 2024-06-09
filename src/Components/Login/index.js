import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginPage extends Component {
  state = {
    inputUsername: '',
    inputPassword: '',
    isError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({inputUsername: event.target.value})
  }

  onChangePassword = event => {
    this.setState({inputPassword: event.target.value})
  }

  loginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {inputUsername, inputPassword} = this.state
    const loginApi = 'https://apis.ccbp.in/login'
    const userDetails = {username: inputUsername, password: inputPassword}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginApi, options)
    const loginData = await response.json()

    if (response.ok === true) {
      this.loginSuccess(loginData.jwt_token)
    } else {
      this.setState({isError: true, errorMsg: loginData.error_msg})
    }
  }

  render() {
    const {inputUsername, inputPassword, isError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page-route-container">
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div className="input-container">
            <label htmlFor="Username" className="input-label">
              USERNAME
            </label>
            <input
              id="Username"
              type="text"
              placeholder="Username"
              className="input"
              onChange={this.onChangeUsername}
              value={inputUsername}
            />
          </div>
          <div className="input-container">
            <label htmlFor="Password" className="input-label">
              PASSWORD
            </label>
            <input
              id="Password"
              type="password"
              placeholder="Password"
              className="input"
              onChange={this.onChangePassword}
              value={inputPassword}
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {isError && <p className="login-error-msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginPage

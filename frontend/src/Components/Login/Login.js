import classes from "./Login.module.css";
import React from "react";

const Login = () => {
  return (
    <div className={classes.login}>
      <h1>DND AI</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor='username'>Username</label>
          <input type='text' placeholder='Username' id='username' />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Password</label>
          <input type='password' placeholder='Password' id='password' />
        </div>
        <div>
          <input type='checkbox' id='rememberPassword' />
          <label htmlFor='rememberPassword'>Remember Password</label>
        </div>
        <div className={classes.actions}>
          <button type='submit'>Login</button>
        </div>
      </form>
      <div>
        <div>
          {" "}
          <a href='/forgotpassword'>Forgot password</a>
        </div>
        <div>
          <a href='/register'>Don't have an account? Sign up here!</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

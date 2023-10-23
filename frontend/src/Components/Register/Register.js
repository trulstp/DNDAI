import classes from "./Register.module.css";
import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className={classes.register}>
      <h1>DND AI</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor='username'>Username</label>
          <input type='text' placeholder='Username' id='username' />
        </div>
        <div className={classes.control}>
          <label htmlFor='email'>Email</label>
          <input type='email' placeholder='Email' id='email' />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Password</label>
          <input type='password' placeholder='Password' id='password' />
        </div>
        <div className={classes.control}>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            placeholder='Confirm Password'
            id='confirmPassword'
          />
        </div>
        <div>
          <input type='checkbox' id='rememberPassword' />
          <label htmlFor='rememberPassword'>Remember Password</label>
        </div>
        <div className={classes.actions}>
          <button type='submit'>Register</button>
        </div>
      </form>
      <div>
        <Link to='/login'>Already have an account? Login here!</Link>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { setToken } from "../slices/authSlice";

const Form = ({ closeForm }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
      event.preventDefault();
      setMessage(""); 
  
      const payload = { username, password };
  
      try {
          // First API call: Login to get the token
          const response = await fetch(`${import.meta.env.VITE_ED_URL}/auth/eduprime`, {
              method: "POST",
              credentials: 'include',  // To include cookies if needed
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
          });
  
          const data = await response.json();
  
          if (response.ok && data.token) {
              setMessage("Login successful! Setting token...");
              dispatch(setToken(data.token));
              // Make a POST request to set the token via the server
            await setTokenOnServer(data.token);

          } else {
              setMessage(data.error || "Authentication failed.");
          }
      } catch (error) {
          setMessage("Something went wrong. Please try again.");
      }
  };
  const setTokenOnServer = async (token) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/public/set-api`, {
            method: "POST",
            credentials: 'include',  // Include cookies if the server sets them
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),  // Send token to server
        });

        const result = await response.json( );
        dispatch(setToken(result.token));
        window.location.reload()

        if (response.ok) {
            setMessage("Token set successfully! Fetching user data...");
        } else {
            setMessage(result.error || "Failed to set token.");
        }
    } catch (error) {
        setMessage("Error setting token. Please try again.");
    }
};


  return (
    <StyledWrapper>
      <div className="form-container">
        <div className="close-cont" onClick={closeForm}>
            <p className='close'>X</p>
        </div>
        <p className="title">Login</p>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" placeholder='username' required value={username} onChange={(e)=>setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" placeholder='password' required value={password} onChange={(e)=>setPassword(e.target.value)} />

          </div>
          <button className="sign">Sign in</button>
        </form>
        <div className="social-message">
          <div className="line" />
          <p className="message">Login with social accounts</p>
          <div className="line" />
        </div>
        <div className="social-icons">
          <button aria-label="Log in with Google" className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
            </svg>
          </button>
          
          <button aria-label="Log in with GitHub" className="icon" 
  onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
            </svg>
          </button>
        </div>

      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`

  .form-container {
    margin:auto;
    margin-top:25vh;
    width: 350px;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
    position:relative;
    z-index:3000;
  }
    .close-cont{
    position:absolute;
    right:1vw;
    top:2vh;
    border-radius:15px;
    background-color:rgb(34, 55, 100);
    width:50px;
    height:50px;
    font-size:20px;
    display:flex;
    cursor:pointer
    }
    .close-cont:hover{
    background-color:white;
    color:black;
    }
    .close{
    margin:auto;
    }
  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
  }

  .input-group input:focus {
    border-color: rgba(167, 139, 250);
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175,1);
    margin: 8px 0 14px 0;
  }

  .forgot a,.signup a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
  }

  .forgot a:hover, .signup a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
  }

  .sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    max-width:90px;
    margin:auto;
    margin-top:15px;

  }

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0%;
    background-color: rgba(55, 65, 81, 1);
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(156, 163, 175, 1);
  }

  .social-icons {
    display: flex;
    justify-content: center;
  }

  .social-icons .icon {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
  }
  .social-icons .icon:hover{
    cursor:pointer;
  }
  .social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff;
  }

  .signup {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
  }`;

export default Form;

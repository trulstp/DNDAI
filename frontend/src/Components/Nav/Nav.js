import React from "react";
import classes from "./Nav.module.css";
import { Link } from "react-router-dom";
import { SidebarContext } from "../../store/sidebar-context";
import { useContext } from "react";

const Nav = () => {
  const {
    handleSidebar,
    handleLightMode,
    lightMode,
    sidebarOpen,
    handleHover,
    handleHoverOff,
  } = useContext(SidebarContext);

  const history = sidebarOpen ? "history" : "";
  const historyNav = sidebarOpen ? "historyNav" : "navbar";

  return (
    <nav
      className={`${classes[historyNav]}`}
      onMouseEnter={() => handleHover()}
      onMouseLeave={() => handleHoverOff()}
    >
      <ul className={classes["navbar-nav"]}>
        <li className={classes["logo"]}>
          <Link to='/' className={classes["nav-link-logo"]}>
            {!sidebarOpen ? (
              <span
                className={`${classes["link-text"]} ${classes["logo-text"]} ${classes["link-text-logo"]}`}
              >
                <span className={classes["fa-secondary"]}>Support</span>
                <br />
                <span className={classes["fa-primary"]}>Roll</span>
              </span>
            ) : (
              <span
                className={`${classes["link-text"]} ${classes["logo-text"]} ${classes["link-text-logo"]}`}
              >
                <span className={classes["fa-secondary"]}>Encounter</span>
                <br />
                <span className={classes["fa-primary"]}>History</span>
              </span>
            )}

            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fad'
              data-icon='angle-double-right'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              className={classes["svg-inline--fa"]}
            >
              <g class='fa-group'>
                <path
                  fill='currentColor'
                  d='M224 273L88.37 409a23.78 23.78 0 0 1-33.8 0L32 386.36a23.94 23.94 0 0 1 0-33.89l96.13-96.37L32 159.73a23.94 23.94 0 0 1 0-33.89l22.44-22.79a23.78 23.78 0 0 1 33.8 0L223.88 239a23.94 23.94 0 0 1 .1 34z'
                  className={classes["fa-primary"]}
                ></path>
                <path
                  fill='currentColor'
                  d='M415.89 273L280.34 409a23.77 23.77 0 0 1-33.79 0L224 386.26a23.94 23.94 0 0 1 0-33.89L320.11 256l-96-96.47a23.94 23.94 0 0 1 0-33.89l22.52-22.59a23.77 23.77 0 0 1 33.79 0L416 239a24 24 0 0 1-.11 34z'
                  className={classes["fa-secondary"]}
                ></path>
              </g>
            </svg>
          </Link>
        </li>
        <li className={classes["nav-item"]}>
          <div
            onClick={handleSidebar}
            className={`${classes["nav-link"]} ${classes[history]} `}
          >
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fad'
              data-icon='clipboard'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 384 512'
              class='svg-inline--fa fa-new-icon fa-w-12 fa-9x'
            >
              <path
                fill='currentColor'
                d='M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z'
                className={classes["fa-secondary"]}
              ></path>
            </svg>

            <span className={classes["link-text"]}>History</span>
          </div>
        </li>
        <li className={classes["nav-item"]}>
          <Link to='/encounter' className={classes["nav-link"]}>
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fad'
              data-icon='dragon' // Change the icon name to 'dragon'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 640 512' // Change the viewBox to match the dragon icon
              class='svg-inline--fa fa-dragon fa-w-20 fa-9x' // Update the class for the dragon icon
            >
              <path
                fill='currentColor'
                d='M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0H416h32 16c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48H538.5c-17 0-33.3-6.7-45.3-18.7L480 160H448v21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512H496 432 32.3c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1V181.5v-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3v.6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87V227c0 32.8 8.4 64.8 24 93H112c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z'
                className={classes["fa-primary"]}
              />
              <path
                fill='currentColor'
                d='M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0H416h32 16c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48H538.5c-17 0-33.3-6.7-45.3-18.7L480 160H448v21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512H496 432 32.3c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1V181.5v-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3v.6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87V227c0 32.8 8.4 64.8 24 93H112c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z'
                className={classes["fa-secondary"]}
              />
            </svg>
            <span className={classes["link-text"]}>Random Encounter</span>
          </Link>
        </li>
        <li className={classes["nav-item"]}>
          <Link to='/creator' className={classes["nav-link"]}>
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fad'
              data-icon='wizard' // Change the icon name to 'wizard'
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512' // The viewBox for the wizard icon
              class='svg-inline--fa fa-wizard fa-w-16 fa-9x' // Update the class for the wizard icon
            >
              <path
                fill='currentColor'
                d='M64 416L168.6 180.7c15.3-34.4 40.3-63.5 72-83.7l146.9-94c3-1.9 6.5-2.9 10-2.9C407.7 0 416 8.3 416 18.6v1.6c0 2.6-.5 5.1-1.4 7.5L354.8 176.9c-1.9 4.7-2.8 9.7-2.8 14.7c0 5.5 1.2 11 3.4 16.1L448 416H240.9l11.8-35.4 40.4-13.5c6.5-2.2 10.9-8.3 10.9-15.2s-4.4-13-10.9-15.2l-40.4-13.5-13.5-40.4C237 276.4 230.9 272 224 272s-13 4.4-15.2 10.9l-13.5 40.4-40.4 13.5C148.4 339 144 345.1 144 352s4.4 13 10.9 15.2l40.4 13.5L207.1 416H64zM279.6 141.5c-1.1-3.3-4.1-5.5-7.6-5.5s-6.5 2.2-7.6 5.5l-6.7 20.2-20.2 6.7c-3.3 1.1-5.5 4.1-5.5 7.6s2.2 6.5 5.5 7.6l20.2 6.7 6.7 20.2c1.1 3.3 4.1 5.5 7.6 5.5s6.5-2.2 7.6-5.5l6.7-20.2 20.2-6.7c3.3-1.1 5.5-4.1 5.5-7.6s-2.2-6.5-5.5-7.6l-20.2-6.7-6.7-20.2zM32 448H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32z'
                className={classes["fa-primary"]}
              />
              <path
                fill='currentColor'
                d='M64 416L168.6 180.7c15.3-34.4 40.3-63.5 72-83.7l146.9-94c3-1.9 6.5-2.9 10-2.9C407.7 0 416 8.3 416 18.6v1.6c0 2.6-.5 5.1-1.4 7.5L354.8 176.9c-1.9 4.7-2.8 9.7-2.8 14.7c0 5.5 1.2 11 3.4 16.1L448 416H240.9l11.8-35.4 40.4-13.5c6.5-2.2 10.9-8.3 10.9-15.2s-4.4-13-10.9-15.2l-40.4-13.5-13.5-40.4C237 276.4 230.9 272 224 272s-13 4.4-15.2 10.9l-13.5 40.4-40.4 13.5C148.4 339 144 345.1 144 352s4.4 13 10.9 15.2l40.4 13.5L207.1 416H64zM279.6 141.5c-1.1-3.3-4.1-5.5-7.6-5.5s-6.5 2.2-7.6 5.5l-6.7 20.2-20.2 6.7c-3.3 1.1-5.5 4.1-5.5 7.6s2.2 6.5 5.5 7.6l20.2 6.7 6.7 20.2c1.1 3.3 4.1 5.5 7.6 5.5s6.5-2.2 7.6-5.5l6.7-20.2 20.2-6.7c3.3-1.1 5.5-4.1 5.5-7.6s-2.2-6.5-5.5-7.6l-20.2-6.7-6.7-20.2zM32 448H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32z'
                className={classes["fa-secondary"]}
              />
            </svg>
            <span className={classes["link-text"]}>Character Creator</span>
          </Link>
        </li>
        {/* <li className={classes["nav-item"]}>
          <Link to='/login' className={classes["nav-link"]}>
            <svg
              aria-hidden='true'
              focusable='false'
              data-prefix='fad'
              data-icon='custom-icon' // You can define the custom icon name here
              role='img'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512' // The viewBox for the new icon
              class='svg-inline--fa fa-custom-icon fa-w-16 fa-9x' // Update the class for the new icon
            >
              <path
                fill='currentColor'
                d='M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z'
                className={classes["fa-primary"]}
              />
              <path
                fill='currentColor'
                d='M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z'
                className={classes["fa-secondary"]}
              />
            </svg>
            <span className={classes["link-text"]}>Login</span>
          </Link>
        </li> */}
        <li className={classes["nav-item"]}>
          <div onClick={handleLightMode} className={classes["nav-link"]}>
            {!lightMode && (
              <svg
                id='solarIcon'
                aria-hidden='true'
                focusable='false'
                data-prefix='fad'
                data-icon='sun'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 512 512'
                class='svg-inline--fa fa-sun fa-w-16 fa-7x'
              >
                <g class='fa-group'>
                  <path
                    fill='currentColor'
                    d='M502.42 240.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.41-94.8a17.31 17.31 0 0 0-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4a17.31 17.31 0 0 0 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.41-33.5 47.3 94.7a17.31 17.31 0 0 0 31 0l47.31-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3a17.33 17.33 0 0 0 .2-31.1zm-155.9 106c-49.91 49.9-131.11 49.9-181 0a128.13 128.13 0 0 1 0-181c49.9-49.9 131.1-49.9 181 0a128.13 128.13 0 0 1 0 181z'
                    className={classes["fa-secondary"]}
                  ></path>
                  <path
                    fill='currentColor'
                    d='M352 256a96 96 0 1 1-96-96 96.15 96.15 0 0 1 96 96z'
                    className={classes["fa-primary"]}
                  ></path>
                </g>
              </svg>
            )}
            {lightMode && (
              <svg
                aria-hidden='true'
                focusable='false'
                data-prefix='fad'
                data-icon='moon' // The icon name is 'moon'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 384 512' // The viewBox for the moon icon
                class='svg-inline--fa fa-moon fa-w-12 fa-9x' // Update the class for the moon icon
              >
                <path
                  fill='currentColor'
                  d='M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z'
                  className={classes["fa-primary"]}
                />
                <path
                  fill='currentColor'
                  d='M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z'
                  className={classes["fa-secondary"]}
                />
              </svg>
            )}

            <span className={classes["link-text"]}>
              {!lightMode && "Light Mode"}
              {lightMode && "Dark Mode"}
            </span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;

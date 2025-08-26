import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/sureodds-logo.png";

const Nav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <List>
      <ListItem
        button
        component={Link}
        to="/about"
        onClick={toggleDrawer(false)}
      >
        <ListItemText primary="About" />
      </ListItem>

      {user ? (
        <>
          {/* <ListItem
            button
            component={Link}
            to="/profile"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Profile" />
          </ListItem> */}
          <ListItem
            button
            onClick={() => {
              logout();
              toggleDrawer(false)();
            }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem
            button
            component={Link}
            to="/login"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/signup"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Signup" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000000" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#ffffff" }}>
            Sure Odds
          </Link>
        </Typography> */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo} // Use the imported logo variable
              alt="Sure Odds Logo"
              style={{
                height: "70px", // Increase the height to make it bigger
                display: "block",
                margin: "0", // Remove auto margin to align it to the left
              }}
            />
          </Link>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button color="inherit" style={{ fontSize: "12px" }}>
            <Link
              to="/about"
              style={{ textDecoration: "none", color: "#ffffff" }}
            >
              About
            </Link>
          </Button>
        </Box>
        {user ? (
          <>
            {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button color="inherit" style={{ fontSize: "12px" }}>
                <Link
                  to="/profile"
                  style={{ textDecoration: "none", color: "#ffffff" }}
                >
                  Profile
                </Link>
              </Button>
            </Box> */}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button
                color="inherit"
                style={{ fontSize: "12px" }}
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button color="inherit" style={{ fontSize: "12px" }}>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "#ffffff" }}
                >
                  Login
                </Link>
              </Button>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button color="inherit" style={{ fontSize: "12px" }}>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "#ffffff" }}
                >
                  Signup
                </Link>
              </Button>
            </Box>
          </>
        )}
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </AppBar>
  );
};

export default Nav;

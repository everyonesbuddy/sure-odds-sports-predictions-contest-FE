import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Nav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        component="a"
        href="https://buymeacoffee.com/sureodds"
        target="_blank"
        rel="noopener noreferrer"
        onClick={toggleDrawer(false)}
      >
        <ListItemText primary="Donate to Handicappers" />
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: "#4F46E5" }}>
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sure Odds
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Button color="inherit" style={{ fontSize: "12px" }}>
            <a
              href="https://ko-fi.com/sureodds"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#ffffff" }}
            >
              Donate to Handicappers
            </a>
          </Button>
        </Box>
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </AppBar>
  );
};

export default Nav;

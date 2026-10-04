import { memo, useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";

import {
  DashboardOutlined,
  AddCircleOutlineOutlined,
  AssignmentOutlined,
  SmartToyOutlined,
  HelpOutlineOutlined,
  LogoutOutlined,
  Close,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    id: "new-request",
    label: "New Request",
    icon: <AddCircleOutlineOutlined />,
  },
  {
    id: "my-requests",
    label: "My Requests",
    icon: <AssignmentOutlined />,
  },
  {
    id: "ai-assistant",
    label: "AI Assistant",
    icon: <SmartToyOutlined />,
  },
];

function Sidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onMobileClose,
  isMobile,
}) {
  const [Registration , setReg] = useState("")
  const [name , setName] = useState("")
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  useEffect(()=>{
   const userRole = localStorage.getItem("user");
   if(userRole){
    const user = JSON.parse(userRole);
   setReg(user.Registration);
   setName(user.name);
    
   }
  },[]);

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
      }}
    >
     
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandLogo size="small" />

        {isMobile && (
          <IconButton onClick={onMobileClose} size="small">
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: "#f1f5f9" }} />

      
      <Box sx={{ p: 1.5, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            py: 0.5,
            display: "block",
            color: "#94a3b8",
            fontWeight: 700,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Menu
        </Typography>

        <List disablePadding sx={{ mt: 0.5 }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <ListItem
                key={item.id}
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  onClick={() => {
                    onSelectTab(item.id);

                    if (isMobile) {
                      onMobileClose();
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    px: 1.5,
                    backgroundColor: isActive
                      ? "#14213d"
                      : "transparent",
                    color: isActive
                      ? "#ffffff"
                      : "#475569",

                    "&:hover": {
                      backgroundColor: isActive
                        ? "#0f172a"
                        : "#f1f5f9",
                      color: isActive
                        ? "#ffffff"
                        : "#0f172a",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive
                        ? "#ffffff"
                        : "#64748b",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 600 : 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: "#f1f5f9" }} />

      
      <Box sx={{ p: 1.5 }}>
        <List disablePadding>
        
          <ListItem
            disablePadding
            sx={{ mb: 0.5 }}
          >
            <ListItemButton
              onClick={() => onSelectTab("help")}
              sx={{
                borderRadius: 2,
                py: 0.8,
                px: 1.5,
                backgroundColor: activeTab === "help" ? "#f1f5f9" : "transparent",
                color: activeTab === "help" ? "#14213d" : "#64748b",
                fontWeight: activeTab === "help" ? 600 : 500,
                "&:hover": {
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: activeTab === "help" ? "#14213d" : "#64748b",
                }}
              >
                <HelpOutlineOutlined fontSize="small" />
              </ListItemIcon>

              <ListItemText
                primary="Support & FAQs"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.82rem",
                      fontWeight: activeTab === "help" ? 600 : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>

         
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 0.8,
                px: 1.5,
                color: "#dc2626",

                "&:hover": {
                  backgroundColor: "#fef2f2",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "#dc2626",
                }}
              >
                <LogoutOutlined fontSize="small" />
              </ListItemIcon>

              <ListItemText
                primary="Sign Out"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>

       
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              backgroundColor: "#14213d",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
          >
            RS
          </Avatar>

          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontWeight: 600,
                color: "#0f172a",
                fontSize: "0.82rem",
              }}
            >
             {name}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{
                display: "block",
                fontSize: "0.72rem",
              }}
            >
            Reg No.: {Registration}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: "block",
              md: "none",
            },

            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 260,
              borderRight: "1px solid #e2e8f0",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        
        <Box
          component="nav"
          sx={{
            width: 260,
            flexShrink: 0,
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <Box
            sx={{
              width: 260,
              height: "100vh",
              position: "sticky",
              top: 0,
            }}
          >
            {drawerContent}
          </Box>
        </Box>
      )}
    </>
  );
}

export default memo(Sidebar);
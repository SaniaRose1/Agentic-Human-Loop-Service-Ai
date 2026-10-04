import {
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  NotificationsNoneOutlined,
  TranslateOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function Header({
  title = "Dashboard",
  subtitle = "Institutional Service Portal",
  onMenuToggle,
  unreadCount = 2,

  
}) {
  const [name , setName] = useState(null);
  useEffect(()=>{
   const userRole = localStorage.getItem("user");
    if (userRole) {
      const user = JSON.parse(userRole);
   setName(user.name);
    }


  },[]);
  return (
    <Box
      component="header"
      sx={{
        height: 64,
        px: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
     
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
          sx={{ display: { md: "none" }, color: "#1e293b" }}
        >
          <MenuIcon />
        </IconButton>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              fontSize: { xs: "1rem", sm: "1.15rem" },
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              display: { xs: "none", sm: "block" },
              fontSize: "0.75rem",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>

      
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
        <Tooltip title="Multilingual Service Mode (English / Odia / Hindi)">
          <IconButton size="small" sx={{ color: "#64748b" }}>
            <TranslateOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={`${unreadCount} Notifications`}>
          <IconButton size="small" sx={{ color: "#64748b" }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneOutlined fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        <Chip
          label="Student"
          size="small"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            backgroundColor: "#f1f5f9",
            color: "#14213d",
            fontWeight: 600,
            fontSize: "0.72rem",
            height: 24,
            border: "1px solid #cbd5e1",
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "left" }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#0f172a",
                fontSize: "0.82rem",
                lineHeight: 1.2,
              }}
            >
           {name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.72rem" }}
            >
              CSE Dept
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

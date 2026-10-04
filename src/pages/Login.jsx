import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import BrandLogo from "../components/BrandLogo";


export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
   const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [Registration , setReg] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [islogin , setLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success , setSuccess] = useState(false);

 const handleRegister = async(event) =>{
  event.preventDefault();
  setLoading(true);
  let data =  {name ,section ,Registration, password, role}
   
  if(role === "student"){
    if (!section.trim() ||  !Registration.trim() || !name ) {
      setError("Please enter your details");
      setLoading(false);
      return;
    }
  }
   if(role === "admin"){
    if (!password.trim() || !name ) {
      setError("Please enter your details");
      setLoading(false);
      return;
    }
  }
    try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`,{
      method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const result = await res.json();
    console.log(result);

    if (res.ok) {
       setSuccess(true);
       setError("");
       } else {
      setError(result.error || "Register failed");
    }
    
 }catch(error){
    console.log(error);
    setError("Something went wrong. Try again.");
  }finally {
    setLoading(false);
  }
}
  

  const handleLogin = async(event) => {
   event.preventDefault();
   setLoading(true);
   setError("");
   let data= {name ,section ,Registration, password , role} ;
   
   if(role === "student"){
    if (!section.trim() ||  !Registration.trim() || !name ) {
      setError("Please enter your details");
      setLoading(false);
      return;
    }
  }
   if(role === "admin"){
    if (!password.trim() || !name ) {
      setError("Please enter your details");
      setLoading(false);
      return;
    }
  }

  try{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
      method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    const result = await res.json();
    console.log(result);

    if (res.ok) {
      
        localStorage.setItem("user", JSON.stringify(result.user));
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/student");
    }
    } else {
      setError(result.error || "Login failed");
    }
     
   
  }
  catch(error){
    console.log(error);
    setError("Something went wrong. Try again.");
  }
  finally {
    setLoading(false);
  }
};

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
     
      <Grid
        size={{ xs: 12, md: 5 }}
        sx={{
          bgcolor: "#14213d",
          position: "relative",
          overflow: "hidden",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3.5rem 2.5rem",
        }}
      >
       
        <Box
          component="svg"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <defs>
            <pattern
              id="editorial-dot-pattern"
              width="18"
              height="18"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="9" cy="9" r="1.5" fill="#ffffff" fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#editorial-dot-pattern)" />
        </Box>

        
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <BrandLogo size="small" light showDeemedLine layout="row" />
        </Box>

        
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: "19px",
              color: "#ffffff",
              lineHeight: 1.5,
              maxWidth: 320,
              fontWeight: 400,
            }}
          >
            Every approval traceable. Every action accountable.
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.55)",
              mt: 1.5,
              lineHeight: 1.5,
              maxWidth: 320,
            }}
          >
            Institutional service delivery, verified by policy and signed off by people.
          </Typography>
        </Box>

       
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                4
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  mt: 0.5,
                }}
              >
                service workflows
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                100%
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  mt: 0.5,
                }}
              >
                human-reviewed
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Grid>

     
      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: "2rem 1.5rem", sm: "2.5rem 3rem" },
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "320px" }}>
         
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              mb: 3.5,
            }}
          >
            <BrandLogo size="large" showDeemedLine light={false} />
          </Box>

          
          <Typography
            variant="h6"
            sx={{
              fontSize: "20px",
              fontWeight: 500,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Sign in to your account
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              color: "text.secondary",
              mt: 0.5,
              mb: 3,
            }}
          >
            Use your institutional credentials to continue.
          </Typography>

        
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              borderBottom: "0.5px solid",
              borderColor: "divider",
              mb: 2.5,
            }}
          >
            <Box
              onClick={() => {
                setRole("student");
                setError("");
              }}
              sx={{
                pb: 1.2,
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: role === "student" ? 500 : 400,
                color: role === "student" ? "text.primary" : "text.disabled",
                borderBottom:
                  role === "student" ? "2px solid #14213d" : "2px solid transparent",
                mb: "-1px",
                transition: "all 0.2s ease",
                userSelect: "none",
              }}
            >
              Student
            </Box>
            <Box
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              sx={{
                pb: 1.2,
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: role === "admin" ? 500 : 400,
                color: role === "admin" ? "text.primary" : "text.disabled",
                borderBottom:
                  role === "admin" ? "2px solid #14213d" : "2px solid transparent",
                mb: "-1px",
                transition: "all 0.2s ease",
                userSelect: "none",
              }}
            >
              Admin / officer
            </Box>
          </Box>

        
          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: "12px", py: 0.5 }}>
              {error}
            </Alert>
          )}

        
          <Box component="form" onSubmit={islogin ? handleLogin : handleRegister} noValidate>

              <Typography
              component="label"
              htmlFor="email-input"
              sx={{
                fontSize: "12px",
                color: "text.secondary",
                display: "block",
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Institutional name
            </Typography>
            <TextField
              id="email-input"
              fullWidth
              size="small"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                mb: 1.75,
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  borderRadius: 1.5,
                },
              }}
            />
           
          
        {role === "student" && (
          <>
          <Typography
              component="label"
              htmlFor="email-input"
              sx={{
                fontSize: "12px",
                color: "text.secondary",
                display: "block",
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Institutional Section
            </Typography>
            <TextField
              id="email-input"
              fullWidth
              size="small"
              type="text"
              placeholder="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              sx={{
                mb: 1.75,
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  borderRadius: 1.5,
                },
              }}
            />
           
         </>)}
           
           {role === "student" ? (
            <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography
                component="label"
                htmlFor="password-input"
                sx={{
                  fontSize: "12px",
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                Registraion no
              </Typography>
             
            </Box>
            <TextField
              id="password-input"
              fullWidth
              size="small"
              type="text"
              placeholder="Enter your password"
              value={Registration}
              onChange={(e) => setReg(e.target.value)}
              sx={{
                mb: 2.75,
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  borderRadius: 1.5,
                },
              }}
            />
            </>): (
              <>
              <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography
                component="label"
                htmlFor="password-input"
                sx={{
                  fontSize: "12px",
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
               Password
              </Typography>
             
            </Box>
            <TextField
              id="password-input"
              fullWidth
              size="small"
              type="text"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2.75,
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  borderRadius: 1.5,
                },
              }}
            />
            </>
            )}

            
            <Button
  type="submit"
  fullWidth
  variant="contained"
  disabled={loading}
  sx={{
    bgcolor: "#14213d",
    color: "#ffffff",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "13px",
    py: 1.1,
    borderRadius: 1.5,
    boxShadow: "none",
    mb: 1.75,
    "&:hover": {
      bgcolor: "#0f172a",
      boxShadow: "none",
    },
    "&:disabled": {
      bgcolor: "#64748b",
      color: "#ffffff",
    },
  }}
>
  {loading ? (
    <>
      <Box
        sx={{
          width: 18,
          height: 18,
          border: "2px solid rgba(255,255,255,0.35)",
          borderTop: "2px solid #ffffff",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          mr: 1,
          "@keyframes spin": {
            from: {
              transform: "rotate(0deg)",
            },
            to: {
              transform: "rotate(360deg)",
            },
          },
        }}
      />
      {islogin ? "Logging in..." : "Registering..."}
    </>
  ) : (
    islogin ? "Login" : "Register"
  )}
</Button>
            <p style={{ marginTop: "12px", textAlign: "center" ,color:"black" }}>
        {islogin ? "Don't have an account?" : "Already have an account?"}
        <span
          style={{ color: "blue", cursor: "pointer",fontWeight: "200", marginLeft: "6px" }}
          onClick={() => setLogin(!islogin)}
        >
          {islogin ? " Create an account" : " Login"}
        </span>
      </p>


           
            <Typography
              align="center"
              sx={{
                fontSize: "12px",
                color: "text.disabled",
              }}
            >
              Trouble signing in?{" "}
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Contact the academic desk
              </Box>
            </Typography>
          </Box>
        </Box>
      </Grid>
   

   

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Registration successful
        </Alert>
      </Snackbar>
    </Grid>
  
  );
}
"use client";
import  { useEffect, useState } from "react";
import { Box, Typography, Container, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import FarmImage from "../components/FarmImage";
import farmImg1 from "../assets/1.jpeg";
import farmImg2 from "../assets/2.jpg";
import farmImg3 from "../assets/3.jpg";
// ===== الصفحة الرئيسية =====
const images = [
  { src: farmImg1, alt: "مزرعة دواجن 1" },
  { src: farmImg2, alt: "مزرعة دواجن 2" },
  { src: farmImg3, alt: "مزرعة دواجن 3" },
];

export default function HomePage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "";
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        bgcolor: "#fff",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        backgroundImage: `url(${farmImg3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(255,255,255,0.7)",
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="#c62828"
          sx={{
            mb: 2,
            fontSize: { xs: 24, sm: 32, md: 38 },
            fontFamily: `'IBM Plex Sans Arabic', Arial, sans-serif`,
            letterSpacing: 1,
            textAlign: "center",
            mt: 6,
          }}
          gutterBottom
        >
          أهلاً بك في نظام تقارير مداجن القديراني
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            fontSize: { xs: 15, sm: 18 },
            textAlign: "center",
          }}
        >
          هذا النظام يوفر لك تقارير يومية وشهرية واحصائيات دقيقة لإنتاج المداجن.
        </Typography>

        {/* صورة واحدة في الوسط مع انتقال تلقائي وأسهم */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: 400,
            mb: 4,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { xs: 0, md: 30 },
              zIndex: 3,
              bgcolor: "#c62828",
              "&:hover": { bgcolor: "rgba(161, 57, 57, 0.9)" },
            }}
            aria-label="السابق"
          >
            <ArrowBackIos sx={{color:"#fff"}} />
          </IconButton>
          <FarmImage
            src={images[current].src}
            alt={images[current].alt}
            sx={{
              maxWidth: { xs: "100vw", sm: 600 },
              maxHeight: { xs: 300, sm: 400 },
              borderRadius: 4,
              boxShadow: 3,
              transition: "all 0.5s",
              objectFit: "cover",
              mx: 4,
            }}
          />
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 0, md: 30 },
              zIndex: 3,
              bgcolor: "#c62828",
              "&:hover": { bgcolor: "rgba(161, 57, 57, 0.9)" },
            }}
            aria-label="التالي"
          >
            <ArrowForwardIos sx={{color:"#fff"}}  />
          </IconButton>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 2,
            fontWeight: "bold",
            fontSize: { xs: 14, sm: 16 },
            textAlign: "center",

          }}
        >
          يمكنك التنقل بين الأقسام من القائمة العلوية للاطلاع على تقارير أو إضافة بيانات جديدة
        </Typography>
      </Container>
    </Box>
  );
}

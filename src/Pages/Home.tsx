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
        minHeight: { xs: "100vh", sm: "100vh" },
        overflow: "hidden",
        bgcolor: "#fff",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        backgroundImage: `url(${farmImg3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: { xs: 0, sm: 0 },
        '&:before': {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: { xs: "rgba(255,255,255,0.85)", sm: "rgba(255,255,255,0.7)" },
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
          minHeight: { xs: "100vh", sm: "100vh" },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          color="#c62828"
          sx={{
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: 20, sm: 32, md: 38 },
            fontFamily: `'IBM Plex Sans Arabic', Arial, sans-serif`,
            letterSpacing: 1,
            textAlign: "center",
            mt: { xs: 3, sm: 6 },
            lineHeight: 1.2,
          }}
          gutterBottom
        >
          أهلاً بك في نظام تقارير مداجن القديراني
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: { xs: 2, sm: 4 },
            fontSize: { xs: 13, sm: 18 },
            textAlign: "center",
            lineHeight: 1.5,
            px: { xs: 1, sm: 0 },
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
            minHeight: { xs: 180, sm: 400 },
            mb: { xs: 2, sm: 4 },
            position: "relative",
            px: { xs: 0.5, sm: 0 },
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: { xs: 2, md: 30 },
              zIndex: 3,
              bgcolor: "#c62828",
              p: { xs: 0.5, sm: 1 },
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              '&:hover': { bgcolor: "rgba(161, 57, 57, 0.9)" },
            }}
            aria-label="السابق"
          >
            <ArrowBackIos sx={{ color: "#fff", fontSize: { xs: 18, sm: 22 } }} />
          </IconButton>
          <FarmImage
            src={images[current].src}
            alt={images[current].alt}
            sx={{
              maxWidth: { xs: "95vw", sm: 600 },
              maxHeight: { xs: 150, sm: 400 },
              minHeight: { xs: 120, sm: 300 },
              borderRadius: 3,
              boxShadow: 2,
              transition: "all 0.5s",
              objectFit: "cover",
              mx: { xs: 1, sm: 4 },
            }}
          />
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: { xs: 2, md: 30 },
              zIndex: 3,
              bgcolor: "#c62828",
              p: { xs: 0.5, sm: 1 },
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              '&:hover': { bgcolor: "rgba(161, 57, 57, 0.9)" },
            }}
            aria-label="التالي"
          >
            <ArrowForwardIos sx={{ color: "#fff", fontSize: { xs: 18, sm: 22 } }} />
          </IconButton>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: { xs: 1, sm: 2 },
            fontWeight: "bold",
            fontSize: { xs: 12.5, sm: 16 },
            textAlign: "center",
            px: { xs: 1, sm: 0 },
          }}
        >
          يمكنك التنقل بين الأقسام من القائمة العلوية للاطلاع على تقارير أو إضافة بيانات جديدة
        </Typography>
      </Container>
    </Box>
  );
}

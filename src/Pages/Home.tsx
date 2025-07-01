"use client";
import React from "react";
import { Box, Typography, Stack, Container } from "@mui/material";
import FarmImage from "../components/FarmImage";
import farmImg1 from "../assets/1.jpeg";
import farmImg2 from "../assets/2.jpg";
import farmImg3 from "../assets/3.jpg";
// import Footer from "../layouts/Footer";


// ===== الصفحة الرئيسية =====
export default function HomePage() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        bgcolor: "#fff",
      }}
    >
      {/* محتوى الصفحة */}
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          px: { xs: 0.5, sm: 2, md: 0 },
          mt: { xs: 1, sm: 4, md: 8 },
          pb: { xs: 1, sm: 2, md: 2 },
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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{
            mb: 4,
          }}
        >
          <FarmImage src={farmImg1} alt="مزرعة دواجن" />
          <FarmImage src={farmImg2} alt="مزرعة دواجن" />
          <FarmImage src={farmImg3} alt="مزرعة دواجن" />
        </Stack>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 2,
            fontWeight: 500,
            fontSize: { xs: 14, sm: 16 },
            textAlign: "center",
          }}
        >
          يمكنك التنقل بين الأقسام من القائمة العلوية للاطلاع على تقارير أو
          إضافة بيانات جديدة
        </Typography>
      </Container>
      <style>
        {`
         body {
          overflow-y:hidden;
          }
        `}
      </style>
    </Box>
  );
}

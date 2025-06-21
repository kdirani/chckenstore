"use client";
import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Stack, Container } from "@mui/material";
import FarmImage from "../components/FarmImage";
import farmImg1 from "../assets/1.jpeg";
import farmImg2 from "../assets/2.jpg";
import farmImg3 from "../assets/3.jpg";
import Footer from "../layouts/Footer";
import { motion, AnimatePresence } from "framer-motion";

// ===== خلفية الأنيميشن فقط كخلفية مطلقة =====
const BackgroundBeamsWithCollision = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7 },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2 },
    { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2 },
    { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2 },
  ];

  return (
    <Box
      ref={parentRef}
      sx={{
        position: "absolute",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        background: (theme) =>
          `linear-gradient(to bottom, ${theme.palette.background.default}, ${theme.palette.grey[100]})`,
        overflow: "hidden",
      }}
    >
      {beams.map((beam, i) => (
        <CollisionMechanism
          key={`beam-${i}`}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      <Box
        ref={containerRef}
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          pointerEvents: "none",
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      />
    </Box>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement | null>;
    parentRef: React.RefObject<HTMLDivElement | null>;
    beamOptions?: {
      initialX?: number;
      x?: number;
      initialY?: number;
      y?: number;
      rotate?: number;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState({
    detected: false,
    coordinates: null as { x: number; y: number } | null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);
    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected]);

  useEffect(() => {
    if (collision.detected) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);
      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          y: beamOptions.initialY || "-200px",
          x: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
        }}
        variants={{
          animate: {
            y: beamOptions.y || "1800px",
            x: beamOptions.x || "0px",
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        style={{
          position: "absolute",
          top: "80px",
          left: 0,
          margin: "auto",
          height: "56px",
          width: "1px",
          borderRadius: "999px",
          background: "linear-gradient(to top, #c62828, #c62828, transparent)",
        }}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
              position: "absolute",
              zIndex: 50,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: "calc(50% - 40px)",
          height: "8px",
          width: "80px",
          borderRadius: "8px",
          background: "linear-gradient(to right, transparent, #c62828, transparent)",
          filter: "blur(4px)",
        }}
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            height: "4px",
            width: "4px",
            borderRadius: "999px",
            background: "linear-gradient(to bottom, #c62828, #c62828)",
          }}
        />
      ))}
    </div>
  );
};

// ===== الصفحة الرئيسية =====
export default function HomePage() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" ,bgcolor: "#fff"}}>
      {/* الخلفية المتحركة */}
      <BackgroundBeamsWithCollision />

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
          يمكنك التنقل بين الأقسام من القائمة العلوية للاطلاع على تقارير أو إضافة بيانات جديدة
        </Typography>
      </Container>
      <Footer />
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

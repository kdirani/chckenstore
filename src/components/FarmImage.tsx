import React from "react";
import { Box } from "@mui/material";

type FarmImageProps = {
  src: string;
  alt: string;
  sx?: object;
};

const FarmImage: React.FC<FarmImageProps> = ({ src, alt, sx }) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={sx}
    />
  );
};

export default FarmImage;

import React from 'react';

type FarmImageProps = {
  src: string;
  alt: string;
};

const FarmImage: React.FC<FarmImageProps> = ({ src, alt }) => {
  return <img src={src} alt={alt} className="farm-img" />;
};

export default FarmImage;

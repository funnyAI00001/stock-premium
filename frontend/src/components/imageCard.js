import React, { useEffect, useState } from "react";
import { Card, CardMedia, Typography } from "@mui/material";

const ImageCard = ({ image_Url, title, style }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [image_Url]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card sx={style}>
      <CardMedia
        component="img"
        src={
          imageError ? "/images/players/Picture_Not_Available.jpg" : image_Url
        }
        onError={handleImageError}
        alt={title}
      />
      <div style={{ padding: 10 }}>
        <Typography variant="body2" color="text.primary">
          {title}
        </Typography>
      </div>
    </Card>
  );
};

export default ImageCard;

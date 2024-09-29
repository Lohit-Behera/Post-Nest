import { useState } from "react";
import ImageLoader from "./Loader/ImageLoader/ImageLoader";
import ErrorImage from "../assets/image not found.svg";
function CustomImage({
  className,
  src,
  alt,
  onClick,
  maxHight = "max-h-auto",
  absolute = false,
  hover = false,
}: {
  className: string;
  src: string;
  alt: string;
  onClick?: () => void;
  maxHight?: string;
  absolute?: boolean;
  hover?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imagesStyle = {
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
  };

  const imageLoaded = () => {
    setLoaded(true);
  };

  return (
    <div
      className={`${className} ${
        absolute ? "absolute" : "relative"
      } flex justify-center mx-auto rounded-lg min-h-56 ${
        hover &&
        "duration-200 hover:drop-shadow-[0_0px_12px_rgba(250,204,21,0.7)] ease-in-out"
      }`}
      onClick={onClick}
    >
      <div
        className="absolute inset-0 w-full h-full min-h-40 flex items-center justify-center bg-background rounded-lg"
        style={{
          opacity: loaded ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <ImageLoader />
      </div>
      <img
        className={`w-full ${maxHight} object-cover rounded-lg hover:scale-103 ${
          hover && "hover:scale-103"
        }`}
        src={error ? ErrorImage : src}
        alt={alt}
        style={imagesStyle}
        onLoad={imageLoaded}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}

export default CustomImage;

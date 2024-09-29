import "./ImageLoader.css";

function ImageLoader() {
  return (
    <div className="w-full min-h-56 flex justify-center items-center rounded-lg drop-shadow-[0_0px_20px_rgba(176,144,16,0.80)] dark:drop-shadow-[0_0px_20px_rgba(250,204,21,0.80)]">
      <div className="banter-loader">
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
        <div className="banter-loader__box"></div>
      </div>
    </div>
  );
}

export default ImageLoader;

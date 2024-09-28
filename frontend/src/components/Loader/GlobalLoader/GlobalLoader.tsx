import "./GlobalLoader.css";

function GlobalLoader({ fullHight = false }: { fullHight?: boolean }) {
  return (
    <div
      className={`my-6 w-full ${
        fullHight ? "min-h-[80vh]" : "min-h-96"
      } flex justify-center items-center`}
    >
      <div className="loader">
        <div className="box">
          <div className="logo">
            <svg
              id="Layer_4"
              data-name="Layer 4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 667.59 667.59"
              className="svg"
            >
              <g>
                <g id="_Radial_Repeat_" data-name="&lt;Radial Repeat&gt;">
                  <circle cx="333.78" cy="583.09" r="84.5" />
                </g>
                <g id="_Radial_Repeat_-2" data-name="&lt;Radial Repeat&gt;">
                  <circle cx="84.5" cy="333.78" r="84.5" />
                </g>
                <g id="_Radial_Repeat_-3" data-name="&lt;Radial Repeat&gt;">
                  <circle cx="333.8" cy="84.5" r="84.5" />
                </g>
                <g id="_Radial_Repeat_-4" data-name="&lt;Radial Repeat&gt;">
                  <circle cx="583.09" cy="333.8" r="84.5" />
                </g>
              </g>
              <rect x="150.79" y="323.79" width="366" height="20" />
              <rect
                x="150.79"
                y="313.79"
                width="366"
                height="20"
                transform="translate(657.59 -10) rotate(90)"
              />
              <path d="m82.59,326.79s228.81,389,502.4,0c0,0-246.4,258-502.4,0Z" />
              <path d="m584.99,340.99s-228.81-389-502.4,0c0,0,228.54-250.2,502.4,0Z" />
            </svg>
          </div>
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  );
}

export default GlobalLoader;

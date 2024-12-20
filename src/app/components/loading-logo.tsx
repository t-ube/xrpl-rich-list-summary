import React, { useEffect, useRef } from 'react';

const LoadingLogo = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      const paths = Array.from(svg.querySelectorAll('path'));
      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-[550px]">
      <svg
        ref={svgRef}
        enableBackground="new 0 0 2499.1 698"
        viewBox="0 0 2499.1 698"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 h-48"
      >
        <defs>
          <style type="text/css">
            {`
              @keyframes drawLogoPath {
                0% {
                  stroke-dashoffset: var(--path-length);
                  fill: transparent;
                }
                70% {
                  stroke-dashoffset: 0;
                  fill: transparent;
                }
                100% {
                  stroke-dashoffset: 0;
                  fill: #23292f;
                }
              }
            `}
          </style>
        </defs>
        <g>
          <path
            d="m704.1 0h119.3l-248.3 251c-89.9 90.9-235.5 90.9-325.4 0l-248.2-251h119.3l188.6 190.7c56 56.9 147.6 57.6 204.5 1.6.5-.5 1.1-1.1 1.6-1.6zm-584.8 698h-119.3l249.8-252.6c89.9-90.9 235.5-90.9 325.4 0l249.7 252.6h-119.3l-190.1-192.2c-56-56.9-147.6-57.6-204.5-1.6-.5.5-1.1 1.1-1.6 1.6z"
            style={{
              stroke: '#23292f',
              strokeWidth: 2,
              fill: 'transparent',
              animation: 'drawLogoPath 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite'
            }}
          />
          <path
            d="m2276.7 0h.1c30.5.6 59.1 6.6 85.7 18 27.1 10.7 50.9 25.6 71.2 44.6 20.5 19.1 36.5 41.6 48 67.4 11.6 25.4 17.4 52.3 17.4 80.7 0 29-6.1 56.6-18.4 82.6-11.5 25.3-27.9 47.7-48.9 67.3-20.4 19-44.6 34.2-72.2 45.5h-.1c-27.3 10.8-56.6 16.2-87.8 16.2h-260.4v273.3h-91.6v-695.6zm-5 338c18.4 0 35.8-3.3 52.3-9.9 16.7-6.6 31.2-15.7 43.6-27.3 12.4-11.5 22.3-25.2 29.3-40.6 7.1-15.3 10.6-31.8 10.6-49.5 0-17.1-3.5-33.3-10.6-48.6-7-15.3-17-29.1-29.3-40.6-12.4-11.6-26.9-20.6-43.6-27.3-16.5-6.6-33.9-9.9-52.3-9.9h-260.4v253.7z"
            style={{
              stroke: '#23292f',
              strokeWidth: 2,
              fill: 'transparent',
              animation: 'drawLogoPath 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite'
            }}
          />
          <path
            d="m1254.2 423.8c45.9 0 89.4 19.4 118.2 52.8l189.2 219.1h117.8l-258.8-303.7c-28.8-33.8-72.5-53.5-118.8-53.5h-179.3v-253.1h260.4c18.4 0 35.8 3.3 52.3 9.9 16.7 6.7 31.2 15.8 43.6 27.3l.2.2c12.3 10.9 22 24 29.1 39.5 7.1 15.3 10.6 31.8 10.6 49.6 0 17.7-3.6 34.2-10.6 49.5-4.3 8.9-9.5 17.3-15.7 25l59.6 66.5c.7-.8 1.5-1.6 2.2-2.4 17.6-19 31.2-40.1 40.7-63.5 10.2-23.6 15.3-48.7 15.3-75.2 0-28.4-5.8-55.4-17.4-80.8-11.5-25.9-27.5-48.4-48-67.5-20.4-19-44.1-34.1-71.1-45.5-26.7-11.4-55.3-17.4-85.9-18h-311.3c-12.6 0-23.6 4.7-32.6 13.2-8.7 8.1-13.2 18.1-13.2 29.5v652.9h91.6v-271.8z"
            style={{
              stroke: '#23292f',
              strokeWidth: 2,
              fill: 'transparent',
              animation: 'drawLogoPath 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite'
            }}
          />
        </g>
      </svg>
    </div>
  );
};

export default LoadingLogo;
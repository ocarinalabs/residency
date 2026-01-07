import type { SVGProps } from "react";

export function InfoCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Info"
      fill="none"
      height={26}
      role="img"
      viewBox="0 0 26 26"
      width={26}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Info</title>
      <g clipPath="url(#clip0_1021_7)" fill="currentColor">
        <path d="M12.715 25.44c7.021 0 12.724-5.694 12.724-12.715C25.44 5.703 19.736 0 12.715 0 5.693 0 0 5.703 0 12.725c0 7.021 5.693 12.714 12.715 12.714zm0-1.817A10.89 10.89 0 011.816 12.725 10.89 10.89 0 0112.715 1.826a10.89 10.89 0 0110.898 10.899 10.89 10.89 0 01-10.898 10.898z" />
        <path d="M12.695 14.99c.528 0 .84-.312.85-.888l.156-6.71c.01-.566-.43-.986-1.016-.986-.595 0-1.005.41-.995.977l.146 6.719c.01.566.322.888.86.888zm0 3.975c.674 0 1.24-.537 1.24-1.201 0-.674-.556-1.201-1.24-1.201-.674 0-1.23.537-1.23 1.2 0 .655.566 1.202 1.23 1.202z" />
      </g>
      <defs>
        <clipPath id="clip0_1021_7">
          <path d="M0 0H25.8008V25.459H0z" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

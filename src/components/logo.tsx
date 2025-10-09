import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"
      />
      <path
        fill="currentColor"
        d="m173.52 83-56 56-28.48-28.49a12 12 0 1 0-17 17l36.95 36.95a12 12 0 0 0 17 0l64.48-64.48a12 12 0 1 0-17-17Z"
      />
    </svg>
  );
}

"use client";

type Props = {
  size?: number;
  animated?: boolean;
};

export default function L4Logo({ size = 96, animated = true }: Props) {
  return (
    <div
      className={`
        inline-flex items-center justify-center
        ${animated ? "animate-logo-in" : ""}
        group
      `}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className="
          block
          transition-transform duration-300
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-[1.04]
          group-hover:brightness-110
        "
        aria-hidden
      >
        {/* Outer rings */}
        <ellipse cx="256" cy="256" rx="230" ry="165" fill="#D50000" />
        <ellipse cx="256" cy="256" rx="200" ry="135" fill="#FFFFFF" />
        <ellipse cx="256" cy="256" rx="180" ry="115" fill="#D50000" />

        {/* L4 mark */}
        <path
          d="M170 175h60v120h80v50H170V175zm190 0h50v80h40v50h-40v40h-50V175z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

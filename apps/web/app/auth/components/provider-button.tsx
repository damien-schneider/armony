"use client";

import { Button } from "@workspace/ui/components/button";
import type { JSX, ReactNode } from "react";
import { useId } from "react";
import { signInWithOAuth } from "@/app/auth/actions";

const OAuthButton = ({
  provider,
  children,
}: {
  provider: "google" | "notion";
  children?: ReactNode;
}) => {
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
  const uniqueClipPathId = useId();
  const icon: Record<"google" | "notion", JSX.Element> = {
    google: (
      <svg
        fill="none"
        height="24"
        viewBox="0 0 25 24"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Google icon</title>
        <g clipPath={`url(#${uniqueClipPathId})`}>
          <path
            d="M24.2663 12.2763C24.2663 11.4605 24.2001 10.6404 24.059 9.83789H12.7402V14.4589H19.222C18.953 15.9492 18.0888 17.2676 16.8233 18.1054V21.1037H20.6903C22.9611 19.0137 24.2663 15.9272 24.2663 12.2763Z"
            fill="#4285F4"
          />
          <path
            d="M12.7391 24.0013C15.9756 24.0013 18.705 22.9387 20.6936 21.1044L16.8266 18.106C15.7507 18.838 14.3618 19.2525 12.7435 19.2525C9.61291 19.2525 6.95849 17.1404 6.00607 14.3008H2.01562V17.3917C4.05274 21.4439 8.20192 24.0013 12.7391 24.0013Z"
            fill="#34A853"
          />
          <path
            d="M6.00277 14.3007C5.50011 12.8103 5.50011 11.1965 6.00277 9.70618V6.61523H2.01674C0.314734 10.006 0.314734 14.0009 2.01674 17.3916L6.00277 14.3007Z"
            fill="#FBBC04"
          />
          <path
            d="M12.7391 4.74966C14.4499 4.7232 16.1034 5.36697 17.3425 6.54867L20.7685 3.12262C18.5991 1.0855 15.7198 -0.034466 12.7391 0.000808666C8.20192 0.000808666 4.05274 2.55822 2.01562 6.61481L6.00166 9.70575C6.94967 6.86173 9.6085 4.74966 12.7391 4.74966Z"
            fill="#EA4335"
          />
        </g>
        <defs>
          <clipPath id={uniqueClipPathId}>
            <rect
              fill="white"
              height="24"
              transform="translate(0.5)"
              width="24"
            />
          </clipPath>
        </defs>
      </svg>
    ),
    notion: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <title>Notion</title>
        <path
          d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z"
          fill="#fff"
        />
        <path
          clipRule="evenodd"
          d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z"
          fill="#000"
          fillRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <Button className="w-full" onClick={() => signInWithOAuth(provider)}>
      {icon[provider]}
      {children ?? "Login with"} {providerName}
    </Button>
  );
};

export { OAuthButton };

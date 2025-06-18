import {
  providerDetailsList,
  type providersList,
} from "@/app/api/chat/lib/ai-models-client.lib";
import { LogoArmony } from "@/components/logo-armony";
import { IconAiProvider } from "@/lib/provider-icons";
import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties, ReactNode } from "react";
import "./homelogo-showcase.css";

export function LogoShowcase({ className }: { className?: string }) {
  const providerKeys = Object.keys(providerDetailsList) as Array<
    keyof typeof providerDetailsList
  >;
  const iconRadius = 220;

  return (
    <div
      className={cn(
        "relative w-full h-[596px] font-sans text-xs overflow-hidden",
        className,
      )}
    >
      {/* Concentric circles and center logo setup */}
      <Circle className="inset-shadow-accent/40 inset-shadow-sm size-[450px]" />
      <Circle className="inset-shadow-accent/60 inset-shadow-sm size-[350px]" />
      <Circle className="inset-shadow-accent/85 inset-shadow-sm size-[250px]" />
      <Circle className="inset-shadow-accent/100 inset-shadow-sm size-[150px]" />

      {/* Center logo container */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 z-[4]">
        {/* Radial gradients for the glow effect */}
        <RadialGradient
          className="left-[-94px] top-[-94px]"
          color="rgba(227,148,0,0.25)"
        />
        <RadialGradient
          className="right-[-94px] top-[-105px]"
          color="rgba(0,151,254,0.25)"
        />
        <RadialGradient
          className="bottom-[-72px] right-[-102px] top-[-16px]"
          color="rgba(0,173,9,0.25)"
        />
        <RadialGradient
          className="bottom-[-100px] left-0 right-[-88px]"
          color="rgba(243,71,255,0.25)"
        />
        <RadialGradient
          className="top-[-16px] right-[-19px] bottom-[-72px] left-[-69px]"
          color="rgba(153,102,255,0.25)"
        />
        <RadialGradient
          className="bottom-[-104px] left-[-110px]"
          color="rgba(255,71,71,0.25)"
        />
        <RadialGradient
          className="bottom-[-51px] left-[-100px] top-[-37px]"
          color="rgba(71,114,255,0.25)"
        />

        {/* Center logo */}
        <div className="relative w-full h-full backdrop-blur-md bg-background/50 z-20 shadow-lg rounded-3xl p-2">
          <div className="relative bg-background/50 rounded-2xl flex items-center size-full justify-center">
            <LogoArmony className="size-20 z-50" size="sm" />
          </div>
        </div>
      </div>

      {/* Rotating providers */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-50 centered-rotating">
        {providerKeys.map((provider, index) => {
          const angle = (index * 360) / providerKeys.length;
          const adjustedAngle = angle - 90; // <-- adjust start to be from top
          return (
            <div
              key={provider}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div
                style={{
                  transform: `rotate(${adjustedAngle}deg) translate(${iconRadius}px) rotate(${-adjustedAngle}deg)`,
                }}
              >
                <ProviderIcon
                  provider={provider}
                  className="centered-rotating-inversed"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Reusable components
const ProviderIcon = ({
  provider,
  className,
}: { provider: (typeof providersList)[number]; className?: string }) => (
  <div
    className={cn(
      "flex items-center justify-center aspect-square size-16 relative backdrop-blur-sm bg-accent/40 shadow-lg rounded-2xl p-0.5",
      className,
    )}
  >
    <div className="flex items-center justify-center bg-background size-14 relative overflow-hidden rounded-xl">
      <IconAiProvider
        provider={provider}
        width={24}
        height={24}
        className="text-[var(--provider-color-light)] dark:text-[var(--provider-color-dark)]"
        style={
          {
            "--provider-color-light": providerDetailsList[provider].color.light,
            "--provider-color-dark": providerDetailsList[provider].color.dark,
          } as CSSProperties
        }
      />
    </div>
  </div>
);

const RadialGradient = ({
  className,
  color,
}: {
  className: string;
  color: string;
}) => (
  <div
    className={`absolute w-[200px] h-[200px] z-1 bg-[radial-gradient(50%_50%_at_50%_50%,${color}_0%,rgba(227,148,0,0)_100%)] ${className}`}
  />
);

const Circle = ({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <div
    className={cn(
      "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
      className,
    )}
  >
    {children}
  </div>
);

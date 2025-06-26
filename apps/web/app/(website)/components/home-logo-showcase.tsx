import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties, ReactNode } from "react";
import {
  providerDetailsList,
  type providersList,
} from "@/app/api/chat/lib/ai-models-client.lib";
import { LogoArmony } from "@/components/logo-armony";
import { IconAiProvider } from "@/lib/provider-icons";
import "./homelogo-showcase.css";

export function LogoShowcase({ className }: { className?: string }) {
  const providerKeys = Object.keys(providerDetailsList) as Array<
    keyof typeof providerDetailsList
  >;
  const iconRadius = 220;

  return (
    <div
      className={cn(
        "relative h-[596px] w-full overflow-hidden font-sans text-xs",
        className,
      )}
    >
      {/* Concentric circles and center logo setup */}
      <Circle className="inset-shadow-accent/40 inset-shadow-sm size-[450px]" />
      <Circle className="inset-shadow-accent/60 inset-shadow-sm size-[350px]" />
      <Circle className="inset-shadow-accent/85 inset-shadow-sm size-[250px]" />
      <Circle className="inset-shadow-accent/100 inset-shadow-sm size-[150px]" />

      {/* Center logo container */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-[4] h-28 w-28">
        {/* Radial gradients for the glow effect */}
        <RadialGradient
          className="top-[-94px] left-[-94px]"
          color="rgba(227,148,0,0.25)"
        />
        <RadialGradient
          className="top-[-105px] right-[-94px]"
          color="rgba(0,151,254,0.25)"
        />
        <RadialGradient
          className="top-[-16px] right-[-102px] bottom-[-72px]"
          color="rgba(0,173,9,0.25)"
        />
        <RadialGradient
          className="right-[-88px] bottom-[-100px] left-0"
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
          className="top-[-37px] bottom-[-51px] left-[-100px]"
          color="rgba(71,114,255,0.25)"
        />

        {/* Center logo */}
        <div className="relative z-20 h-full w-full rounded-3xl bg-background/50 p-2 shadow-lg backdrop-blur-md">
          <div className="relative flex size-full items-center justify-center rounded-2xl bg-background/50">
            <LogoArmony className="z-50 size-20" size="sm" />
          </div>
        </div>
      </div>

      {/* Rotating providers */}
      <div className="-translate-x-1/2 -translate-y-1/2 centered-rotating absolute top-1/2 left-1/2 size-50">
        {providerKeys.map((provider, index) => {
          const angle = (index * 360) / providerKeys.length;
          const adjustedAngle = angle - 90; // <-- adjust start to be from top
          return (
            <div
              key={provider}
              className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"
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
}: {
  provider: (typeof providersList)[number];
  className?: string;
}) => (
  <div
    className={cn(
      "relative flex aspect-square size-16 items-center justify-center rounded-2xl bg-accent/40 p-0.5 shadow-lg backdrop-blur-sm",
      className,
    )}
  >
    <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-xl bg-background">
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
    className={`absolute z-1 h-[200px] w-[200px] bg-[radial-gradient(50%_50%_at_50%_50%,${color}_0%,rgba(227,148,0,0)_100%)] ${className}`}
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
      "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 rounded-full",
      className,
    )}
  >
    {children}
  </div>
);

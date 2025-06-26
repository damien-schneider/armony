"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { H1, P } from "@workspace/ui/components/typography";
import Link from "next/link";

export function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-52">
      {/* Background Video */}
      {/* Overlay for readability */}
      {/* Beta Badge */}
      <div className=" px-6 lg:px-8">
        {/* Hero Content */}
        <div className="mx-auto max-w-6xl">
          <Badge variant="amber">Beta</Badge>
          <H1>
            A Single Subscription.
            <br />
            Unlimited AI Power.
          </H1>
          <P variant="caption-lg" className="mt-2">
            Experience the most advanced AI models,
            <br /> Intuitive interfaces, and Customizable workflows
          </P>
          <div className="mt-8 flex gap-4">
            <Button asChild={true} size="lg">
              <Link href="/signup">Try it for free</Link>
            </Button>
            <Button asChild={true} variant="outline" size="lg">
              <Link href="/pricing">Check plans</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-screen-2xl">
          <video
            className="relative z-20 mt-10 aspect-auto w-full rounded-2xl border object-cover md:rounded-3xl"
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
          >
            <source src="/videos/showcase-video-armony.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video
            className="absolute top-0 left-0 z-10 mt-10 aspect-auto w-full scale-105 border object-cover opacity-30 blur-2xl"
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
          >
            <source src="/videos/showcase-video-armony.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

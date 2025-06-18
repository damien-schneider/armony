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
        <div className="max-w-6xl mx-auto">
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
        <div className="relative w-full mx-auto max-w-screen-2xl">
          <video
            className="w-full object-cover rounded-2xl md:rounded-3xl aspect-auto border mt-10 relative z-20"
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
          >
            <source src="/videos/showcase-video-armony.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video
            className="absolute w-full top-0 left-0 blur-2xl object-cover aspect-auto border mt-10 scale-105 z-10 opacity-30"
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

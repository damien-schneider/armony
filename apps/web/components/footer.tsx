import Link from "next/link";
import { LogoArmony } from "@/components/logo-armony";
import { envClient } from "@/env/client";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full border-border border-t pb-12">
      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Logo and description column */}
          <div className="space-y-6 md:col-span-2">
            <Link
              href={envClient.NEXT_PUBLIC_BASE_URL}
              className="inline-block"
            >
              <LogoArmony size="lg" />
            </Link>
            <p className="max-w-sm text-muted-foreground">
              Access the latest AI technologies instantly. Remove workflow
              friction and boost productivity with our innovative AI platform.
            </p>
            {/* <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild={true}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Twitter</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild={true}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>GitHub</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild={true}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <path d="M22.23 0h-20.46c-.983 0-1.77.787-1.77 1.77v20.46c0 .983.787 1.77 1.77 1.77h20.46c.983 0 1.77-.787 1.77-1.77v-20.46c0-.983-.787-1.77-1.77-1.77zm-9.93 17.66c-.828 0-1.63-.233-2.31-.675l-2.435 1.34.644-2.42c-.483-.7-.764-1.545-.764-2.455 0-2.408 1.97-4.365 4.365-4.365s4.365 1.957 4.365 4.365c0 2.408-1.97 4.365-4.365 4.365v.045h.046zm-2.995-6.5c-.13-.26-.26-.216-.372-.224h-.2c-.13 0-.34.048-.52.24-.18.192-.7.683-.7.683-.13.182-.026.404.09.643.124.24.698 1.1 1.59 1.536.825.404 1.01.446 1.19.372.18-.074.572-.683.728-.91.13-.24.13-.446.09-.488-.043-.047-.173-.112-.346-.195-.173-.087-1.02-.507-1.178-.562-.156-.06-.268-.087-.38.086-.11.172-.424.553-.52.67-.092.116-.186.132-.347.044-.173-.086-.72-.26-1.376-.843-.51-.452-.857-1.01-.96-1.18s-.01-.262.077-.345c.073-.095.2-.216.3-.324.098-.108.107-.194.156-.324.05-.13.025-.242-.013-.34-.037-.086-.372-.883-.51-1.21-.133-.334-.268-.287-.372-.293-.098-.004-.21-.004-.324-.004z" />
                      </svg>
                      <span className="sr-only">WhatsApp</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>WhatsApp</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild={true}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      <span className="sr-only">YouTube</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>YouTube</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-medium text-lg">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/chat"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li> */}
              <li>
                <Link
                  href="/changelog"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/feedbacks"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Feedbacks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-medium text-lg">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/signup"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/signin"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and links */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-border border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Armony. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/terms-of-use"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            {/* <Link
              href="/legal/cookies"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link> */}
            <Link
              href="mailto:damien.schneider01@gmail.com?subject=Contact%20from%20armony.ai"
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

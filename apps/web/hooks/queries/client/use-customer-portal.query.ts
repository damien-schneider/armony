import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { createStripePortal } from "@/utils/stripe/server";

export const useCustomerPortal = () => {
  const pathname = usePathname();
  return useQuery({
    queryKey: ["customer-portal"],
    queryFn: async () => {
      const portalUrl = await createStripePortal(pathname);
      return portalUrl;
    },
  });
};

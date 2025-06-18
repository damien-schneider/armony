import { envClient } from "@/env/client";
import type { Tables } from "@workspace/supabase/types/database";

type Price = Tables<"prices">;

// Define regex patterns at the top level for better performance
const TRAILING_SLASH_REGEX = /\/+$/;
const LEADING_SLASH_REGEX = /^\/+/;

export const getURL = (pathParam = "") => {
  let url = envClient.NEXT_PUBLIC_BASE_URL.trim();

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(TRAILING_SLASH_REGEX, "");
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  const cleanPath = pathParam.replace(LEADING_SLASH_REGEX, "");

  // Concatenate the URL and the path.
  return cleanPath ? `${url}/${cleanPath}` : url;
};

export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: { price: Price };
}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const toDateTime = (secs: number) => {
  const t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined,
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date(); // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000,
  ); // Add trial days
  return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ["status", "status_description"],
  error: ["error", "error_description"],
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription = "",
  disableButton = false,
  arbitraryParams = "",
): string => {
  const keys = toastKeyMap[toastType];
  if (!keys) {
    throw new Error(`Toast type "${toastType}" not supported`);
  }
  const [nameKey, descriptionKey] = keys;

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
  }

  if (disableButton) {
    redirectPath += "&disable_button=true";
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription = "",
  disableButton = false,
  arbitraryParams = "",
) =>
  getToastRedirect(
    path,
    "status",
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams,
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription = "",
  disableButton = false,
  arbitraryParams = "",
) =>
  getToastRedirect(
    path,
    "error",
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams,
  );

import { useSuspenseQuery } from "@tanstack/react-query";
import { publicDataQuery } from "@/lib/public-data.functions";
import { toPricingMap } from "@/lib/pricing";

export function usePublicData() {
  const { data } = useSuspenseQuery(publicDataQuery);
  return data;
}

export function useSettings() {
  return usePublicData().settings;
}

export function usePricing() {
  const data = usePublicData();
  return {
    services: data.services,
    pricing: toPricingMap(data.pricing),
    rows: data.pricing,
  };
}

import { describe, expect, it } from "vitest";
import { calculateEstimate } from "./pricing";

const pricing = {
  per_extra_bedroom: 20,
  per_extra_bathroom: 25,
  size_under_1000: 0,
  size_2000_2999: 60,
  freq_one_time: 0,
  freq_weekly: 20,
  freq_biweekly: 15,
  addon_fridge: 35,
  addon_oven: 35,
};

describe("calculateEstimate", () => {
  it("charges only the base price for 1 bed / 1 bath, small home, one-time", () => {
    const e = calculateEstimate(
      { basePrice: 120, bedrooms: 1, bathrooms: 1, homeSize: "size_under_1000" },
      pricing,
    );
    expect(e.total).toBe(120);
  });

  it("adds extra bedroom and bathroom charges after the first of each", () => {
    const e = calculateEstimate(
      { basePrice: 120, bedrooms: 3, bathrooms: 2, homeSize: "size_under_1000" },
      pricing,
    );
    // 120 + 2*20 + 1*25
    expect(e.total).toBe(185);
  });

  it("adds home size and add-on charges", () => {
    const e = calculateEstimate(
      {
        basePrice: 220,
        bedrooms: 1,
        bathrooms: 1,
        homeSize: "size_2000_2999",
        addons: ["addon_fridge", "addon_oven", "addon_fridge"],
      },
      pricing,
    );
    // 220 + 60 + 35 + 35 (duplicate add-on counted once)
    expect(e.total).toBe(350);
  });

  it("applies the weekly frequency discount to the subtotal", () => {
    const e = calculateEstimate(
      { basePrice: 200, bedrooms: 1, bathrooms: 1, homeSize: "size_under_1000", frequency: "freq_weekly" },
      pricing,
    );
    expect(e.discount).toBe(40);
    expect(e.total).toBe(160);
  });
});

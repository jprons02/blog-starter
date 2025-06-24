// This is the data driving the benefit eligibility logic for SNAP, WIC, and LIHEAP.

export type Benefit = {
  name: string;
  description: string;
  link: string;
};

export type FormData = {
  householdSize: number;
  income: string;
  situations: string[];
  payUtility: string;
};

const FPL: Record<number, number> = {
  1: 1450,
  2: 1956,
  3: 2460,
  4: 2966,
  5: 3472,
  6: 3978,
  7: 4484,
  8: 4990,
};

const incomeMap: Record<string, number> = {
  "<1000": 1000,
  "1000-1999": 1500,
  "2000-2999": 2500,
  "3000-3999": 3500,
  "4000-4999": 4500,
  "5000+": 5000,
};

export function getEligibilityResults(form: FormData): Benefit[] {
  const results: Benefit[] = [];

  const householdFPL = FPL[form.householdSize] || FPL[8];
  const incomeAmount = incomeMap[form.income];

  if (!incomeAmount || !form.householdSize) return results;

  const qualifiesForSNAP = incomeAmount <= householdFPL * 1.3;
  const qualifiesForWIC =
    (form.situations.includes("I am pregnant") ||
      form.situations.includes("I have children under 5")) &&
    incomeAmount <= householdFPL * 1.85;
  const qualifiesForLIHEAP =
    form.payUtility === "yes" && incomeAmount <= householdFPL * 1.5;

  if (qualifiesForSNAP) {
    results.push({
      name: "SNAP (Food Assistance)",
      description:
        "Your household income likely qualifies for SNAP benefits under federal guidelines.",
      link: "https://www.fns.usda.gov/snap",
    });
  }

  if (qualifiesForWIC) {
    results.push({
      name: "WIC (Nutrition for Women & Children)",
      description:
        "You may qualify for WIC based on your pregnancy or children under 5, and your income.",
      link: "https://www.fns.usda.gov/wic",
    });
  }

  if (qualifiesForLIHEAP) {
    results.push({
      name: "LIHEAP or Section 8 (Housing/Energy Help)",
      description:
        "Because you pay rent or utilities and reported a lower income, you may qualify for energy or housing assistance.",
      link: "https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap",
    });
  }

  return results;
}

import type { BenefitForm } from "@/lib/types/benefit";

export type Benefit = {
  name: string;
  description: string;
  link: string;
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

export function getEligibilityResults(form: BenefitForm): Benefit[] {
  const results: Benefit[] = [];

  const householdFPL = FPL[form.HSHLDSIZE] || FPL[8];
  const incomeAmount = incomeMap[form.INCOME];
  const isVeteran = form.FACTORS.includes("I am a veteran");
  const hasHonorableDischarge = form.FACTORS.includes(
    "My discharge was honorable or general"
  );
  const recentlySeparated = form.FACTORS.includes(
    "I separated from service within the last 5 years"
  );
  const servedInCombat = form.FACTORS.includes("I served in a combat zone");
  const hasDisability = form.FACTORS.includes("I have a disability");
  const isLowIncome = incomeAmount <= householdFPL * 1.5;
  const isHousingInsecure = form.PAYSUTILS === "yes";

  if (!incomeAmount || !form.HSHLDSIZE) return results;

  const qualifiesForSNAP = incomeAmount <= householdFPL * 1.3;
  const qualifiesForWIC =
    (form.FACTORS.includes("I am pregnant") ||
      form.FACTORS.includes("I have children under 5")) &&
    incomeAmount <= householdFPL * 1.85;
  const qualifiesForLIHEAP =
    form.PAYSUTILS === "yes" && incomeAmount <= householdFPL * 1.5;

  const qualifiesForVAHealthCare =
    isVeteran &&
    hasHonorableDischarge &&
    (hasDisability ||
      recentlySeparated ||
      servedInCombat ||
      incomeAmount <= householdFPL * 2);

  const qualifiesForVAHousing = isVeteran && hasHonorableDischarge;

  const qualifiesForVetCrisisAid =
    isVeteran && hasHonorableDischarge && isLowIncome && isHousingInsecure;

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

  if (qualifiesForVAHealthCare) {
    results.push({
      name: "VA Healthcare Eligibility",
      description:
        "You may qualify for free or low-cost VA healthcare based on your income, service-connected disability, or recent separation.",
      link: "https://www.va.gov/health-care/eligibility/",
    });
  }

  if (qualifiesForVAHousing) {
    results.push({
      name: "VA Housing Assistance",
      description:
        "Veterans may be eligible for VA-backed home loans, refinancing, or foreclosure prevention. A Certificate of Eligibility is required.",
      link: "https://www.va.gov/housing-assistance/",
    });
  }

  if (qualifiesForVetCrisisAid) {
    results.push({
      name: "Veteran Emergency Financial Aid",
      description:
        "As a low-income veteran paying rent or utilities, you may qualify for emergency help through SSVF or VFW grants.",
      link: "https://www.va.gov/homeless/ssvf/",
    });
  }

  return results;
}

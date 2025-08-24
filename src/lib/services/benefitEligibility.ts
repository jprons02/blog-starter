import type { BenefitForm } from "@/lib/types/benefit";
import { getMonthlyFPL } from "@/lib/api/getPovertyLevel";
import { benefitsFocusMap } from "@/lib/utils/benefitsFocusMap";

export type Benefit = {
  name: string;
  description: string;
  link: string;
};

const incomeMap: Record<string, number> = {
  "<1000": 1000,
  "1000-1999": 1500,
  "2000-2999": 2500,
  "3000-3999": 3500,
  "4000-4999": 4500,
  "5000+": 5000,
};

export async function getEligibilityResults(
  form: BenefitForm
): Promise<Benefit[]> {
  const results: Benefit[] = [];

  const householdFPL = await getMonthlyFPL(form.HSHLDSIZE, form.STATE, 2025);
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

  const qualifiesForCCDF = incomeAmount <= householdFPL * 1.85;
  const qualifiesForSNAP = incomeAmount <= householdFPL * 1.3;
  const qualifiesForWIC =
    (form.FACTORS.includes("I am pregnant") ||
      form.FACTORS.includes("I have children under 5")) &&
    incomeAmount <= householdFPL * 1.85;
  const qualifiesForLIHEAP =
    form.PAYSUTILS === "yes" && incomeAmount <= householdFPL * 1.5;

  const qualifiesForSSDI = hasDisability;
  const qualifiesForSSI = hasDisability && incomeAmount <= householdFPL * 1.1;

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

  const qualifiesForMedicaid =
    incomeAmount <= householdFPL * 1.38 || // general federal cutoff
    (hasDisability && incomeAmount <= householdFPL * 1.5) || // in many states
    form.FACTORS.includes("I am pregnant"); // automatic eligibility in many states

  if (qualifiesForSNAP) {
    results.push({
      name: benefitsFocusMap.snap.label,
      description:
        "Your household income likely qualifies for SNAP benefits under federal guidelines.",
      link: benefitsFocusMap.snap.apply,
    });
  }

  if (qualifiesForMedicaid) {
    results.push({
      name: benefitsFocusMap.medicaid.label,
      description:
        "Based on your income or health situation, you may qualify for free or low-cost Medicaid coverage.",
      link: benefitsFocusMap.medicaid.apply,
    });
  }

  if (qualifiesForCCDF) {
    results.push({
      name: benefitsFocusMap.childcare.label,
      description:
        "You may qualify for subsidized childcare through the Child Care and Development Fund (CCDF), depending on your income and work/school status.",
      link: benefitsFocusMap.childcare.apply,
    });
  }

  if (qualifiesForSSDI) {
    results.push({
      name: benefitsFocusMap.ssdi.label,
      description:
        "If you’ve worked and paid into Social Security and have a qualifying disability, you may be eligible for SSDI.",
      link: benefitsFocusMap.ssdi.apply,
    });
  }

  if (qualifiesForSSI) {
    results.push({
      name: benefitsFocusMap.ssi.label,
      description:
        "You may qualify for SSI based on your disability and limited income and resources.",
      link: benefitsFocusMap.ssi.apply,
    });
  }

  if (qualifiesForWIC) {
    results.push({
      name: benefitsFocusMap.wic.label,
      description:
        "You may qualify for WIC based on your pregnancy or children under 5, and your income.",
      link: benefitsFocusMap.wic.apply,
    });
  }

  if (qualifiesForLIHEAP) {
    results.push({
      name: benefitsFocusMap.housing.label,
      description:
        "Because you pay rent or utilities and reported a lower income, you may qualify for energy or housing assistance.",
      link: benefitsFocusMap.housing.apply,
    });
  }

  if (qualifiesForVAHealthCare) {
    results.push({
      name: benefitsFocusMap.vaHealthcare.label,
      description:
        "You may qualify for free or low-cost VA healthcare based on your income, service-connected disability, or recent separation.",
      link: benefitsFocusMap.vaHealthcare.apply,
    });
  }

  if (qualifiesForVAHousing) {
    results.push({
      name: benefitsFocusMap.vaHousing.label,
      description:
        "Veterans may be eligible for VA-backed home loans, refinancing, or foreclosure prevention. A Certificate of Eligibility is required.",
      link: benefitsFocusMap.vaHousing.apply,
    });
  }

  if (qualifiesForVetCrisisAid) {
    results.push({
      name: benefitsFocusMap.vaAid.label,
      description:
        "As a low-income veteran paying rent or utilities, you may qualify for emergency help through SSVF or VFW grants.",
      link: benefitsFocusMap.vaAid.apply,
    });
  }
  return results;
}

export function getIncomeThresholdFor(
  program: string,
  size: number
): number | null {
  // Match these keys to your `benefitsFocusMap` slugs
  const base: Record<string, number> = {
    childcare: 44000,
    snap: 18000,
    wic: 21000,
    safelink: 20000,
    housing: 22000,
    ssi: 12000,
    vaHealthcare: 40000,
    vaAid: 25000,
  };

  const perPerson: Record<string, number> = {
    childcare: 7000,
    snap: 5000,
    wic: 4500,
    safelink: 4000,
    housing: 6000,
    ssi: 4000,
    vaHealthcare: 6000,
    vaAid: 5000,
  };

  if (!(program in base) || size < 1) return null;

  return base[program] + (size - 1) * perPerson[program];
}

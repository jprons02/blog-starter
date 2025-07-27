// /lib/benefitsFocusMap.ts

export const benefitsFocusMap = {
  freePhone: {
    label: 'Free Government Phone Plan',
    learnMore: 'https://www.affordableconnectivity.gov/do-i-qualify/',
    apply:
      'https://www.safelinkwireless.com/en/#!/newHome?promocode=LCP0001854',
    qualifyTips: [
      'Have household income below 135% of the federal poverty level',
      'Receive SNAP, Medicaid, SSI, or other qualifying benefits',
      'Have a child in a free/reduced lunch program',
    ],
  },
  childcare: {
    label: 'Childcare Assistance (CCDF)',
    learnMore: 'https://www.acf.hhs.gov/occ/ccdf-fundamentals',
    apply: 'https://www.childcare.gov/state-resources',
    qualifyTips: [
      'Meet income eligibility limits based on household size',
      'Be working, in school, or in a job training program',
      'Have a child under age 13 (or with special needs under 19)',
    ],
  },
  snap: {
    label: 'SNAP (Food Stamps)',
    learnMore: 'https://www.fns.usda.gov/snap/recipient/eligibility',
    apply: 'https://www.fns.usda.gov/snap/state-directory',
    qualifyTips: [
      'Meet gross and net income tests based on household size',
      'Be a U.S. citizen or lawful permanent resident',
      'Show limited assets and resources',
    ],
  },
  medicaid: {
    label: 'Medicaid Health Coverage',
    learnMore: 'https://www.medicaid.gov/medicaid/eligibility-policy',
    apply:
      'https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip',
    qualifyTips: [
      'Have a low income based on your household size and state limits',
      'Be a U.S. citizen or eligible non-citizen',
      'Be pregnant, under 19, over 65, or have a disability (varies by state)',
    ],
  },
  wic: {
    label: 'WIC Program',
    learnMore: 'https://www.fns.usda.gov/wic/wic-how-apply',
    apply: 'https://www.fns.usda.gov/wic/applicant-participant/apply',
    qualifyTips: [
      'Be pregnant, postpartum, or have a child under 5',
      'Meet income eligibility guidelines',
      'Live in the state where you apply',
    ],
  },
  housing: {
    label: 'LIHEAP or Section 8 (Housing/Energy Help)',
    learnMore:
      'https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap',
    apply: 'https://liheapch.acf.gov/snapshots.htm',
    qualifyTips: [
      'Meet income limits for your household size',
      'Pay rent or utility bills',
      'Have a disconnection notice or difficulty paying energy bills',
    ],
  },
  ssdi: {
    label: 'SSDI (Disability Benefits)',
    learnMore: 'https://www.ssa.gov/disability',
    apply: 'https://www.ssa.gov/apply?benefits=disability&age=adult',
    qualifyTips: [
      'Have a qualifying physical or mental disability expected to last 12 months or more',
      'Have worked long enough and paid into Social Security through payroll taxes',
      'Be unable to work substantial gainful activity due to your condition',
    ],
  },
  ssi: {
    label: 'SSI (Supplemental Security Income)',
    learnMore: 'https://www.ssa.gov/ssi/',
    apply: 'https://www.ssa.gov/apply/ssi',
    qualifyTips: [
      'Be age 65 or older, blind, or disabled',
      'Have very limited income and financial resources',
      'Be a U.S. citizen or eligible non-citizen',
    ],
  },
  vaHousing: {
    label: 'VA Housing Assistance',
    learnMore: 'https://www.va.gov/housing-assistance/',
    apply:
      'https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/',
    qualifyTips: [
      'Be a veteran with an honorable or general discharge',
      'Meet VA home loan program requirements',
      'Provide your Certificate of Eligibility (COE)',
    ],
  },
  vaHealthcare: {
    label: 'VA Healthcare Eligibility',
    learnMore: 'https://www.va.gov/health-care/eligibility/',
    apply: 'https://www.va.gov/health-care/how-to-apply/',
    qualifyTips: [
      'Be a veteran with an honorable or general discharge',
      'Have a service-connected disability, combat experience, or be recently separated',
      'Meet income eligibility guidelines for VA care',
    ],
  },
  vaAid: {
    label: 'Veteran Emergency Financial Aid',
    learnMore: 'https://www.va.gov/homeless/ssvf/',
    apply: 'https://www.va.gov/pension/aid-attendance-housebound/',
    qualifyTips: [
      'Be a low-income veteran with an honorable discharge',
      'Pay rent or utility bills',
      'Be at risk of homelessness or in financial crisis',
    ],
  },
};

export type FocusSlug = keyof typeof benefitsFocusMap;

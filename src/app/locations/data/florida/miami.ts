// src/data/locations/fl/miami.ts
// Location data module for Miami, FL.
// Powers <ResourceLink name="..." field="..."> inside MDX.
// Notes:
// - Use <City/> and <State/> tokens inside FAQ HTML. They are replaced at render time.
// - Keep links official (.gov > .edu > reputable .org). Use provider .com only when appropriate (e.g., Lifeline).
// - If a field is unknown, leave it as "" (never null/undefined).

export const localResources = {
  /* ------------------------------ SNAP ------------------------------ */
  snap: {
    link: "https://myaccess.myflfamilies.com/Help/ABTIP/ABTIP-1.html", // How to apply (ACCESS Florida)
    contact:
      "https://www.myflfamilies.com/about-us/accessible-customer-service/access-florida-customer-service",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>How do I apply for SNAP in <City/>, <State/>?</strong><br/>` +
          `Start at Florida’s ACCESS portal: <a href="https://myaccess.myflfamilies.com/Help/ABTIP/ABTIP-1.html" target="_blank" rel="noopener noreferrer">How to Apply</a>. You can submit online, by mail, or at a local service center.</p>`,
      },
      {
        html:
          `<p><strong>Is there a local office near <City/> for in-person help?</strong><br/>` +
          `Yes. See office options and assistance lines on <a href="https://www.myflfamilies.com/about-us/accessible-customer-service/access-florida-customer-service" target="_blank" rel="noopener noreferrer">ACCESS Florida Customer Service</a>.</p>`,
      },
      {
        html:
          `<p><strong>Do I need an interview?</strong><br/>` +
          `Most cases require a brief interview, often by phone. Answer calls and check your ACCESS account messages to avoid delays.</p>`,
      },
    ],
  },

  /* ------------------------ UNEMPLOYMENT (UI) ------------------------ */
  unemployment: {
    link: "https://www.floridajobs.org/Reemployment-Assistance-Service-Center/reemployment-assistance/claimants/apply-for-benefits",
    contact:
      "https://www.floridajobs.org/Reemployment-Assistance-Service-Center/reemployment-assistance/claimants",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Where do I start a UI claim in <State/>?</strong><br/>` +
          `Use Florida’s RA page: <a href="https://www.floridajobs.org/Reemployment-Assistance-Service-Center/reemployment-assistance/claimants/apply-for-benefits" target="_blank" rel="noopener noreferrer">Apply for Benefits</a>. Create an account and follow the prompts.</p>`,
      },
      {
        html:
          `<p><strong>How do weekly certifications work?</strong><br/>` +
          `Certify each benefit week through the RA portal. Missing weeks can pause payments; set reminders to file on time.</p>`,
      },
      {
        html:
          `<p><strong>Who can help if my claim gets stuck?</strong><br/>` +
          `Check the claimant help hub at <a href="https://www.floridajobs.org/Reemployment-Assistance-Service-Center/reemployment-assistance/claimants" target="_blank" rel="noopener noreferrer">RA Claimants</a> for phone lines, guides, and common issue fixes.</p>`,
      },
    ],
  },

  /* ------------------------------ WIC ------------------------------ */
  wic: {
    link: "https://miamidade.floridahealth.gov/programs-and-services/clinical-and-nutrition-services/wic/index.html",
    contact: "https://miamidade.floridahealth.gov/locations/index.html",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>How do I get WIC in <City/>, <State/>?</strong><br/>` +
          `Start with the county WIC page: <a href="https://miamidade.floridahealth.gov/programs-and-services/clinical-and-nutrition-services/wic/index.html" target="_blank" rel="noopener noreferrer">Miami-Dade WIC</a>. Call to schedule eligibility screening.</p>`,
      },
      {
        html:
          `<p><strong>Where are WIC clinics near me?</strong><br/>` +
          `See locations on the county site: <a href="https://miamidade.floridahealth.gov/locations/index.html" target="_blank" rel="noopener noreferrer">Miami-Dade DOH Locations</a>.</p>`,
      },
      {
        html:
          `<p><strong>Can I get WIC while on SNAP or Medicaid?</strong><br/>` +
          `Yes—these programs are separate. Many families in <City/> qualify for more than one based on income and household size.</p>`,
      },
    ],
  },

  /* ------------------------------ LIHEAP (utilities) ------------------------------ */
  liheap: {
    link: "https://www.miamidade.gov/global/service.page?Mduid_service=ser1601486570634647", // Utility Assistance (LIHEAP)
    contact: "https://www.miamidade.gov/global/cahsd/home.page",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Who runs LIHEAP in <City/>, <State/>?</strong><br/>` +
          `Miami-Dade’s Community Action and Human Services Department (CAHSD). See <a href="https://www.miamidade.gov/global/service.page?Mduid_service=ser1601486570634647" target="_blank" rel="noopener noreferrer">Utility Assistance</a> for how to apply.</p>`,
      },
      {
        html:
          `<p><strong>Can LIHEAP help with a shutoff notice?</strong><br/>` +
          `Often yes. Bring your notice and ID when applying. Start with CAHSD’s <a href="https://www.miamidade.gov/global/cahsd/home.page" target="_blank" rel="noopener noreferrer">program hub</a>.</p>`,
      },
      {
        html:
          `<p><strong>How frequently can I receive help?</strong><br/>` +
          `Rules vary by funding and need. Ask CAHSD staff about seasonal limits and emergency options.</p>`,
      },
    ],
  },

  /* ------------------------------ Medicaid ------------------------------ */
  medicaid: {
    link: "https://myaccess.myflfamilies.com/Help/ABTIP/ABTIP-1.html",
    contact: "https://ahca.myflorida.com/medicaid/index.shtml",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>How do I apply for Medicaid in <City/>, <State/>?</strong><br/>` +
          `Eligibility is handled through ACCESS: <a href="https://myaccess.myflfamilies.com/Help/ABTIP/ABTIP-1.html" target="_blank" rel="noopener noreferrer">How to Apply</a>. Coverage is administered by AHCA.</p>`,
      },
      {
        html:
          `<p><strong>Where can I find Medicaid plan information?</strong><br/>` +
          `Visit AHCA’s Medicaid portal: <a href="https://ahca.myflorida.com/medicaid/index.shtml" target="_blank" rel="noopener noreferrer">AHCA Medicaid</a> for member resources.</p>`,
      },
      {
        html:
          `<p><strong>Do adults get dental or vision?</strong><br/>` +
          `Benefits vary by plan and category. Review your plan’s handbook and AHCA’s benefits pages for specifics.</p>`,
      },
    ],
  },

  /* ------------------------------ Child Care (CCDF) ------------------------------ */
  ccdf: {
    link: "https://familyservices.floridaearlylearning.com/Account/LogIn",
    contact: "https://www.elcmdm.org/contact-us",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>What is the School Readiness program in <City/>, <State/>?</strong><br/>` +
          `It helps eligible families pay for child care. Apply via the <a href="https://familyservices.floridaearlylearning.com/Account/LogIn" target="_blank" rel="noopener noreferrer">Family Portal</a>.</p>`,
      },
      {
        html:
          `<p><strong>Who provides local support?</strong><br/>` +
          `The Early Learning Coalition of Miami-Dade/Monroe: <a href="https://www.elcmdm.org/contact-us" target="_blank" rel="noopener noreferrer">contact</a> for help with documents and waitlist questions.</p>`,
      },
      {
        html:
          `<p><strong>Do I need a provider before applying?</strong><br/>` +
          `No. You can apply first, then choose an approved provider that accepts School Readiness funding.</p>`,
      },
    ],
  },

  /* ------------------------------ SafeLink / Lifeline ------------------------------ */
  safelink: {
    link: "https://www.safelinkwireless.com/",
    contact: "https://www.lifelinesupport.org/",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Can I get a free phone in <City/> with Lifeline?</strong><br/>` +
          `If you’re on SNAP or Medicaid, you may qualify. Start at <a href="https://www.safelinkwireless.com/" target="_blank" rel="noopener noreferrer">SafeLink</a> or learn about eligibility on <a href="https://www.lifelinesupport.org/" target="_blank" rel="noopener noreferrer">Lifeline Support</a>.</p>`,
      },
      {
        html:
          `<p><strong>What documents should I have ready?</strong><br/>` +
          `Proof of identity, address, and program participation (like SNAP or Medicaid) speeds up approval.</p>`,
      },
      {
        html:
          `<p><strong>Does Lifeline work with ACP?</strong><br/>` +
          `ACP ended in 2024; check provider sites for any replacement discounts available in <City/>.</p>`,
      },
    ],
  },

  /* ------------------------------ Housing (local PHA) ------------------------------ */
  housing: {
    link: "https://www.miamigov.com/Residents/Housing",
    contact: "https://www.miamidade.gov/global/housing/section-8.page",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Where do I find housing programs in <City/>, <State/>?</strong><br/>` +
          `Start at the City’s housing page: <a href="https://www.miamigov.com/Residents/Housing" target="_blank" rel="noopener noreferrer">Miami Housing</a>. Section 8 is administered countywide by Miami-Dade PHCD.</p>`,
      },
      {
        html:
          `<p><strong>Is the Section 8 waitlist open?</strong><br/>` +
          `Check Miami-Dade’s HCV page for status: <a href="https://www.miamidade.gov/global/housing/section-8.page" target="_blank" rel="noopener noreferrer">Section 8 (HCV)</a>.</p>`,
      },
      {
        html:
          `<p><strong>Can I get help with security deposits?</strong><br/>` +
          `Ask local nonprofits or PHCD about one-time assistance programs available in <City/>.</p>`,
      },
    ],
  },

  /* ------------------------------ Social Security DDS ------------------------------ */
  dds: {
    link: "https://www.ssa.gov/onlineservices/",
    contact: "https://www.ssa.gov/locator/",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Who reviews disability medical evidence in <State/>?</strong><br/>` +
          `Florida’s Disability Determination Services (DDS) works with SSA. File and track your claim via <a href="https://www.ssa.gov/onlineservices/" target="_blank" rel="noopener noreferrer">SSA Online Services</a>.</p>`,
      },
      {
        html:
          `<p><strong>How do I find the nearest SSA office to <City/>?</strong><br/>` +
          `Use the <a href="https://www.ssa.gov/locator/" target="_blank" rel="noopener noreferrer">SSA Office Locator</a> for addresses and hours.</p>`,
      },
      {
        html:
          `<p><strong>Missed a consultative exam?</strong><br/>` +
          `Contact the number on your exam notice immediately to reschedule and avoid a denial for insufficient evidence.</p>`,
      },
    ],
  },

  /* ------------------------------ SSDI ------------------------------ */
  ssdi: {
    link: "https://www.ssa.gov/benefits/disability/",
    contact: "https://www.ssa.gov/agency/contact/phone.html",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>How do I apply for SSDI in <City/>, <State/>?</strong><br/>` +
          `Apply online at <a href="https://www.ssa.gov/benefits/disability/" target="_blank" rel="noopener noreferrer">ssa.gov/benefits/disability</a> or call <a href="tel:18007721213">1-800-772-1213</a> for assistance.</p>`,
      },
      {
        html:
          `<p><strong>What records should I gather?</strong><br/>` +
          `Medical records, provider contacts, work history, and recent earnings help speed up your claim.</p>`,
      },
      {
        html:
          `<p><strong>Can I work while my SSDI claim is pending?</strong><br/>` +
          `Limited earnings may be allowed. Report changes promptly to SSA to avoid overpayments.</p>`,
      },
    ],
  },

  /* ------------------------------ SSI ------------------------------ */
  ssi: {
    link: "https://www.ssa.gov/ssi/",
    contact: "https://www.ssa.gov/agency/contact/phone.html",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>How do I apply for SSI in <City/>, <State/>?</strong><br/>` +
          `Start at <a href="https://www.ssa.gov/ssi/" target="_blank" rel="noopener noreferrer">ssa.gov/ssi</a> or call <a href="tel:18007721213">1-800-772-1213</a> (TTY <a href="tel:18003250778">1-800-325-0778</a>) to schedule an interview.</p>`,
      },
      {
        html:
          `<p><strong>Will SSI in <State/> connect me to Medicaid?</strong><br/>` +
          `SSI recipients in <State/> often qualify for Medicaid; confirm current rules with ACCESS Florida and AHCA.</p>`,
      },
      {
        html:
          `<p><strong>What if I don’t have a stable mailing address?</strong><br/>` +
          `SSA can work with you on alternatives or a representative payee. Ask your local office via the <a href="https://www.ssa.gov/locator/" target="_blank" rel="noopener noreferrer">SSA Office Locator</a>.</p>`,
      },
    ],
  },

  /* ------------------------------ VA (Benefits) ------------------------------ */
  va: {
    link: "https://www.benefits.va.gov/stpetersburg/",
    contact:
      "https://www.va.gov/find-locations/?facilityType=benefits&address=Miami%2C%20FL",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Where do Miami veterans file VA benefit claims?</strong><br/>` +
          `Florida’s Regional Office is in St. Petersburg: <a href="https://www.benefits.va.gov/stpetersburg/" target="_blank" rel="noopener noreferrer">VA St. Petersburg</a>. Local VSOs in <City/> can help you prepare claims.</p>`,
      },
      {
        html:
          `<p><strong>How do I find a nearby VA benefits office?</strong><br/>` +
          `Use VA’s locator filtered to <City/>: <a href="https://www.va.gov/find-locations/?facilityType=benefits&address=Miami%2C%20FL" target="_blank" rel="noopener noreferrer">Find VA Benefits Offices</a>.</p>`,
      },
      {
        html:
          `<p><strong>Missed a C&amp;P exam?</strong><br/>` +
          `Call the scheduler on your notice ASAP to reschedule. Keep records of every call and letter.</p>`,
      },
    ],
  },

  /* ------------------------------ VA Health ------------------------------ */
  vaHealth: {
    link: "https://www.va.gov/miami-health-care/",
    contact:
      "https://www.va.gov/find-locations/?facilityType=health&address=Miami%2C%20FL",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Where do I get VA health care in <City/>?</strong><br/>` +
          `Start with the Miami VA Healthcare System: <a href="https://www.va.gov/miami-health-care/" target="_blank" rel="noopener noreferrer">Miami VA Health Care</a>.</p>`,
      },
      {
        html:
          `<p><strong>Is Community Care available?</strong><br/>` +
          `Yes, if eligibility criteria are met (e.g., drive times, limited services). Ask your VA care team about referrals.</p>`,
      },
      {
        html:
          `<p><strong>Need transportation?</strong><br/>` +
          `Ask about travel reimbursement or local ride options. Check the VA locator: <a href="https://www.va.gov/find-locations/?facilityType=health&address=Miami%2C%20FL" target="_blank" rel="noopener noreferrer">Find VA Health Facilities</a>.</p>`,
      },
    ],
  },

  /* ------------------------------ ERA (rental assistance) ------------------------------ */
  era: {
    link: "https://www.miamidade.gov/global/housing/renters.page",
    contact: "https://www.211miami.org/",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Is emergency rental aid still open in <City/>?</strong><br/>` +
          `Programs change. Start with <a href="https://www.miamidade.gov/global/housing/renters.page" target="_blank" rel="noopener noreferrer">Miami-Dade Renters</a> and call <a href="https://www.211miami.org/" target="_blank" rel="noopener noreferrer">2-1-1 Miami</a> for current options.</p>`,
      },
      {
        html:
          `<p><strong>Can assistance pay the landlord directly?</strong><br/>` +
          `Most programs pay landlords; some offer direct-to-tenant aid when landlords won’t participate.</p>`,
      },
      {
        html:
          `<p><strong>What documents should I collect?</strong><br/>` +
          `Lease, ID, income proof, and any eviction or past-due notices—upload clear scans to speed up review.</p>`,
      },
    ],
  },

  /* ------------------------------ Credit & Reports ------------------------------ */
  creditScore: {
    link: "https://www.annualcreditreport.com",
    contact: "https://www.annualcreditreport.com/contactUs.action",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>How do I check my credit for free in <City/>?</strong><br/>` +
          `Use <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">AnnualCreditReport.com</a> for reports; many banks show scores in-app.</p>`,
      },
      {
        html:
          `<p><strong>How often can I pull reports?</strong><br/>` +
          `You can obtain free reports from the major bureaus; check the site for current frequency and offers.</p>`,
      },
      {
        html:
          `<p><strong>See an error?</strong><br/>` +
          `Dispute with the bureau online and keep copies of all submissions and letters.</p>`,
      },
    ],
  },

  /* ------------------------------ Rent Reporting ------------------------------ */
  rentReporting: {
    link: "https://www.boompay.app/boomreport?source=MYGOVBLOG&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=Boompay",
    contact:
      "https://www.boompay.app/boomreport?source=MYGOVBLOG&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=Boompay",
    email: "",
    faqs: [
      {
        html:
          `<p><strong>Do landlords in <City/> report rent by default?</strong><br/>` +
          `Usually not. Consider a <a href="https://www.boompay.app/boomreport?source=MYGOVBLOG&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=Boompay" target="_blank" rel="noopener noreferrer">rent-reporting service</a> or ask your property manager.</p>`,
      },
      {
        html:
          `<p><strong>Can past rent be reported?</strong><br/>` +
          `Some services allow up to <strong>24 months</strong> of back-reporting with documentation.</p>`,
      },
      {
        html:
          `<p><strong>Will this replace paying on time?</strong><br/>` +
          `No—on-time payments are still essential. Reporting can help establish history, not fix late payments.</p>`,
      },
    ],
  },
};

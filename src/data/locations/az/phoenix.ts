// /src/data/locations/az/phoenix.ts
// Plain data module for Phoenix, AZ.
// - `localResources` is your single source of truth.
// - <ResourceLink name="X" /> uses `localResources.X.link` as the primary CTA.
// - <ResourceLink name="X" field="phone" /> auto-creates tel: links.
// - <ResourceLink name="X" field="stateUrl" | "providerSearchUrl" | ... /> targets any extra fields you add.
// You can use <City/> and <State/> tokens inside FAQ HTML; they’ll be hydrated at render time.

const phoenix = {
  city: "Phoenix",
  state: "AZ",

  localResources: {
    /* ------------------------------ SNAP ------------------------------ */
    snap: {
      link: "https://www.healthearizonaplus.gov/",
      contact:
        "https://des.az.gov/services/basic-needs/food-assistance/contact-des",
      email: "",
      faqs: [
        {
          html:
            `<strong>How long does approval take?</strong><br/>` +
            `Most states decide within 30 days; expedited households may receive benefits within 7 days.`,
        },
        {
          html:
            `<p><strong>Do I have to interview in person?</strong><br/>` +
            `Usually no — most states do phone interviews. Upload clear documents in ` +
            `<a href="https://www.healthearizonaplus.gov/" target="_blank" rel="noopener noreferrer">Health-e-Arizona PLUS</a> to avoid delays.</p>`,
        },
        {
          html:
            `<p><strong>Where do I apply in <City/>, <State/>?</strong><br/>` +
            `Apply online via <a href="https://www.healthearizonaplus.gov/" target="_blank" rel="noopener noreferrer">Health-e-Arizona PLUS</a> ` +
            `or visit a local DES office in <City/>; interviews are typically by phone.</p>`,
        },
      ],
    },

    /* ------------------------ UNEMPLOYMENT (UI) ------------------------ */
    unemployment: {
      link: "https://uiclaims.azdes.gov/introduction/fileyourclaim.aspx",
      contact:
        "https://des.az.gov/services/employment/unemployment-individual/contact-AZUI",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>How do I apply in <City/>, <State/>?</strong><br/>` +
            `Start an initial claim online via <a href="https://uiclaims.azdes.gov/introduction/fileyourclaim.aspx" target="_blank" rel="noopener noreferrer">Arizona UI Initial Claim</a>. ` +
            `File as soon as possible after your last day of work; UI is generally <em>not</em> retroactive to weeks before you apply.</p>`,
        },
        {
          html:
            `<p><strong>When and how do I file weekly certifications?</strong><br/>` +
            `Use the Weekly Claims system between <strong>Sunday 12:01 a.m. and Friday 6:00 p.m. (MST)</strong>. ` +
            `Go to <a href="https://des.az.gov/services/employment/unemployment-individual/file-your-weekly-ui-claims" target="_blank" rel="noopener noreferrer">File Weekly Claim</a> and submit every benefit week you’re unemployed.</p>`,
        },
        {
          html:
            `<p><strong>How long until my first payment?</strong><br/>` +
            `If eligible and there are no issues, first payments are often processed within about <strong>15 business days</strong> after required checks and your first certification.</p>`,
        },
        {
          html:
            `<p><strong>What if I miss a weekly claim?</strong><br/>` +
            `Missing certifications can pause your claim. If you miss more than two consecutive weeks, your claim may become inactive and you may need to contact the UI Call Center to resume timely filing.</p>`,
        },
        {
          html:
            `<p><strong>Who do I contact for help in <City/>, <State/>?</strong><br/>` +
            `Call the UI Benefits line at <strong>1-877-600-2722</strong> or the Phoenix line at <strong>602-417-3800</strong>. ` +
            `You can also use the <a href="https://des.az.gov/find-your-local-office" target="_blank" rel="noopener noreferrer">DES Office Locator</a> to find help nearby, or visit the UI contact page for more options.</p>`,
        },
      ],
    },

    /* ------------------------------ WIC ------------------------------ */
    wic: {
      link: "https://www.azdhs.gov/prevention/azwic/",
      contact:
        "https://www.azdhs.gov/prevention/azwic/families/index.php#contact",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Can I get WIC while applying for SNAP?</strong><br/>` +
            `Yes — programs are separate. Many families in <City/> qualify for both based on income and household size.</p>`,
        },
        {
          html:
            `<p><strong>Do I need proof of pregnancy for WIC?</strong><br/>` +
            `Yes — bring documentation from a healthcare provider or clinic. Infants and children under 5 may also qualify.</p>`,
        },
      ],
    },

    /* ------------------------------ LIHEAP (utilities) ------------------------------ */
    liheap: {
      link: "https://des.az.gov/liheap",
      contact: "https://azdes-community.my.salesforce-sites.com/EOL/",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Can LIHEAP help with a shutoff in <City/>, <State/>?</strong><br/>` +
            `Yes — bring your shutoff notice. Many agencies in <City/> can issue crisis payments directly to utilities. ` +
            `Start with <a href="https://des.az.gov/liheap" target="_blank" rel="noopener noreferrer">DES LIHEAP</a> or call <strong>2-1-1</strong>.</p>`,
        },
        {
          html:
            `<p><strong>How often can I receive LIHEAP?</strong><br/>` +
            `Typically once per season or year; emergency aid may be available more than once depending on funding and your situation.</p>`,
        },
      ],
    },

    /* ------------------------------ Medicaid (AHCCCS) ------------------------------ */
    medicaid: {
      link: "https://www.healthearizonaplus.gov/",
      contact:
        "https://des.az.gov/services/basic-needs/food-assistance/contact-des",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Who administers Medicaid in <State/>?</strong><br/>` +
            `AHCCCS. Apply via <a href="https://www.healthearizonaplus.gov/" target="_blank" rel="noopener noreferrer">Health-e-Arizona PLUS</a>. ` +
            `Many community clinics in <City/> can help with applications.</p>`,
        },
        {
          html:
            `<p><strong>Does AHCCCS cover dental/vision?</strong><br/>` +
            `Children are covered; adult benefits vary by plan. Check your AHCCCS plan’s member handbook for specifics.</p>`,
        },
      ],
    },

    /* ------------------------------ Child Care (CCDF) ------------------------------ */
    ccdf: {
      link: "https://des.az.gov/services/child-and-family/child-care/how-apply-for-child-care-assistance",
      contact: "https://des.az.gov/ContactChildCare",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Is there a waitlist in <City/>?</strong><br/>` +
            `Sometimes. If there’s a waitlist, DES will notify you after you apply and explain next steps.</p>`,
        },
        {
          html:
            `<p><strong>Do I need a provider before I apply?</strong><br/>` +
            `No. You can apply first, then choose an approved provider that accepts subsidy.</p>`,
        },
      ],
    },

    /* ------------------------------ Free contact (Lifeline) ------------------------------ */
    freePhone: {
      link: "https://freesmartphone.net/promo?code=free&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=SafeLink",
      contact: "",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Can I get a free phone in <City/> with Lifeline?</strong><br/>` +
            `Many providers serve <City/>. If you’re on SNAP or Medicaid, you likely qualify. ` +
            `See <a href="https://freesmartphone.net/promo?code=free&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=SafeLink" target="_blank" rel="noopener noreferrer">Freesmartphone.net</a> for details.</p>`,
        },
      ],
    },

    /* ------------------------------ Housing (local housing dept) ------------------------------ */

    housing: {
      link: "https://www.phoenix.gov/housing",
      contact:
        "https://www.phoenix.gov/administration/departments/housing/section-8-housing/section-8-waitlist.html",
      email: "housing@phoenix.gov",
      faqs: [
        {
          html:
            `<p><strong>How do I apply for housing help in <City/>, <State/>?</strong><br/>` +
            `Start at the <a href="https://www.phoenix.gov/housing" target="_blank" rel="noopener noreferrer">Phoenix Housing Department</a>. ` +
            `For vouchers, use the <a href="https://phxhousing.myhousing.com/" target="_blank" rel="noopener noreferrer">MyHousing Applicant Portal</a> when the waitlist is open.</p>`,
        },
        {
          html:
            `<p><strong>Is the Section 8 waitlist open right now?</strong><br/>` +
            `Waitlist status changes. Check the <a href="https://www.phoenix.gov/administration/departments/housing/section-8-housing/section-8-waitlist.html" target="_blank" rel="noopener noreferrer">Section 8 Waitlist page</a> ` +
            `or log into the <a href="https://phxhousing.myhousing.com/" target="_blank" rel="noopener noreferrer">Applicant Portal</a>.</p>`,
        },
        {
          html:
            `<p><strong>I live outside Phoenix but in Maricopa County — who helps me?</strong><br/>` +
            `See <a href="https://www.maricopa.gov/5582/Rental-Assistance" target="_blank" rel="noopener noreferrer">Maricopa County Rental Assistance</a> ` +
            `or the <a href="https://housing.az.gov/contact-us" target="_blank" rel="noopener noreferrer">Arizona Department of Housing</a> for county/statewide options.</p>`,
        },
      ],
    },

    /* ------------------------------ Social Security (DDS/SSDI/SSI) ------------------------------ */
    dds: {
      link: "https://www.ssa.gov/onlineservices/",
      contact: "https://secure.ssa.gov/ICON/main.jsp#officeResults",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>How do I find my SSA office?</strong><br/>` +
            `Use the <a href="https://www.ssa.gov/locator/" target="_blank" rel="noopener noreferrer">SSA office locator</a> ` +
            `to find the nearest location to <City/>.</p>`,
        },
      ],
    },
    ssdi: {
      link: "https://www.ssa.gov/benefits/disability/",
      contact: "https://www.ssa.gov/agency/contact/phone.html",
      email: "",
      faqs: [],
    },
    ssi: {
      link: "https://www.ssa.gov/ssi/",
      contact: "https://www.ssa.gov/agency/contact/phone.html",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>How do I apply for SSI in <City/>, <State/>?</strong><br/>` +
            `Start at the SSA’s SSI page, then apply by phone or through your local office. Call <a href="tel:18007721213">1-800-772-1213</a> (TTY <a href="tel:18003250778">1-800-325-0778</a>) or use the <a href="https://www.ssa.gov/locator/" target="_blank" rel="noopener noreferrer">SSA Office Locator</a> to find an office near <City/>.</p>`,
        },
        {
          html:
            `<p><strong>Where’s my nearest SSA office in <City/>, <State/>?</strong><br/>` +
            `Use the <a href="https://www.ssa.gov/locator/" target="_blank" rel="noopener noreferrer">SSA Office Locator</a> and search for “<City/>, <State/>.” You can confirm hours, services, and how to schedule an appointment.</p>`,
        },
        {
          html:
            `<p><strong>Can I start the SSI application online?</strong><br/>` +
            `You can start online and SSA will contact you to finish, or they may schedule an interview. Begin at <a href="https://www.ssa.gov/ssi/" target="_blank" rel="noopener noreferrer">ssa.gov/ssi</a> or call <a href="tel:18007721213">1-800-772-1213</a> for help.</p>`,
        },
        {
          html:
            `<p><strong>What documents should I have ready?</strong><br/>` +
            `Have ID, proof of income/resources, medical records, and contact info for clinics/doctors. The SSI page at <a href="https://www.ssa.gov/ssi/" target="_blank" rel="noopener noreferrer">ssa.gov/ssi</a> lists common documents.</p>`,
        },
        {
          html:
            `<p><strong>How long do SSI decisions take in <City/>, <State/>?</strong><br/>` +
            `Timelines vary. Arizona’s Disability Determination Services reviews medical eligibility—stay responsive to mail and exam requests. See <a href="https://des.az.gov/services/disabilities/disability-determination-services" target="_blank" rel="noopener noreferrer">AZ DDS</a> for more about the process.</p>`,
        },
        {
          html:
            `<p><strong>If I get SSI in <State/>, will I qualify for Medicaid (AHCCCS)?</strong><br/>` +
            `SSI often connects to AHCCCS coverage. Check eligibility and how to enroll at <a href="https://www.azahcccs.gov/Members/GetCovered/apply.html" target="_blank" rel="noopener noreferrer">azahcccs.gov</a>.</p>`,
        },
        {
          html:
            `<p><strong>What if I don’t have a stable mailing address?</strong><br/>` +
            `SSA can work with you on alternative mailing options or a representative payee. See resources for people experiencing homelessness at <a href="https://www.ssa.gov/people/homeless/" target="_blank" rel="noopener noreferrer">ssa.gov/people/homeless</a> or ask the local office in <City/>.</p>`,
        },
        {
          html:
            `<p><strong>Can I work while applying or after I’m approved for SSI?</strong><br/>` +
            `Limited earnings may reduce your SSI payment rather than cancel it, but you must report changes quickly. Learn more at <a href="https://www.ssa.gov/ssi/" target="_blank" rel="noopener noreferrer">ssa.gov/ssi</a>.</p>`,
        },
      ],
    },

    /* ------------------------------ VA & VA Health ------------------------------ */
    va: {
      link: "https://www.benefits.va.gov/phoenix/",
      contact:
        "https://www.va.gov/find-locations/?page=1&address=Phoenix%2C%20Arizona%2C%20United%20States&facilityType=benefits&serviceType&latitude=33.44823&longitude=-112.075098&radius=139&bounds%5B%5D=-112.92619865322747&bounds%5B%5D=32.73808507246377&bounds%5B%5D=-111.22399734677252&bounds%5B%5D=34.15837492753624&context=Phoenix%2C%20Arizona%2C%20United%20States",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Where do I get help with VA benefits in <City/>?</strong><br/>` +
            `Use the <a href="https://www.va.gov/find-locations/" target="_blank" rel="noopener noreferrer">VA locator</a> ` +
            `to find the nearest benefits office and accredited VSOs.</p>`,
        },
        {
          html:
            `<p><strong>Can I visit the Phoenix VA Regional Office in person?</strong><br/>` +
            `Check hours and appointment options on the <a href="https://www.benefits.va.gov/phoenix/" target="_blank" rel="noopener noreferrer">Phoenix Regional Office page</a>. ` +
            `Bring a government ID and your claim number if you have one.</p>`,
        },
        {
          html:
            `<p><strong>Where can I find accredited claims help in <City/>, <State/>?</strong><br/>` +
            `Search the <a href="https://www.va.gov/ogc/apps/accreditation/index.asp" target="_blank" rel="noopener noreferrer">VA-Accredited Representatives</a> database, ` +
            `or contact the <a href="https://dvs.az.gov" target="_blank" rel="noopener noreferrer">Arizona Department of Veterans’ Services (ADVS)</a> for free assistance.</p>`,
        },
        {
          html:
            `<p><strong>How do I get a Certificate of Eligibility (COE) for a VA home loan?</strong><br/>` +
            `Request it online via VA at <a href="https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/" target="_blank" rel="noopener noreferrer">Request a COE</a> ` +
            `or ask your lender to pull it electronically.</p>`,
        },
        {
          html:
            `<p><strong>I missed a C&amp;P (claim) exam—what should I do?</strong><br/>` +
            `Contact the scheduler on your notice immediately and explain the reason; you may be able to reschedule. ` +
            `Learn what exams are for here: <a href="https://www.va.gov/disability/va-claim-exam/" target="_blank" rel="noopener noreferrer">VA claim exam overview</a>.</p>`,
        },
        {
          html:
            `<p><strong>Is there property tax relief for disabled veterans in Maricopa County?</strong><br/>` +
            `Yes—see local exemptions on the <a href="https://mcassessor.maricopa.gov/exemptions/" target="_blank" rel="noopener noreferrer">Maricopa County Assessor</a> site. ` +
            `You’ll need proof of disability rating and residency.</p>`,
        },
        {
          html:
            `<p><strong>How can I get to VA appointments in <City/> if I don’t drive?</strong><br/>` +
            `Veterans may qualify for <a href="https://www.valleymetro.org/fares/reduced-fare" target="_blank" rel="noopener noreferrer">Valley Metro reduced fare</a>. ` +
            `Ask your VA clinic about eligibility for travel reimbursement (mileage or special mode) if applicable.</p>`,
        },
        {
          html:
            `<p><strong>Who do I call for immediate help or a crisis?</strong><br/>` +
            `Contact the <a href="https://www.veteranscrisisline.net/" target="_blank" rel="noopener noreferrer">Veterans Crisis Line</a>: ` +
            `<strong>988</strong> then press <strong>1</strong>, or text <strong>838255</strong>. Available 24/7.</p>`,
        },
      ],
    },
    vaHealth: {
      link: "https://www.benefits.va.gov/phoenix/",
      contact:
        "https://www.va.gov/find-locations/?page=1&address=Phoenix%2C%20Arizona%2C%20United%20States&facilityType=benefits&serviceType&latitude=33.44823&longitude=-112.075098&radius=139&bounds%5B%5D=-112.92619865322747&bounds%5B%5D=32.73808507246377&bounds%5B%5D=-111.22399734677252&bounds%5B%5D=34.15837492753624&context=Phoenix%2C%20Arizona%2C%20United%20States",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Can I use Community Care in <City/>?</strong><br/>` +
            `Yes, when eligibility criteria are met (e.g., long drive times or limited services). Ask your VA team about referrals.</p>`,
        },
      ],
    },

    /* ------------------------------ ERA (rental assistance) ------------------------------ */
    era: {
      link: "https://des.az.gov/ARAP", // use local/county portals if you have them; 211 helps discover active programs
      contact: "https://des.az.gov/ARAP",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Is emergency rental assistance still open in <City/>?</strong><br/>` +
            `Availability changes. Check <a href="https://www.211.org/" target="_blank" rel="noopener noreferrer">211</a> or your county portal for reopening windows.</p>`,
        },
        {
          html:
            `<p><strong>Will payments go to my landlord?</strong><br/>` +
            `Typically yes; some programs can pay tenants directly if a landlord won’t participate (rules vary).</p>`,
        },
      ],
    },

    /* ------------------------------ Credit & Rent Reporting (for article-specific FAQs) ------------------------------ */
    creditScore: {
      link: "https://www.annualcreditreport.com",
      contact: "https://www.annualcreditreport.com/contactUs.action",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Where can I check my credit for free in <City/>?</strong><br/>` +
            `Use <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer">AnnualCreditReport.com</a> for reports; ` +
            `many banks and card issuers show scores in-app.</p>`,
        },
      ],
    },
    rentReporting: {
      link: "https://www.boompay.app/boomreport?source=MYGOVBLOG&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=Boompay",
      contact:
        "https://www.boompay.app/boomreport?source=MYGOVBLOG&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=Boompay",
      email: "",
      faqs: [
        {
          html:
            `<p><strong>Do landlords in <City/> report rent by default?</strong><br/>` +
            `Usually not. Consider a <a href="https://www.boompay.app/boomreport?source=MYGOVBLOG&utm_source=mygovblog&utm_medium=affiliate&utm_campaign=affiliate_cta&utm_content=Boompay" target="_blank" rel="noopener noreferrer">rent-reporting service</a> or ask your property manager if they participate.</p>`,
        },
        {
          html:
            `<p><strong>Can past rent be reported?</strong><br/>` +
            `Some services allow up to <strong>24 months</strong> of back-reporting with documentation, which can speed up score building.</p>`,
        },
      ],
    },
  },
} as const;

export default phoenix;

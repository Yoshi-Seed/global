// Data source for Japan Fact Sheets and the Fact Sheet detail page.
// Edit this file to add / update content without touching HTML templates.

window.FACT_SHEETS = [
  {
    id: "physician-mr-guide",
    title: "Conducting Physician Market Research in Japan",
    subtitle: "A comprehensive guide for international teams",
    topicArea: "HCP research",
    tags: ["Japan", "Methodology", "Fieldwork"],
    thumbnail: "assets/fact-sheet-hero-meeting.jpg",
    pdf: "pdf/Conducting_Physician_Market_Research_in_Japan-A_Comprehensive_Guide_for_International_Teams.pdf",
    keyPoints: [
      "What makes physician recruitment and scheduling different in Japan (and how to plan around it).",
      "How to design screening and verification for prescribing behavior and institution context.",
      "Choosing language support (JP, EN, bilingual moderation, interpretation) without losing nuance.",
      "A practical quality checklist for transcripts, translations, and reporting."
    ],
    suggestedQuestions: [
      "Which specialties and settings can we realistically reach within our timeline?",
      "How do we confirm that interviewees match prescribing / treatment responsibility criteria?",
      "What moderation setup best fits sensitivity, complexity, and speed (bilingual vs interpretation)?"
    ],
    related: ["japan-market-brief", "tips-healthcare-mr", "japan-vs-us-environment"]
  },
  {
    id: "japan-market-brief",
    title: "Japan Market Brief",
    subtitle: "Navigating structural, cultural, and operational complexity",
    topicArea: "Research operations",
    tags: ["Pharma", "Japan ops", "Culture"],
    thumbnail: "assets/fact-sheet-hero-doctor-writing.jpg",
    pdf: "pdf/Japan_Market_Brief_Navigating_Structural_Cultural_and_Operational_Complexities_in_Pharmaceutical_Market_Research.pdf",
    keyPoints: [
      "How Japan’s healthcare structure influences access, referral, and decision-making.",
      "Interview dynamics you will see in Japan (hierarchy, indirect responses, consensus).",
      "Fieldwork realities: incentives, scheduling constraints, and what affects feasibility.",
      "Deliverables that help global alignment (English debriefs, nuance-aware verbatims)."
    ],
    suggestedQuestions: [
      "What Japan-specific factors could make recruitment harder than expected?",
      "How should we interpret silence or indirect answers in qualitative interviews?",
      "What reporting format best supports global decision-making (summary vs full verbatims)?"
    ],
    related: ["physician-mr-guide", "pricing-process", "health-checkup-system"]
  },
  {
    id: "japan-vs-us-environment",
    title: "Japan vs US Pharmaceutical Environment",
    subtitle: "Key differences in prescribing and market access",
    topicArea: "Market access",
    tags: ["US comparison", "Policy", "Access"],
    thumbnail: "assets/seed_consultation.png",
    pdf: "pdf/Japan_vs_US_Pharmaceutical_Environment_Key_Differences_in_Prescribing_and_Market_Access.pdf",
    keyPoints: [
      "Differences in prescribing drivers and access pathways between Japan and the US.",
      "The role of institutions, guidelines, and referral patterns in Japan.",
      "Implications for stakeholder mapping, messaging, and evidence expectations."
    ],
    suggestedQuestions: [
      "Who influences prescribing and adoption decisions for this therapy area in Japan?",
      "Which access hurdles matter most pre- and post-launch?",
      "Where might our US assumptions mislead Japan strategy?"
    ],
    related: ["pricing-process", "oncology-dynamics", "prescribing-behaviors"]
  },
  {
    id: "prescribing-behaviors",
    title: "Japanese Physicians Prescribing Behaviors & Psychology",
    subtitle: "How decisions are made — and how adoption happens",
    topicArea: "HCP insights",
    tags: ["Behavior", "Messaging", "Segmentation"],
    thumbnail: "assets/fact-sheet-hero-doctor-writing-clipboard.jpg",
    pdf: "pdf/Japanese_Physicians_Prescribing_Behaviors_and_Psychology.pdf",
    keyPoints: [
      "How physicians weigh evidence, guidelines, and real-world constraints in Japan.",
      "Adoption barriers (risk, switching friction, patient factors) and what reduces them.",
      "How to listen for nuance: what is said directly vs implied."
    ],
    suggestedQuestions: [
      "What evidence moves a physician from interest to action in Japan?",
      "Which barriers prevent switching, add-on use, or earlier-line adoption?",
      "How do physicians discuss uncertainty and patient suitability?"
    ],
    related: ["oncology-dynamics", "physician-mr-guide", "japan-vs-us-environment"]
  },
  {
    id: "health-checkup-system",
    title: "Japan’s Annual Health Check-up System",
    subtitle: "Overview and implications for diagnosis journey",
    topicArea: "Healthcare system",
    tags: ["Screening", "Prevention", "Patient flow"],
    thumbnail: "assets/fact-sheet-hero-checklist.jpg",
    pdf: "pdf/Japans_Annual_Health_Check-up_System_Overview_and_Insights_for_Pharma_Market.pdf",
    keyPoints: [
      "How annual check-ups work in Japan and how patients move from screening to care.",
      "What varies by employer and municipality — and why it matters to research design.",
      "Practical implications for awareness, detection, referral, and follow-up."
    ],
    suggestedQuestions: [
      "Where are the biggest drop-offs between screening and diagnosis confirmation?",
      "Which stakeholders manage follow-up and referral in practice?",
      "How does this system change patient pathways for our condition?"
    ],
    related: ["patient-centered", "patient-recruitment", "japan-market-brief"]
  },
  {
    id: "pricing-process",
    title: "Japan’s Drug Reimbursement and Pricing Process",
    subtitle: "A practical walkthrough for global teams",
    topicArea: "Market access",
    tags: ["Pricing", "Reimbursement", "Policy"],
    thumbnail: "assets/fact-sheet-hero-business-handshake.jpg",
    pdf: "pdf/Japans_Drug_Reimbursement_and_Pricing_Process.pdf",
    keyPoints: [
      "Key steps from regulatory approval to reimbursement listing in Japan.",
      "How price revisions and re-pricing triggers can affect strategy over time.",
      "Questions to pressure-test with stakeholders during planning and launch."
    ],
    suggestedQuestions: [
      "Which decision points should we validate with KOLs and payor-side stakeholders?",
      "How might re-pricing affect physician behavior and hospital adoption over time?",
      "What access assumptions should be tested locally before finalizing plans?"
    ],
    related: ["japan-vs-us-environment", "japan-market-brief"]
  },
  {
    id: "patient-recruitment",
    title: "Optimizing Patient Recruitment Strategies in Japan",
    subtitle: "Recruit better — without losing trust or quality",
    topicArea: "Patient recruitment",
    tags: ["Recruitment", "Quality", "Compliance"],
    thumbnail: "assets/scheduling.png",
    pdf: "pdf/Optimizing_Patient_Recruitment_Strategies_in_the_Japanese_Market.pdf",
    keyPoints: [
      "Recruitment channels in Japan (clinics, panels, advocacy) and when to use them.",
      "How to reduce screen-outs: diagnosis confirmation, treatment stage, and journey clarity.",
      "Participant experience and consent — especially for sensitive conditions."
    ],
    suggestedQuestions: [
      "What recruitment approach best fits our sensitivity level and timeline?",
      "How do we verify diagnosis and treatment stage without over-burdening participants?",
      "What screening questions reduce drop-out and improve insight quality?"
    ],
    related: ["patient-centered", "health-checkup-system"]
  },
  {
    id: "patient-centered",
    title: "Patient-Centered Market Research in Japan",
    subtitle: "Design interviews that respect burden and context",
    topicArea: "Patient research",
    tags: ["Patient", "Ethics", "Experience"],
    thumbnail: "assets/patient_care.png",
    pdf: "pdf/Patient-Centered_Market_Research_in_Japan.pdf",
    keyPoints: [
      "Designing interviews with patient burden and emotional safety in mind.",
      "Cultural dynamics in sharing lived experience and discussing sensitive topics.",
      "When caregiver interviews add essential context."
    ],
    suggestedQuestions: [
      "How should we structure topics for sensitive or stigmatized conditions?",
      "When is caregiver input essential vs optional?",
      "What fieldwork setup reduces participant burden while keeping depth?"
    ],
    related: ["patient-recruitment", "health-checkup-system"]
  },
  {
    id: "tips-healthcare-mr",
    title: "Tips for Healthcare Market Research in Japan",
    subtitle: "Fieldwork, translation, and quality — practical notes",
    topicArea: "Research operations",
    tags: ["Tips", "Fieldwork", "Quality"],
    thumbnail: "assets/fact-sheet-hero-health-insurance-tiles.jpg",
    pdf: "pdf/Tips_for_Healthcare_MR_in_Japan.pdf",
    keyPoints: [
      "Best practices for scheduling, incentives, and local etiquette in Japan.",
      "Translation and transcript QC: how to preserve nuance without slowing the work.",
      "Debrief formats that keep global stakeholders aligned and confident."
    ],
    suggestedQuestions: [
      "How can we reduce bias introduced by hierarchy or social desirability?",
      "Which QC steps matter most for transcription and translation accuracy?",
      "What is the fastest way to align global teams after fieldwork (debrief + written)?"
    ],
    related: ["physician-mr-guide", "japan-market-brief"]
  },
  {
    id: "oncology-dynamics",
    title: "Understanding Oncology Dynamics in Japan",
    subtitle: "Institutions, decision-making, and patient pathways",
    topicArea: "Therapy area",
    tags: ["Oncology", "Patient flow", "Institutions"],
    thumbnail: "assets/fact-sheet-hero-doctors-meeting.jpg",
    pdf: "pdf/Understanding_Oncology_Dynamics_in_Japan.pdf",
    keyPoints: [
      "How institutions (university vs community) shape decision-making in oncology.",
      "MDT dynamics: who influences treatment decisions and when.",
      "Where bottlenecks appear (testing, referral, access) — and what to validate."
    ],
    suggestedQuestions: [
      "Who drives treatment decisions at each stage of the patient pathway in Japan?",
      "Where are the biggest bottlenecks for diagnosis or biomarker testing?",
      "Which institutions should we prioritize to reflect real-world practice?"
    ],
    related: ["prescribing-behaviors", "japan-vs-us-environment"]
  }
];

window.REPORT_SUMMARIES = [
  {
    number: "001",
    date: "2026-01",
    title: "Japanese physicians prescribing behaviors & psychology",
    summary: "A short, executive-friendly snapshot of how prescribing decisions are framed in Japan — and what messaging cues influence adoption.",
    tags: ["HCP insights", "Messaging"]
  },
  {
    number: "002",
    date: "2026-01",
    title: "Japan’s reimbursement & pricing: what global teams miss",
    summary: "A practical view of the Japan-specific steps and timelines that shape market access — with implications you can pressure-test in research.",
    tags: ["Market access", "Policy"]
  },
  {
    number: "003",
    date: "2026-01",
    title: "Patient recruitment realities in Japan",
    summary: "Recruitment channels, constraints, and a fieldwork checklist to reduce drop-outs — especially when the topic is sensitive.",
    tags: ["Recruitment", "Quality"]
  },
  {
    number: "004",
    date: "2026-02",
    title: "Conducting physician market research in Japan",
    summary: "Key considerations for engaging Japanese physicians in market research — from recruitment protocols to interview methodology.",
    tags: ["HCP insights", "Methodology"]
  },
  {
    number: "005",
    date: "2026-02",
    title: "Understanding Japan's healthcare infrastructure",
    summary: "An overview of Japan's unique healthcare system structure and how it impacts clinical research and patient access.",
    tags: ["Market access", "Policy"]
  },
  {
    number: "006",
    date: "2026-02",
    title: "Patient engagement strategies in Japan",
    summary: "Best practices for building trust and engagement with Japanese patients in clinical and market research settings.",
    tags: ["Recruitment", "Quality"]
  },
  {
    number: "007",
    date: "2026-03",
    title: "Regulatory considerations for Japan research",
    summary: "Essential regulatory frameworks and ethical guidelines that shape healthcare research design and execution in Japan.",
    tags: ["Policy", "Quality"]
  },
  {
    number: "008",
    date: "2026-03",
    title: "Digital health adoption in Japan",
    summary: "Current trends and barriers in digital health technology adoption among Japanese healthcare professionals and patients.",
    tags: ["HCP insights", "Market access"]
  },
  {
    number: "009",
    date: "2026-03",
    title: "Rare disease research in Japan",
    summary: "Unique challenges and opportunities for conducting rare disease research in Japan's healthcare ecosystem.",
    tags: ["Recruitment", "Policy"]
  },
  {
    number: "010",
    date: "2026-03",
    title: "Qualitative research best practices for Japan",
    summary: "Methodological insights and cultural considerations for conducting high-quality qualitative research in Japan.",
    tags: ["Methodology", "Quality"]
  }
];

/* ============================================
   faqs.js  （保存先：faq/data/faqs.js）
   ★ このファイルは「FAQデータだけ」を持つ
   ★ ここに新しいFAQを追記していけばOK（Q69, Q70…）
   ★ 他のJSからは window.FAQS を参照する
============================================ */
(function () {
  // 既存があれば使う
  window.FAQS = window.FAQS || [];

  // ここからFAQ本体（Q1〜Q68）。必要に応じて追記してOK。
  var FAQS = [
    {
      id: "Q1",
      question: "Is every citizen in Japan covered by health insurance?",
      answer: "Yes, Japan has implemented a universal health insurance system since 1961, ensuring that all citizens are enrolled in some form of public health insurance. The system comprises various schemes, including: Employees‘ Health Insurance (for company employees), National Health Insurance (for self-employed individuals, pensioners, and others not covered by employment-based insurance), and the Medical Care System for the Elderly Aged 75 and Over (for individuals aged 75 and above)."
    },
    {
      id: "Q2",
      question: "What percentage of medical expenses do patients typically pay out of pocket in Japan?",
      answer: "Public health insurance in Japan covers approximately 70% of medical costs, and patients are generally responsible for the remaining 30%. (For children and the elderly, the co-payment rate varies between 10% and 30%.) Thanks to this system, people in Japan can access medical services at a relatively low cost. Reimbursement rates for medical services and drug prices are determined by the Central Social Insurance Medical Council (Chuikyo), which consists of healthcare professionals and experts from various fields. When conducting market research, it is essential to be mindful of these unique decision-making hurdles."
    },
    {
      id: "Q3",
      question: "Is there an upper limit to out-of-pocket payments for medical expenses in Japan?",
      answer: "Yes, Japan has a “High-Cost Medical Expense Benefit” system, which sets a monthly upper limit (determined by income level) on out-of-pocket payments at each medical institution. Any amount exceeding this limit is reimbursed later. This system reduces the risk that patients will forgo treatment for serious illnesses or costly therapies due to financial reasons. As a result, financial barriers are relatively low. Therefore, in research design it is important to focus on non-economic burdens (such as time, family support, etc.). Since patients can easily use multiple medical institutions, it is crucial to anticipate patterns of care that involve multiple points of contact rather than assuming a single-institution pathway."
    },
    {
      id: "Q4",
      question: "Does the design of the healthcare payment system influence behaviors in clinical practice?",
      answer: "Yes. For example, mechanisms such as additional reimbursement points for home healthcare or limits on the number of inpatient days can significantly influence clinical practice styles and the level of cooperation between medical institutions. In market research and clinical study design, whether a particular service is reimbursed (i.e., covered by the payment system) often serves as an important motivator."
    },
    {
      id: "Q5",
      question: "Is access to healthcare providers in Japan open and flexible?",
      answer: "Yes. In Japan, patients can visit specialists and large hospitals freely without a referral. This “free access system” is a distinctive feature of Japan’s healthcare, and there are often fewer restrictions."
    },
    {
      id: "Q6",
      question: "What challenges are associated with a system where anyone can freely access large hospitals or specialists?",
      answer: "While free access allows anyone to visit large hospitals or specialists, it also leads to overcrowded outpatient departments at major hospitals, as well as duplication of consultations and tests, resulting in inefficient use of medical resources. When considering patient pathways and market entry strategies, it is important to carefully select which level of medical institution (clinic, mid-sized hospital, or large hospital) to target."
    },
    {
      id: "Q7",
      question: "Does Japan have a primary care physician system?",
      answer: "There is no system in Japan equivalent to the US GP (General Practitioner) or PCP (Primary Care Physician); initial consultations are also provided by specialists in each department. Patients can visit university hospitals or large hospitals directly without a referral letter, although additional fees may apply if no referral is presented. It is important to be mindful of these institutional differences with other countries and to carefully define inclusion criteria for research subjects."
    },
    {
      id: "Q8",
      question: "Are there any restrictions on physicians' clinical practices or referral pathways in Japan?",
      answer: "There are generally no strict restrictions, and referrals and diagnoses are made at the discretion of the physician. However, for some large medical institutions such as university hospitals, a referral letter is sometimes recommended."
    },
    {
      id: "Q9",
      question: "Are Japan’s health insurance systems operated by private companies?",
      answer: "No, in Japan, the health insurance system is not operated by private insurance companies, but by public entities such as the government and local municipalities."
    },
    {
      id: "Q10",
      question: "How are health insurance premiums determined in Japan?",
      answer: "Insurance premiums are determined based on individual income and age. Health insurance premiums may be deducted from salaries through employers or paid individually based on billing from local governments. The amount and method of payment vary depending on one’s occupation and age."
    },
    {
      id: "Q11",
      question: "Is there a role for private health insurance in Japan?",
      answer: "Yes, but it serves a supplementary role to the public health insurance system. Private health insurance is utilized to cover aspects not included in public insurance, such as advanced medical treatments and additional charges for private hospital rooms during hospitalization. There is no need to conduct interviews with private insurers. The Central Social Insurance Medical Council (Chuikyo) effectively oversees reimbursement and price setting in Japan, and interviewing them is extremely difficult."
    },
    {
      id: "Q12",
      question: "What is the role of physicians and their influence on purchasing decisions in Japan?",
      answer: "Physicians in Japan are not only responsible for treating patients, but also play a significant role in the selection and adoption of medical devices and pharmaceuticals. In many cases, they are deeply involved in product selection in collaboration with hospital management and procurement departments. In market research, it is necessary to understand the perspectives of both physicians and hospital administration departments."
    },
    {
      id: "Q13",
      question: "How is the health checkup system implemented in Japan?",
      answer: "In Japan, the Industrial Safety and Health Act requires employers to provide annual health checkups for their employees. In addition, it is common for individuals to voluntarily undergo more comprehensive health examinations (known as “Ningen Dock”) at their own expense."
    },
    {
      id: "Q14",
      question: "What types of tests are included in health checkups in Japan?",
      answer: "Basic health checkups in Japan typically include measurements of height, weight, abdominal circumference, blood pressure, vision and hearing tests, blood tests (liver function, kidney function, blood glucose, lipids, etc.), urinalysis, chest X-ray, and electrocardiogram (ECG). Depending on the municipality or workplace, additional cancer screenings may also be provided."
    },
    {
      id: "Q15",
      question: "What follow-up system is in place if abnormalities are found during a health checkup in Japan?",
      answer: "After a health checkup, if any abnormalities are found, an occupational physician or public health nurse will recommend follow-up and encourage the individual to undergo detailed examinations or consult a specialist medical institution. In many companies, proactive follow-up systems are also well established."
    },

    /* —— ここからQ16〜Q30（必要なら後で編集OK） —— */
    {
      id: "Q16",
      question: "What are the characteristics of price revisions for medical services and pharmaceuticals in Japan?",
      answer: "Reimbursement fees for medical services and drug prices are reviewed every two years (and will be revised annually in the future), with a strong emphasis on cost containment. Even if a new drug is launched at a relatively high price, it is often subject to early price reductions (special price cuts), so it is important to take this into account when planning for long-term revenue."
    },
    {
      id: "Q17",
      question: "What types of medical institutions exist in Japan?",
      answer: "In Japan, the healthcare system is primarily structured around a two-tier model consisting of hospitals (70%) and clinics (30%). Hospitals have 20+ beds; clinics have fewer than 20 and are often privately operated."
    },
    {
      id: "Q18",
      question: "How do patients in Japan choose medical institutions?",
      answer: "Patients can freely choose and directly access clinics and hospitals without referral letters. There is no strong gatekeeper system, so patients often go straight to specialists or large hospitals."
    },
    {
      id: "Q19",
      question: "What is the number of hospital beds and the availability of medical equipment (such as MRI machines) in Japan?",
      answer: "Japan has a very high number of hospital beds per capita and a high availability of MRI machines and usage frequency compared with many countries. These factors can matter in study design and targeting."
    },
    {
      id: "Q20",
      question: "Is there a formal system for general practitioners (GPs) or general medicine physicians in Japan?",
      answer: "It is still developing compared with Western countries. A board certification in general medicine exists but comprehensive primary care across domains is still relatively uncommon."
    },
    {
      id: "Q21",
      question: "How are medical specialties categorized in Japan?",
      answer: "Specialties are defined around 19 core categories by MHLW (e.g., internal medicine, surgery, pediatrics, psychiatry, anesthesiology, radiology, general medicine, etc.), plus many sub-specialties. Always verify that an overseas specialty label exists in Japan before recruiting."
    },
    {
      id: "Q22",
      question: "Are there any distinctive features in the Japanese system for medical licensing and board certification?",
      answer: "Board certification is optional. As long as a physician holds a medical license, they may claim practice in a specialty. Therefore, “board-certified only” recruitment can be impractical; confirm qualifications upfront."
    },
    {
      id: "Q23",
      question: "Do physicians in Japan see a high number of patients or handle a large number of consultations per doctor?",
      answer: "Yes. Physicians handle many outpatient visits annually and wear multiple hats (consults, paperwork, meetings). Scheduling research often requires flexibility due to limited free time."
    },
    {
      id: "Q24",
      question: "Do patients in Japan visit medical institutions frequently?",
      answer: "Yes. Average annual outpatient visits per person are high (about twice the OECD average). Short prescription durations and free access contribute to frequent visits and multi-institution pathways."
    },
    {
      id: "Q25",
      question: "Are consultation times for doctors in Japan short? If so, why?",
      answer: "Yes—often around 3–5 minutes per outpatient. The fee-for-service system incentivizes seeing many patients. Surveys and detail aids should be concise and to the point."
    },
    {
      id: "Q26",
      question: "Are there differences in workload between hospital-based and clinic-based physicians?",
      answer: "Hospital physicians generally work longer hours and take night shifts; clinic physicians often have more control over schedules. This affects recruitment strategy and availability."
    },
    {
      id: "Q27",
      question: "Which physicians are responsible for treating cancer patients in Japan?",
      answer: "There are relatively few medical oncologists; organ-specific surgeons and specialists often manage from surgery through chemotherapy, providing continuity of care."
    },
    {
      id: "Q28",
      question: "What is the current situation regarding the number and role of medical oncologists in Japan?",
      answer: "Medical oncologist certification began in 2006; numbers remain limited. They tend to handle newer therapies and complex cases."
    },
    {
      id: "Q29",
      question: "Which hospitals or medical institutions play a central role in cancer care in Japan?",
      answer: "Designated Cancer Care Hospitals, university hospitals, and the National Cancer Center are central; they also act as hubs for clinical trials and new therapy adoption."
    },
    {
      id: "Q30",
      question: "What is the process and characteristics of the adoption of new cancer drugs in Japan?",
      answer: "Following PMDA approval, there is typically an EPPV period (~6 months). Physicians tend to wait for guideline inclusion and real-world experience at major hospitals before broad adoption."
    },

    /* —— Q31〜Q68：先に共有した内容を統合 —— */
    {
      id: "Q31",
      question: "How much importance do Japanese physicians place on clinical guidelines?",
      answer: "Japanese physicians place great importance on clinical guidelines… only treatments in accordance with the guidelines are eligible for reimbursement."
    },
    {
      id: "Q32",
      question: "Are physicians in Japan generally willing to participate in research or surveys?",
      answer: "Yes, if clearly positioned as research (not promotion), with anonymization and purpose explained."
    },
    {
      id: "Q33",
      question: "How should the survey duration and format be designed?",
      answer: "Online: 20–30 mins. Interviews: 60–90 mins. Online formats are preferred for convenience."
    },
    {
      id: "Q34",
      question: "Is localization necessary for Japanese participants?",
      answer: "Yes. Natural Japanese, domestic drug names, and local units (e.g., mg/dL) are must-haves."
    },
    {
      id: "Q35",
      question: "Is it acceptable for physicians to receive honoraria?",
      answer: "Yes—standard and ethically acceptable in Japan when framed as fair compensation for time/expertise."
    },
    {
      id: "Q36",
      question: "Typical range of honoraria?",
      answer: "30min: JPY 10,000–15,000 / 60min: JPY 20,000–30,000 / Quant: several thousand JPY depending on time."
    },
    {
      id: "Q37",
      question: "Any preferences regarding payment methods in Japan?",
      answer: "Yes. Honoraria are commonly paid via gift certificates (e.g., Amazon), cash, or bank transfer. Checks are uncommon. Confirm in advance whether a receipt or statement is needed and clearly explain how payment will be delivered."
    },
    {
      id: "Q38",
      question: "What manners and cultural considerations should be observed when meeting physicians?",
      answer: "Use respectful language (address them as “sensei”), be punctual, and avoid cancellations. Professional courtesy and time discipline are expected regardless of compensation."
    },
    {
      id: "Q39",
      question: "Are patients generally reluctant to participate in surveys?",
      answer: "Japanese patients are privacy-conscious. To reduce hesitation, clearly state anonymity, that no personally identifiable information will be collected, and that data will be used only for statistical purposes."
    },
    {
      id: "Q40",
      question: "How should highly sensitive or privacy-related questions be handled?",
      answer: "Ask only when necessary, make them optional, and provide a “Prefer not to answer” choice. Forcing sensitive questions can increase refusals and degrade data quality."
    },
    {
      id: "Q41",
      question: "What age groups are most common in patient surveys?",
      answer: "For lifestyle-related or chronic diseases, respondents are often in their 60s–70s and older. Design with readability, comprehension, and response burden in mind."
    },
    {
      id: "Q42",
      question: "What adaptations help when surveying elderly patients?",
      answer: "Use larger fonts, simplify wording, and recommend desktop/laptop screens. Offer paper or telephone options when needed. Family or caregiver support may be necessary."
    },
    {
      id: "Q43",
      question: "What other considerations matter in patient surveys?",
      answer: "Because financial barriers are relatively low, non-economic burdens—time, crowded facilities, need for accompaniment—often dominate. Safety, efficacy, and fit with daily life are highly valued."
    },
    {
      id: "Q44",
      question: "What are the main channels for patient recruitment?",
      answer: "Primarily: (1) online patient panels run by agencies and (2) social media (disease hashtags, patient influencers, communities). Posts must comply with the PMD Act and protect privacy."
    },
    {
      id: "Q45",
      question: "What roles do pharmacists play in Japan?",
      answer: "Pharmacists provide medication guidance and adherence support but do not have prescribing rights. With the separation of prescribing and dispensing, their patient-facing role has expanded."
    },
    {
      id: "Q46",
      question: "What is the role of nurses in Japan?",
      answer: "Nurses deliver daily care, patient education, and physician support. They generally do not prescribe or make independent treatment decisions. Nurse practitioner roles remain limited."
    },
    {
      id: "Q47",
      question: "Are patient associations active?",
      answer: "Yes, though typically smaller in scale than in the U.S./Europe. Many focus on rare diseases, providing peer support and information, and sometimes collaborate on awareness and recruitment."
    },
    {
      id: "Q48",
      question: "How strict are ethics and privacy rules for recruitment?",
      answer: "Very strict. Direct access to hospital patient lists is generally not permitted. Recruitment must follow the Personal Information Protection Law and ethics guidelines; anonymity and informed consent are mandatory."
    },
    {
      id: "Q49",
      question: "Can recruiters contact patients directly from hospital databases?",
      answer: "No. Contact typically goes through attending physicians or voluntary opt-in via patient associations or social media. Hospitals rarely allow direct researcher access to databases."
    },
    {
      id: "Q50",
      question: "Are incentives commonly used in patient research?",
      answer: "Yes, within reasonable limits. Cash, gift cards, or points are acceptable. Emphasize that participation is voluntary and incentives are tokens of appreciation, not coercive."
    },
    {
      id: "Q51",
      question: "Which regulations govern patient research?",
      answer: "Market research must comply with the PMD Act, the Personal Information Protection Law, and ESOMAR/JMRA codes. Clinical trials follow GCP. Even non-interventional surveys should adhere to strict ethical standards."
    },
    {
      id: "Q52",
      question: "What cultural barriers affect patient recruitment?",
      answer: "Modesty and strong privacy norms. Build trust via physicians, provide clear, transparent explanations, and avoid stigmatizing language."
    },
    {
      id: "Q53",
      question: "Typical dropout risks in patient surveys?",
      answer: "Excessive length, sensitive mandatory items, and high effort (travel, long calls). Keep surveys concise, optionalize sensitive items, and simplify participation."
    },
    {
      id: "Q54",
      question: "What is the general health literacy level?",
      answer: "Moderate to high overall, but avoid jargon. Use plain Japanese and test materials with native speakers when possible."
    },
    {
      id: "Q55",
      question: "How should materials be translated for patients?",
      answer: "Use natural Japanese, avoid literal translations, and prefer common Japanese disease names over Latin terms. Pre-test translations."
    },
    {
      id: "Q56",
      question: "How to handle sensitive conditions (oncology, mental health, HIV)?",
      answer: "Prioritize anonymity and voluntariness, use non-stigmatizing language, and recruit through trusted channels (physicians, NGOs, patient groups). Keep incentives reasonable."
    },
    {
      id: "Q57",
      question: "Are online patient communities influential?",
      answer: "Yes—especially for rare diseases and younger patients. Useful for recruitment but require careful, compliant communication."
    },
    {
      id: "Q58",
      question: "Do patients prefer online or offline formats?",
      answer: "Younger patients are comfortable online; many elderly participants prefer paper, telephone, or in-person. Offering flexible options improves inclusiveness."
    },
    {
      id: "Q59",
      question: "Are caregivers important in research?",
      answer: "Yes. Caregivers often accompany elderly/seriously ill patients and play a major role in decisions. Their perspectives are valuable, especially in dementia, oncology, and chronic disease."
    },
    {
      id: "Q60",
      question: "How should caregiver involvement be reflected in surveys?",
      answer: "Allow caregiver responses when patients cannot answer fully, and clearly indicate whether responses are from the patient or caregiver to ensure correct interpretation."
    },
    {
      id: "Q61",
      question: "Are there regional differences in healthcare access?",
      answer: "Yes. Urban areas have better access to advanced hospitals/specialists; rural areas face physician shortages and longer travel. Telemedicine is expanding but still limited."
    },
    {
      id: "Q62",
      question: "How common is telemedicine?",
      answer: "Expanded since COVID-19 with relaxed rules for online consults/prescriptions, but adoption remains modest. Face-to-face is still preferred by many; reimbursement is evolving."
    },
    {
      id: "Q63",
      question: "What is the role of community pharmacies?",
      answer: "They dispense, provide drug counseling, manage medication history, monitor adherence, and collaborate with physicians. Their importance has grown with the separation of prescribing and dispensing."
    },
    {
      id: "Q64",
      question: "Are traditional medicines (Kampo) used?",
      answer: "Yes. Many Kampo formulas are covered by national insurance and used alongside Western medicines, especially in internal medicine, gynecology, and geriatrics."
    },
    {
      id: "Q65",
      question: "How are new drugs priced?",
      answer: "After approval, official reimbursement prices are set by MHLW/Chuikyo based on international references, comparators, and clinical value. Companies cannot freely set prices; revisions occur every two years."
    },
    {
      id: "Q66",
      question: "How is medical device adoption regulated?",
      answer: "Devices require PMDA approval for safety/efficacy; reimbursement is then set by MHLW/Chuikyo. Hospital adoption depends on physician demand, budgets, and reimbursement status."
    },
    {
      id: "Q67",
      question: "Main challenges for foreign entrants?",
      answer: "Stringent regulation, complex pricing, language/cultural barriers, and long decision cycles. Success requires local partnerships, KOL engagement, Japanese localization, and patience."
    },
    {
      id: "Q68",
      question: "Key success factors for market research in Japan?",
      answer: "Natural Japanese questionnaires, culturally sensitive recruitment, strict privacy compliance, appropriate honoraria, respect for time, and strong quality control. Trust-building at every stage is essential."
    }
  ];

  // 既存の window.FAQS に結合（重複が嫌なら事前に削除ロジックを入れてもOK）
  window.FAQS = window.FAQS.concat(FAQS);
})();

/* ============================================
   faqs.js  （保存先：data/faqs.js）
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
      answer: "In Japan, the healthcare system is primarily structured around a two-tier model consisting of hospitals (70%) and clinics (30%, also referred to as \\\"shinryojo\\\").\\n• Hospitals: These are relatively large-scale medical institutions with inpatient facilities of 20 beds or more.\\n• Clinics/Shinryojo: These have fewer than 20 beds and are often privately operated by individual physicians. They are commonly found in local neighborhoods and provide primary care and routine medical services.\\nUnlike countries such as the United States or Germany, Japan has fewer mid-sized regional medical centers and a higher number of small-scale facilities. This decentralized distribution of medical functions across facilities is a unique characteristic of Japan's system, but it also presents challenges in terms of integrated healthcare management."
    },
    {
      id: "Q18",
      question: "How do patients in Japan choose medical institutions?",
      answer: "Patients in Japan have the freedom to choose hospitals and clinics and can consult them directly without a referral letter. Clinics primarily handle primary care (initial consultations), but patients can also directly access hospitals for more serious conditions based on their own judgment. In some regions, university hospitals and similar institutions offer outpatient services, and many patients seek direct consultations with highly specialized physicians. Unlike in Western countries, Japan does not have a formal \\\"gatekeeper system\\\" where patients must sequentially consult a family doctor, then a specialist, and finally a large hospital."
    },
    {
      id: "Q19",
      question: "What is the number of hospital beds and the availability of medical equipment (such as MRI machines) in Japan?",
      answer: "Japan has an exceptionally high number of hospital beds per capita—more than four times that of the United States. The number of installed MRI machines and the frequency of MRI examinations are also remarkable: approximately eight times higher than in the UK and 1.3 times higher than in the US, making Japan one of the world leaders in both the prevalence and utilization of medical equipment. When conducting research, factors such as hospital size (number of beds) and the availability of medical equipment may serve as important criteria in study design."
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
      answer: "Yes, the number is high even by international standards. In Japan, physicians typically handle a wide range of tasks themselves—including consultations, paperwork, meetings, teaching, and emergency care—without task specialization. This creates an environment where the workload tends to be highly concentrated.\\nAnnual number of outpatient visits per physician:\\n• USA: approx. 1,538 cases/physician\\n• Japan: approx. 5,333 cases/physician\\nNote: Japanese physicians often operate in a system where they must see many patients simultaneously. As a result, they often have limited availability to participate in research, so flexibility in scheduling is essential when engaging them in interviews or surveys."
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
      answer: "In Japan, there are relatively few medical oncologists. Instead, organ-specific surgeons (such as breast surgeons, gastrointestinal surgeons, or urologists) are often responsible for the entire treatment process, from surgery to chemotherapy. As a result, patients usually receive continuous care from the same specialist throughout their treatment, which is regarded as enhancing continuity of care and providing patients with a greater sense of reassurance."
    },
    {
      id: "Q28",
      question: "What is the current situation regarding the number and role of medical oncologists in Japan?",
      answer: "Certification for medical oncologists began in 2006, but as of 2020 there are only about 1,455 specialists nationwide, and many hospitals still do not have them. As a result, medical oncologists in Japan mainly handle new therapies (such as immunotherapy and molecular targeted agents) and complex cases."
    },
    {
      id: "Q29",
      question: "Which hospitals or medical institutions play a central role in cancer care in Japan?",
      answer: "Cancer care in Japan is centered around \"Designated Cancer Care Hospitals\" specified by the Ministry of Health, Labour and Welfare, as well as university hospitals and the National Cancer Center. There are 393 such facilities nationwide, providing advanced and specialized cancer care, and they also function as hubs for clinical trials and the introduction of new therapies."
    },
    {
      id: "Q30",
      question: "What is the process and characteristics of the adoption of new cancer drugs in Japan?",
      answer: "After approval by the PMDA (Pharmaceuticals and Medical Devices Agency), new drugs undergo an approximately six-month post-marketing surveillance period (EPPV: Early Post-marketing Phase Vigilance) before being widely adopted. Japanese physicians tend to be cautious about introducing new drugs, often waiting until they are reflected in clinical guidelines and until there is proven experience at major hospitals before broadly adopting them."
    },

    /* —— Q31〜Q68：先に共有した内容を統合 —— */
    {
      id: "Q31",
      question: "How much importance do Japanese physicians place on clinical guidelines?",
      answer: "Japanese physicians place great importance on clinical guidelines. In Japan, clinical guidelines are widely accepted as the standard for treatment, and therapies or off-label drug use outside the guidelines are rarely practiced. The main reason is that, under the national health insurance system, only treatments in accordance with the guidelines are eligible for reimbursement."
    },
    {
      id: "Q32",
      question: "Are physicians in Japan generally willing to participate in research or surveys?",
      answer: "Yes, physicians in Japan are generally open to participating in research. However, it must be clearly positioned as a study conducted for purely research purposes. To avoid being misunderstood as a sales or promotional activity, it is essential to clearly state that it is \"a market research study,\" \"data will be anonymized,\" and \"the purpose is to understand actual clinical practices.\" Even in studies sponsored by pharmaceutical companies, clearly separating the research from promotional activities is key to gaining physician trust."
    },
    {
      id: "Q33",
      question: "How should the survey duration and format be designed?",
      answer: "To minimize the burden on physicians, short and concise formats are preferred.\n• Online surveys: Recommended to be completed within 20-30 minutes\n• Interviews: Should be limited to 60–90 minutes (long interviews are often avoided)\n• Online formats (e.g., Zoom, Teams): These are well-received as they eliminate travel time and are easier for physicians to attend."
    },
    {
      id: "Q34",
      question: "Is localization necessary for Japanese participants?",
      answer: "Yes, localization is essential. Even for physicians, English-language surveys are generally not acceptable in Japan.\n• Questionnaires and instructions must be written in natural Japanese\n• Drug names: Use the Japanese generic or brand names commonly recognized domestically\n• Disease names and terminology: Prefer commonly used Japanese terms and abbreviations (e.g., RA, HbA1c)\n• Units: Match the standards used in Japan (e.g., mg/dL)"
    },
    {
      id: "Q35",
      question: "Is it acceptable for physicians to receive honoraria?",
      answer: "Yes, physicians in Japan are accustomed to receiving compensation for participating in research, and this practice is considered ethically acceptable. Providing honoraria is a common way to fairly compensate them for their expertise and time. Within Japan, the provision of honoraria is a standard practice in both the research and pharmaceutical industries."
    },
    {
      id: "Q36",
      question: "What is the typical range of honoraria for physician participation in research in Japan?",
      answer: "Honoraria vary depending on the survey format and required time, but for interviews, the general rate is \"several tens of thousands of yen per hour.\" Examples:\n• 30-minute interview: JPY 10,000–15,000\n• 60-minute interview: Around JPY 20,000–30,000\n• Quantitative surveys: Several thousand yen, depending on the time required to complete"
    },
    {
      id: "Q37",
      question: "Are there any specific characteristics or preferences regarding payment methods in Japan?",
      answer: "Yes. In Japan, honoraria are typically provided via gift certificates such as Amazon gift cards, cash or bank transfer; checks are not commonly used. It is important to confirm in advance whether a receipt or payment statement will be required after the payment. Additionally, providing a clear explanation (written or in advance) of how the honorarium will be delivered is highly appreciated in Japan, as it helps establish trust."
    },
    {
      id: "Q38",
      question: "What manners and cultural considerations should be observed when interviewing or meeting with physicians in Japan?",
      answer: "Physicians are regarded as highly respected professionals in Japanese society, rather than simply as service providers. It is essential to maintain a polite attitude and use respectful language (such as addressing them as \"sensei\") during interviews, regardless of whether an honorarium is provided. It is also important to avoid canceling appointments whenever possible and to be punctual, as high levels of respect and time discipline are expected at all times, regardless of compensation."
    },
    {
      id: "Q39",
      question: "Are patients in Japan generally reluctant to participate in surveys?",
      answer: "Yes, Japanese patients tend to be particularly sensitive about how their personal information is handled. They are cautious about providing sensitive data such as medical history or health conditions. Due to past large-scale data breaches in Japan, concerns about privacy remain strong.\nKey considerations for survey design: It is crucial to clearly state, from the recruitment stage:\n• \"Responses will be anonymous.\"\n• \"No personally identifiable information will be collected.\"\n• \"Data will be used for statistical purposes only.\"\nThese assurances are essential for earning trust and encouraging participation."
    },
    {
      id: "Q40",
      question: "How should highly sensitive or privacy-related questions be handled?",
      answer: "Avoid asking highly sensitive questions unless absolutely necessary, or clearly indicate that such questions are optional. Examples: Questions regarding household income, education background, or family structure may lead to refusals or dropouts if made mandatory. If you must ask them, include options like \"This question is optional\" or \"I don't know / Prefer not to answer.\"\nKey point: Japanese respondents tend to choose answers that avoid causing discomfort to others, so forcing sensitive questions may result in inaccurate or unreliable data."
    },
    {
      id: "Q41",
      question: "What age groups are most common in patient surveys?",
      answer: "In surveys related to lifestyle-related or chronic diseases, the primary respondents are typically elderly patients aged 60 to 70 and above. This is especially true in areas such as diabetes, hypertension, COPD, and cardiovascular diseases, where older adults are the main target group. When conducting research with elderly patients, it is essential to consider readability, comprehension, and response burden."
    },
    {
      id: "Q42",
      question: "What adaptations help when surveying elderly patients?",
      answer: "When designing surveys for elderly patients, several adaptations are essential:\n• Font size: Use larger fonts (14pt or larger) to improve readability\n• Language: Simplify wording and avoid complex medical jargon\n• Format preference: Recommend desktop or laptop screens over mobile devices for better visibility\n• Alternative formats: Offer paper-based surveys or telephone interviews as alternatives to online formats\n• Support system: Family members or caregivers may need to assist with completion\n• Time considerations: Allow extra time for completion and avoid lengthy surveys\n• Clear instructions: Provide step-by-step guidance and examples\nThese adaptations help ensure that elderly patients can participate meaningfully in research while reducing response burden and improving data quality."
    },
    {
      id: "Q43",
      question: "What other considerations matter in patient surveys?",
      answer: "Beyond economic factors, several key considerations significantly impact patient survey design and participation in Japan:\n• Non-economic burdens: Since financial barriers are relatively low due to universal health insurance, focus on time constraints, crowded medical facilities, and the need for accompaniment by family members\n• Treatment priorities: Patients highly value safety, efficacy, and how well treatments fit with their daily life routines\n• Convenience factors: Accessibility of medical facilities, waiting times, and scheduling flexibility\n• Quality of life impacts: How treatments affect work, family responsibilities, and social activities\n• Trust and reputation: Physician recommendations and institutional reputation carry significant weight\n• Side effect profiles: Detailed understanding of potential adverse effects and their management\n• Long-term sustainability: Whether treatments can be maintained over extended periods\nThese factors often outweigh cost considerations and should be thoroughly explored in patient research."
    },
    {
      id: "Q44",
      question: "What are the main channels for patient recruitment?",
      answer: "The primary channels for patient recruitment in Japan include:\n\n1. Online patient panels: Managed by specialized market research agencies with pre-screened patient databases\n\n2. Social media platforms:\n   • Disease-specific hashtags and communities\n   • Patient influencers and advocates\n   • Support group networks\n   • Healthcare-focused social platforms\n\n3. Healthcare provider networks:\n   • Physician referrals (with proper consent)\n   • Hospital bulletin boards and waiting areas\n   • Clinic partnerships\n\n4. Patient associations and NGOs:\n   • Disease-specific patient organizations\n   • Rare disease foundations\n   • Support groups\n\nImportant compliance requirements:\n• All communications must comply with the PMD Act (Pharmaceutical and Medical Device Act)\n• Strict privacy protection measures must be implemented\n• Clear informed consent processes are mandatory\n• Anonymity must be guaranteed throughout the process\n• Recruitment messages must avoid promotional language and focus on research objectives"
    },
    {
      id: "Q45",
      question: "What roles do pharmacists play in Japan?",
      answer: "Pharmacists in Japan play increasingly important roles in healthcare delivery, particularly following the policy of separating prescribing and dispensing functions:\n\nCore responsibilities:\n• Medication dispensing and preparation\n• Drug information and counseling services\n• Medication adherence monitoring and support\n• Drug interaction checking and management\n• Side effect monitoring and reporting\n\nExpanded patient-facing roles:\n• Medication therapy management\n• Patient education on proper drug use\n• Health promotion and disease prevention counseling\n• Coordination with physicians on medication optimization\n• Home healthcare support services\n\nLimitations:\n• No prescribing rights (unlike some Western countries)\n• Cannot independently change medication regimens\n• Must work within physician-prescribed parameters\n\nResearch implications:\n• Valuable source of real-world medication use data\n• Important stakeholders in adherence and outcomes research\n• Key informants for drug safety and effectiveness studies\n• Growing influence in patient care decisions and treatment pathways"
    },
    {
      id: "Q46",
      question: "What is the role of nurses in Japan?",
      answer: "Nurses in Japan fulfill essential healthcare roles, though with more limited scope compared to some Western countries:\n\nPrimary responsibilities:\n• Direct patient care and daily nursing interventions\n• Patient education and health instruction\n• Physician support and clinical assistance\n• Care coordination and patient advocacy\n• Family communication and support\n\nSpecialized functions:\n• Infection control and safety management\n• Medication administration and monitoring\n• Wound care and treatment procedures\n• Patient assessment and documentation\n• Discharge planning and follow-up coordination\n\nLimitations in scope:\n• No prescribing authority\n• Limited independent treatment decision-making\n• Nurse practitioner roles remain underdeveloped compared to US/UK models\n• Most clinical decisions require physician oversight\n\nResearch considerations:\n• Valuable source of patient care insights and outcomes data\n• Important stakeholders in treatment adherence and patient satisfaction studies\n• Key informants for understanding care delivery processes\n• Growing role in patient education and quality improvement initiatives"
    },
    {
      id: "Q47",
      question: "Are patient associations active?",
      answer: "Patient associations in Japan are active but have distinct characteristics compared to Western counterparts:\n\nScale and structure:\n• Generally smaller in scale than US/European organizations\n• More localized and community-focused approach\n• Often volunteer-driven with limited professional staff\n• Strong emphasis on consensus-building and group harmony\n\nPrimary focus areas:\n• Rare diseases and orphan conditions receive significant attention\n• Peer support and emotional assistance\n• Information sharing and educational activities\n• Advocacy for improved care and research funding\n\nKey activities:\n• Patient support meetings and conferences\n• Educational seminars and workshops\n• Awareness campaigns and public outreach\n• Collaboration with healthcare providers and researchers\n• Government advocacy and policy input\n\nResearch collaboration:\n• Increasingly willing to support recruitment efforts\n• Valuable partners for patient-reported outcome studies\n• Important stakeholders in drug development and clinical trials\n• Provide insights into unmet medical needs and patient priorities\n\nCultural considerations:\n• Emphasis on collective benefit over individual interests\n• Preference for respectful, consensus-based approaches\n• Strong focus on maintaining patient dignity and privacy"
    },
    {
      id: "Q48",
      question: "How strict are ethics and privacy rules for recruitment?",
      answer: "Ethics and privacy rules for patient recruitment in Japan are extremely strict and must be rigorously followed:\n\nKey regulatory frameworks:\n• Personal Information Protection Law (PIPL) - governs all personal data handling\n• PMD Act (Pharmaceutical and Medical Device Act) - regulates promotional activities\n• ESOMAR guidelines - international research standards\n• JMRA (Japan Marketing Research Association) codes\n\nMandatory requirements:\n• Comprehensive informed consent before any data collection\n• Complete anonymization of all participant data\n• Secure data storage and transmission protocols\n• Clear explanation of research purpose and data use\n• Right to withdraw participation at any time\n\nProhibited practices:\n• Direct access to hospital patient databases or lists\n• Unsolicited contact without prior consent\n• Collection of personally identifiable information beyond necessity\n• Sharing of data without explicit participant permission\n\nConsequences of violations:\n• Legal penalties under privacy laws\n• Reputation damage to research organizations\n• Potential criminal charges for serious breaches\n• Industry blacklisting and loss of research privileges\n\nBest practices:\n• Work with established research agencies familiar with regulations\n• Implement robust data security measures\n• Provide clear, comprehensive privacy notices\n• Regular compliance audits and staff training"
    },
    {
      id: "Q49",
      question: "Can recruiters contact patients directly from hospital databases?",
      answer: "No, direct contact from hospital databases is strictly prohibited and considered a serious violation of privacy laws in Japan.\n\nPermitted recruitment pathways:\n• Physician-mediated recruitment: Attending physicians can inform eligible patients about research opportunities\n• Voluntary opt-in systems: Patients can proactively express interest in research participation\n• Patient associations: Collaboration with disease-specific organizations for member outreach\n• Social media and public channels: Open recruitment through compliant advertising\n• Research registries: Pre-consented patient databases specifically created for research\n\nWhy direct database access is prohibited:\n• Violates Personal Information Protection Law\n• Breaches patient-hospital confidentiality\n• Lacks proper informed consent for research contact\n• Creates potential for coercive recruitment practices\n\nHospital policies:\n• Most hospitals have strict policies preventing researcher access to patient lists\n• Internal review boards (IRBs) typically reject proposals involving direct database access\n• Legal departments actively protect patient privacy rights\n\nRecommended approach:\n• Collaborate with healthcare providers to identify appropriate recruitment channels\n• Develop physician-friendly recruitment materials and processes\n• Ensure all recruitment complies with ethical guidelines and legal requirements\n• Focus on voluntary participation through trusted intermediaries"
    },
    {
      id: "Q50",
      question: "Are incentives commonly used in patient research?",
      answer: "Yes, incentives are commonly used and generally accepted in patient research, but must be carefully managed to ensure ethical compliance:\n\nAcceptable incentive types:\n• Cash payments (most straightforward and preferred)\n• Gift cards (Amazon, major retailers)\n• Points systems (for online panels)\n• Small gifts or tokens of appreciation\n• Charitable donations (on behalf of participants)\n\nTypical incentive ranges:\n• Short surveys (10-15 minutes): JPY 500-1,500\n• Longer surveys (30+ minutes): JPY 2,000-5,000\n• In-depth interviews (60-90 minutes): JPY 5,000-15,000\n• Complex studies or multiple sessions: Higher compensation may be appropriate\n\nEthical guidelines:\n• Incentives must be tokens of appreciation, not payment for participation\n• Amounts should not be coercive or unduly influential\n• Participation must remain genuinely voluntary\n• Clear disclosure that participants can withdraw without penalty\n\nCommunication requirements:\n• Clearly state that incentives are appreciation gestures\n• Emphasize voluntary nature of participation\n• Avoid language suggesting \"payment for services\"\n• Include information about tax implications if applicable\n\nBest practices:\n• Benchmark incentives against industry standards\n• Consider participant burden and time commitment\n• Ensure consistent application across all participants\n• Document incentive rationale for ethical review boards"
    },
    {
      id: "Q51",
      question: "Which regulations govern patient research?",
      answer: "Patient research in Japan is governed by multiple regulatory frameworks that must all be observed:\n\nPrimary Japanese regulations:\n• Personal Information Protection Law (PIPL): Governs all collection, use, and storage of personal information\n• PMD Act (Pharmaceutical and Medical Device Act): Regulates promotional activities and research by pharmaceutical/device companies\n• Medical Care Act: Establishes healthcare facility regulations and patient rights\n• Clinical Trials Act: Specific regulations for interventional clinical studies\n\nIndustry standards and codes:\n• ESOMAR Code: International marketing research standards\n• JMRA (Japan Marketing Research Association) Guidelines: National research standards\n• ICC/ESOMAR International Code: Global self-regulation for market research\n• Good Clinical Practice (GCP): For clinical trials and interventional studies\n\nEthical frameworks:\n• Declaration of Helsinki: Medical research ethics principles\n• Institutional Review Board (IRB) requirements\n• Informed consent protocols\n• Research ethics committee oversight\n\nCompliance requirements:\n• Even non-interventional market research surveys must adhere to strict ethical standards\n• All patient data must be handled with clinical-grade security\n• Transparent disclosure of research sponsors and objectives\n• Regular audit and monitoring of research practices\n\nPenalties for violations:\n• Legal sanctions under privacy laws\n• Professional sanctions from industry bodies\n• Reputational damage and loss of research privileges"
    },
    {
      id: "Q52",
      question: "What cultural barriers affect patient recruitment?",
      answer: "Several significant cultural barriers can impact patient recruitment in Japan and require careful consideration:\n\nPrivacy and modesty concerns:\n• Strong cultural norms around personal information sharing\n• Reluctance to discuss medical conditions openly\n• Preference for maintaining anonymity in research\n• Sensitivity about family medical history\n\nHierarchical healthcare relationships:\n• Deep respect for physician authority and recommendations\n• Reluctance to participate without explicit physician endorsement\n• Preference for institutional rather than individual researcher contact\n\nSocial harmony considerations:\n• Concern about being perceived as complaining or dissatisfied\n• Reluctance to express negative opinions about healthcare\n• Preference for group consensus over individual opinions\n\nStigma and shame concerns:\n• Particular sensitivity around mental health, addiction, and certain chronic diseases\n• Fear of social discrimination based on medical conditions\n• Concern about impact on family reputation\n\nTrust-building strategies:\n• Leverage physician relationships and endorsements\n• Provide clear, transparent explanations of research purpose and benefits\n• Use respectful, non-stigmatizing language throughout\n• Emphasize confidentiality and anonymity protections\n• Demonstrate institutional credibility and research credentials\n• Allow time for consideration and family consultation\n• Provide multiple communication channels and formats"
    },
    {
      id: "Q53",
      question: "Typical dropout risks in patient surveys?",
      answer: "Several factors commonly lead to patient survey dropout in Japan, requiring proactive mitigation strategies:\n\nMajor dropout risk factors:\n• Excessive survey length (>30 minutes significantly increases dropout)\n• Mandatory sensitive or personal questions\n• High participation burden (travel requirements, multiple contacts)\n• Complex or confusing question formats\n• Technical difficulties with online platforms\n• Lack of clear value proposition for participation\n\nSensitive topics that increase dropout:\n• Income and financial information\n• Family medical history\n• Mental health and psychiatric conditions\n• Sexual health and reproductive issues\n• Substance use and addiction\n\nMitigation strategies:\n• Keep surveys concise and focused (ideally <20 minutes)\n• Make sensitive questions optional with \"prefer not to answer\" options\n• Simplify participation processes and reduce burden\n• Provide clear progress indicators and time estimates\n• Offer multiple completion options (online, phone, paper)\n• Use respectful, culturally appropriate language\n• Provide technical support for online surveys\n\nBest practices for retention:\n• Send gentle reminder communications\n• Provide immediate feedback on completion status\n• Offer flexible scheduling for interviews\n• Ensure mobile-friendly survey designs\n• Test surveys with small pilot groups before full launch"
    },
    {
      id: "Q54",
      question: "What is the general health literacy level?",
      answer: "Health literacy levels in Japan are generally moderate to high, but vary significantly by demographic factors:\n\nOverall literacy characteristics:\n• High general education levels support good basic health understanding\n• Strong cultural emphasis on health maintenance and prevention\n• Widespread access to health information through media and healthcare system\n• Regular health checkups provide ongoing health education\n\nVariation by demographics:\n• Age: Younger populations tend to have higher health literacy, especially regarding new treatments\n• Education: University-educated individuals generally demonstrate higher health literacy\n• Urban vs. rural: Urban residents typically have better access to health information\n• Chronic conditions: Patients with long-term conditions often develop specialized knowledge\n\nChallenges in health communication:\n• Medical terminology: Even educated patients may struggle with complex medical jargon\n• English-derived terms: Many medical terms use katakana (foreign words) which can confuse some patients\n• Statistical concepts: Understanding of risk, probability, and clinical trial data varies widely\n\nBest practices for research materials:\n• Use plain, natural Japanese language\n• Avoid unnecessary medical jargon and technical terms\n• Provide clear definitions for essential medical concepts\n• Test all materials with native Japanese speakers before deployment\n• Include visual aids and examples where helpful\n• Consider offering materials at different complexity levels\n• Ensure cultural appropriateness of health concepts and examples"
    },
    {
      id: "Q55",
      question: "How should materials be translated for patients?",
      answer: "Translation of patient materials requires careful attention to cultural and linguistic nuances beyond literal conversion:\n\nKey translation principles:\n• Use natural, conversational Japanese rather than formal or academic language\n• Avoid direct literal translations that may sound unnatural or confusing\n• Adapt concepts to Japanese cultural context and healthcare system\n• Prioritize clarity and comprehension over technical precision\n\nMedical terminology guidelines:\n• Use commonly recognized Japanese disease names rather than Latin or English terms\n• Provide Japanese equivalents for drug names when available\n• Include both Japanese and romanized versions of key terms when necessary\n• Use measurement units and scales familiar to Japanese patients (e.g., mg/dL for glucose)\n\nCultural adaptation requirements:\n• Adjust examples and scenarios to reflect Japanese healthcare experiences\n• Consider family dynamics and decision-making processes\n• Respect cultural sensitivities around certain health topics\n• Use appropriate levels of formality and respect in language\n\nQuality assurance process:\n• Use qualified medical translators with healthcare research experience\n• Conduct back-translation to verify accuracy\n• Pre-test materials with representative patient groups\n• Review translations with native Japanese healthcare professionals\n• Pilot test with small patient samples before full deployment\n\nCommon translation pitfalls to avoid:\n• Overly technical or academic language\n• Direct translation of Western medical concepts\n• Inappropriate levels of formality\n• Cultural assumptions that don't apply in Japan"
    },
    {
      id: "Q56",
      question: "How to handle sensitive conditions (oncology, mental health, HIV)?",
      answer: "Research involving sensitive medical conditions requires exceptional care and specialized approaches in Japan:\n\nAnonymity and privacy protections:\n• Implement the highest level of data anonymization possible\n• Use double-coding systems to separate identity from responses\n• Avoid any personally identifiable information in survey data\n• Provide secure, encrypted platforms for online participation\n• Clear guarantees about data destruction timelines\n\nLanguage and communication:\n• Use respectful, non-stigmatizing terminology throughout\n• Avoid labels that may perpetuate social stigma\n• Focus on medical and research aspects rather than personal characteristics\n• Provide clear explanations of research benefits and social value\n\nTrusted recruitment channels:\n• Physician referrals from specialized clinics and hospitals\n• Collaboration with patient advocacy organizations and NGOs\n• Disease-specific patient support groups and communities\n• Mental health professionals and counseling centers\n• Specialized research institutions with established patient relationships\n\nEthical considerations:\n• Enhanced informed consent processes with detailed privacy explanations\n• Clear right to withdraw without any consequences\n• Provision of emotional support resources if needed\n• Regular check-ins during longitudinal studies\n• Reasonable but not excessive incentives to avoid coercion\n\nSpecial considerations by condition:\n• Oncology: Emphasize hope and treatment advancement goals\n• Mental health: Provide crisis support resources and professional contacts\n• HIV/AIDS: Address discrimination concerns and community benefit\n• Rare diseases: Highlight contribution to medical knowledge and future patient benefit"
    },
    {
      id: "Q57",
      question: "Are online patient communities influential?",
      answer: "Online patient communities have become increasingly influential in Japan's healthcare landscape, particularly in specific therapeutic areas:\n\nHigh-influence areas:\n• Rare diseases: Communities often serve as primary information and support networks\n• Chronic conditions: Long-term management support and experience sharing\n• Cancer care: Treatment information, emotional support, and advocacy\n• Mental health: Anonymous support and resource sharing\n• Pediatric conditions: Parent networks and family support systems\n\nCommunity characteristics:\n• Younger patients are more active in online communities\n• Strong emphasis on peer support and information sharing\n• High trust in community recommendations and experiences\n• Active role in raising awareness and advocacy\n• Growing influence on treatment decisions and healthcare choices\n\nPlatforms and channels:\n• Dedicated patient community websites and forums\n• Social media groups (Facebook, LINE, Twitter)\n• Disease-specific mobile applications\n• Healthcare provider-sponsored online communities\n• Professional association patient portals\n\nRecruitment opportunities:\n• Valuable channel for reaching engaged patient populations\n• High-quality participants who are knowledgeable about their conditions\n• Efficient recruitment for rare disease studies\n• Access to diverse geographic populations\n\nCompliance requirements:\n• All communications must comply with PMD Act regulations\n• Clear disclosure of research sponsorship and objectives\n• Respectful, non-promotional language\n• Community moderator approval and cooperation\n• Transparent informed consent processes\n• Regular monitoring of recruitment activities"
    },
    {
      id: "Q58",
      question: "Do patients prefer online or offline formats?",
      answer: "Patient format preferences in Japan vary significantly by demographic factors, requiring flexible research designs:\n\nAge-based preferences:\n• Younger patients (18-40): Comfortable with online formats, prefer mobile-friendly surveys\n• Middle-aged patients (41-65): Mixed preferences, often comfortable with both online and offline\n• Elderly patients (65+): Strong preference for paper, telephone, or in-person formats\n\nOnline format advantages:\n• Convenience and flexibility for completion timing\n• Lower cost and faster data collection\n• Built-in data validation and skip logic\n• Easier for working patients to participate\n• Better for sensitive topics due to perceived anonymity\n\nOffline format advantages:\n• Higher trust and comfort level for elderly participants\n• Personal interaction allows for clarification and support\n• Better completion rates for complex or lengthy surveys\n• Reduces digital divide exclusion\n• Allows for caregiver assistance when needed\n\nOptimal research strategy:\n• Offer multiple format options to maximize inclusiveness\n• Tailor recruitment messaging to demographic preferences\n• Ensure survey content is identical across formats\n• Provide technical support for online participants\n• Train interviewers for telephone and in-person formats\n\nSpecial considerations:\n• Mobile optimization essential for younger demographics\n• Large font options for elderly participants\n• Clear navigation and progress indicators\n• Backup offline options for online survey failures\n• Cultural preference for human interaction in healthcare contexts"
    },
    {
      id: "Q59",
      question: "Are caregivers important in research?",
      answer: "Caregivers play a crucial role in Japanese healthcare and research, particularly given cultural values around family involvement and an aging population:\n\nCritical importance in patient care:\n• Often accompany patients to medical appointments and consultations\n• Significant influence on treatment decisions and healthcare choices\n• Provide essential support for medication adherence and daily care\n• Serve as primary communication link between patients and healthcare providers\n• Cultural expectation of family involvement in health decisions\n\nKey research applications:\n• Dementia and cognitive impairment: Caregivers provide essential patient history and outcomes data\n• Oncology: Family members heavily involved in treatment decisions and quality of life assessments\n• Chronic diseases: Long-term management perspective and adherence support\n• Pediatric conditions: Parents are primary decision-makers and information sources\n• Mental health: Family perspective on symptoms, treatment response, and functioning\n\nValuable caregiver insights:\n• Real-world treatment effectiveness and side effects\n• Patient quality of life and functional status\n• Treatment burden and family impact\n• Healthcare system navigation challenges\n• Unmet needs and support requirements\n\nResearch design considerations:\n• Include caregiver perspectives in study objectives\n• Develop caregiver-specific outcome measures\n• Consider caregiver burden and compensation\n• Ensure informed consent covers both patient and caregiver participation\n• Address potential conflicts between patient and caregiver perspectives\n• Provide support resources for caregiver stress and burden"
    },
    {
      id: "Q60",
      question: "How should caregiver involvement be reflected in surveys?",
      answer: "Caregiver involvement in surveys requires careful design to ensure data quality and appropriate interpretation:\n\nResponse source identification:\n• Clearly identify whether responses come from patient, caregiver, or joint consultation\n• Use distinct response categories: \"Patient response,\" \"Caregiver response,\" \"Joint response\"\n• Track response source for each survey section or question set\n• Consider different validation approaches based on response source\n\nAppropriate caregiver response situations:\n• Cognitive impairment or dementia cases where patient cannot respond reliably\n• Severe illness limiting patient's ability to participate fully\n• Questions about caregiver burden and family impact\n• Healthcare utilization and cost information that caregivers manage\n• Medication adherence and side effects that caregivers observe\n\nSurvey design strategies:\n• Separate sections for patient-specific vs. caregiver-specific questions\n• Parallel instruments allowing both patient and caregiver perspectives\n• Joint completion options for shared decision-making topics\n• Clear instructions about when caregiver input is appropriate\n\nData analysis considerations:\n• Stratify results by response source when analyzing outcomes\n• Compare patient vs. caregiver perspectives on shared topics\n• Account for potential bias in caregiver-reported patient outcomes\n• Consider caregiver characteristics (relationship, involvement level) in analysis\n\nQuality assurance measures:\n• Validate caregiver responses against objective measures when possible\n• Cross-check consistency between patient and caregiver reports\n• Train research staff to appropriately guide response source decisions\n• Document rationale for caregiver involvement in each case"
    },
    {
      id: "Q61",
      question: "Are there regional differences in healthcare access?",
      answer: "Significant regional disparities exist in healthcare access across Japan, with important implications for research design and recruitment:\n\nUrban advantages (Tokyo, Osaka, major cities):\n• High concentration of advanced medical facilities and university hospitals\n• Easy access to medical specialists and subspecialists\n• Shorter wait times for advanced diagnostics and treatments\n• Greater availability of clinical trials and research opportunities\n• Multiple treatment options and second opinion access\n\nRural challenges (smaller towns, remote areas):\n• Severe physician shortages, especially specialists\n• Limited availability of advanced medical equipment (MRI, CT)\n• Longer travel distances to reach specialized care\n• Reduced access to emergency and intensive care services\n• Limited participation in clinical trials and research studies\n\nSpecific regional variations:\n• Northern regions (Hokkaido, Tohoku): Greater geographic isolation and weather-related access issues\n• Island regions (Okinawa, remote islands): Transportation barriers and limited specialty services\n• Mountainous areas: Physical access challenges and seasonal variations\n\nTelemedicine developments:\n• Rapid expansion since COVID-19 with relaxed regulatory restrictions\n• Growing acceptance for routine consultations and follow-up care\n• Still limited for initial diagnoses and hands-on examinations\n• Technology and connectivity barriers in some rural areas\n\nResearch implications:\n• Consider geographic stratification in study sampling\n• Account for travel burden in patient-reported outcome measures\n• Adapt recruitment strategies for different regional characteristics\n• Consider telemedicine options for remote participant inclusion\n• Factor regional differences into healthcare utilization analyses"
    },
    {
      id: "Q62",
      question: "How common is telemedicine?",
      answer: "Telemedicine adoption in Japan has accelerated significantly since COVID-19, though it remains more limited compared to some Western countries:\n\nCOVID-19 impact and regulatory changes:\n• Emergency relaxation of telemedicine regulations in 2020\n• Expanded coverage for online consultations and prescriptions\n• Simplified requirements for initial online consultations\n• Temporary suspension of face-to-face consultation requirements\n\nCurrent adoption levels:\n• Modest but growing usage across different medical specialties\n• Higher adoption in urban areas with better technology infrastructure\n• Particularly useful for routine follow-up consultations\n• Growing acceptance among younger patients and tech-savvy physicians\n\nCultural and practical barriers:\n• Strong cultural preference for face-to-face medical consultations\n• Physician comfort with physical examination and direct patient interaction\n• Patient expectations for comprehensive in-person care\n• Technology literacy barriers among elderly populations\n\nEvolving reimbursement landscape:\n• Gradual expansion of insurance coverage for telemedicine services\n• Ongoing policy discussions about long-term reimbursement rates\n• Variable coverage depending on medical condition and consultation type\n• Continuous evaluation of cost-effectiveness and quality outcomes\n\nResearch implications:\n• Consider telemedicine as recruitment and data collection option\n• Account for digital divide in patient access and participation\n• Evaluate differences in care patterns between telemedicine and traditional care\n• Monitor rapidly evolving regulatory and reimbursement environment"
    },
    {
      id: "Q63",
      question: "What is the role of community pharmacies?",
      answer: "Community pharmacies have evolved into essential healthcare partners in Japan, with expanded roles following the policy separation of prescribing and dispensing:\n\nCore pharmaceutical services:\n• Prescription dispensing and medication preparation\n• Drug information provision and patient counseling\n• Medication history management and electronic records\n• Drug interaction checking and safety monitoring\n• Medication adherence assessment and support\n\nExpanded healthcare functions:\n• Chronic disease management support and monitoring\n• Health screening services and basic health checks\n• Vaccination services (influenza, COVID-19, others)\n• Home healthcare support and medication delivery\n• Patient education and health promotion activities\n\nPhysician collaboration:\n• Regular communication about patient medication responses\n• Reporting of side effects and adherence issues\n• Recommendations for medication adjustments\n• Coordination of care for complex medication regimens\n• Shared electronic health records and medication databases\n\nPatient relationship building:\n• Consistent pharmacist-patient relationships over time\n• Accessible location in local communities\n• Extended hours compared to many medical facilities\n• Informal consultation and health advice\n\nResearch and data opportunities:\n• Rich source of real-world medication use data\n• Patient adherence and persistence information\n• Adverse event reporting and safety data\n• Healthcare utilization patterns and outcomes\n• Important stakeholder perspectives on drug effectiveness and safety\n\nGrowing strategic importance:\n• Key partners in medication therapy optimization\n• Essential role in aging society healthcare delivery\n• Increasing integration with digital health technologies"
    },
    {
      id: "Q64",
      question: "Are traditional medicines (Kampo) used?",
      answer: "Traditional Japanese medicine (Kampo) maintains a significant and unique position in Japan's modern healthcare system:\n\nIntegration with conventional medicine:\n• Many Kampo formulas are covered by national health insurance\n• Commonly used alongside Western pharmaceuticals (integrative approach)\n• Prescribed by conventional physicians rather than traditional healers\n• Available at regular pharmacies alongside conventional medications\n\nClinical applications:\n• Internal medicine: Digestive disorders, fatigue, and constitutional symptoms\n• Gynecology: Menstrual disorders, menopause, and pregnancy-related conditions\n• Geriatrics: Age-related symptoms and quality of life improvement\n• Psychiatry: Anxiety, depression, and sleep disorders\n• Oncology: Supportive care and side effect management\n\nPhysician prescribing patterns:\n• Approximately 80% of Japanese physicians prescribe Kampo medicines\n• Often used for symptoms difficult to treat with conventional medicine\n• Preferred for patients who prefer \"natural\" treatments\n• Used to minimize side effects or reduce conventional drug dependence\n\nRegulatory framework:\n• Standardized formulations regulated by PMDA\n• Quality control and safety monitoring similar to conventional drugs\n• Clinical evidence requirements for insurance coverage\n• Integration into medical education and clinical guidelines\n\nResearch implications:\n• Important to capture Kampo use in medication histories\n• Consider potential interactions with investigational treatments\n• Account for patient preferences for traditional vs. modern medicine\n• Include Kampo-prescribing physicians in research when relevant\n• Understand cultural significance and patient beliefs about traditional medicine"
    },
    {
      id: "Q65",
      question: "How are new drugs priced?",
      answer: "Drug pricing in Japan follows a complex, government-controlled process that significantly impacts market access and commercial viability:\n\nPricing authority and process:\n• Official reimbursement prices set by MHLW (Ministry of Health, Labour and Welfare)\n• Central Social Insurance Medical Council (Chuikyo) provides expert recommendations\n• Companies cannot independently set prices for reimbursed medications\n• Mandatory price determination before market launch\n\nPricing methodology factors:\n• International price reference: Comparison with prices in major markets (US, UK, Germany, France)\n• Similar drug comparisons: Pricing relative to existing therapies for the same indication\n• Clinical value assessment: Efficacy, safety, and quality of life improvements\n• Cost-effectiveness analysis: Economic value relative to existing treatments\n• Unmet medical need: Premium for addressing significant therapeutic gaps\n\nPricing revision schedule:\n• Regular revisions every two years (moving toward annual revisions)\n• Special price cuts for high-volume or rapid adoption drugs\n• Market expansion re-pricing when indications are added\n• Generic drug impact on branded drug pricing\n\nCommercial implications:\n• Price erosion over time is expected and systematic\n• Launch prices may not reflect long-term revenue potential\n• Volume-based pricing adjustments can significantly impact revenue\n• Limited ability to manage pricing through commercial strategies\n\nStrategic considerations for research:\n• Early health economic data collection is crucial\n• Comparative effectiveness research supports pricing negotiations\n• Real-world evidence can influence pricing decisions\n• Understanding physician and payer perspectives on value is essential\n• Long-term budget impact modeling required for reimbursement strategy"
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
    },
    {
      id: "Q69",
      question: "What are the best practices for conducting online surveys in Japan?",
      answer: "Use reputable Japanese panel providers (Macromill, Cross Marketing, etc.), ensure mobile-friendly design (70%+ access via mobile), keep surveys under 20 minutes, provide clear privacy policies in Japanese, offer appropriate incentives (points/cash), and test thoroughly with native speakers. Avoid matrix questions and ensure simple, clear navigation."
    },
    {
      id: "Q70",
      question: "How should I approach mixed-method research in Japan?",
      answer: "Start with qualitative research to understand cultural context and refine hypotheses. Use in-depth interviews (IDIs) for sensitive topics and focus groups for product feedback. Follow up with quantitative validation. Ensure seamless translation between phases and maintain consistency in terminology. Allow extra time for recruitment and translation between phases."
    },
    {
      id: "Q71",
      question: "What are typical response rates for healthcare surveys in Japan?",
      answer: "Online panels: 10-20% invitation response, 80-90% completion rate once started. Physician surveys: 5-10% for cold outreach, 20-30% with proper introduction. Patient surveys: 15-25% in clinical settings, higher with physician endorsement. Response rates improve significantly with appropriate honoraria and trusted intermediaries."
    },
    {
      id: "Q72",
      question: "How do I ensure quality in Japanese healthcare market research?",
      answer: "Use double-back translation for all materials, employ native Japanese project managers, implement rigorous data cleaning (remove speeders, straight-liners), conduct pilot testing with 5-10% of sample, monitor real-time for early issues, and validate responses with logic checks. Consider using attention check questions appropriately."
    },
    {
      id: "Q73",
      question: "What are the key differences in patient journey mapping in Japan?",
      answer: "Japanese patients often visit multiple specialists independently, have longer decision-making processes involving family, place high trust in physician recommendations, seek second opinions discretely, and may combine Western and traditional medicine. Document both formal and informal care pathways, including pharmacy consultations and health supplement use."
    },
    {
      id: "Q74",
      question: "How should I handle adverse event reporting in Japan research?",
      answer: "Establish clear protocols before research begins, train all staff on Japanese requirements, report to PMDA within required timeframes (15-30 days depending on severity), maintain detailed documentation in Japanese and English, coordinate with local ethics committees, and ensure proper informed consent includes AE reporting procedures."
    },
    {
      id: "Q75",
      question: "What are effective strategies for HCP engagement in Japan?",
      answer: "Build relationships through academic societies, leverage KOL introductions, provide value through educational content, respect hierarchical structures, schedule meetings well in advance, prepare detailed materials in Japanese, follow up with formal thank you notes, and maintain long-term relationships beyond single projects."
    },
    {
      id: "Q76",
      question: "How do I navigate hospital procurement processes for devices/drugs?",
      answer: "Understand the hospital formulary committee structure, identify key decision makers (pharmacy director, procurement, department heads), prepare health economics data for Japanese context, demonstrate local clinical evidence, provide comprehensive training materials, consider consignment sales models, and plan for 6-12 month adoption cycles."
    },
    {
      id: "Q77",
      question: "What digital health research considerations are unique to Japan?",
      answer: "High smartphone penetration but low app adoption for health, preference for hardware devices over software-only solutions, strict data localization requirements, need for integration with existing hospital systems, importance of user manuals and customer support in Japanese, and consideration of aging population's tech literacy."
    },
    {
      id: "Q78",
      question: "How should I approach rare disease research in Japan?",
      answer: "Leverage designated intractable disease system (330+ conditions), work with patient advocacy groups (many well-organized), utilize national registries when available, consider nationwide recruitment given small populations, ensure appropriate support for travel costs, and coordinate with specialized centers of excellence."
    },
    {
      id: "Q79",
      question: "What are best practices for medical writing and publication in Japan?",
      answer: "Follow Japanese medical writing conventions, submit to both international and domestic journals, present at Japanese academic conferences, translate key findings for local stakeholders, acknowledge Japanese co-authors appropriately, follow local guidelines for industry-sponsored research, and ensure proper disclosure of conflicts of interest."
    },
    {
      id: "Q80",
      question: "How do I manage multi-stakeholder research projects in Japan?",
      answer: "Establish clear governance structure respecting hierarchy, hold regular face-to-face meetings when possible, provide detailed written updates in Japanese, use consensus-building approach (nemawashi), allow time for internal consultations, document all decisions formally, and maintain consistent project management presence in Japan."
    },
    {
      id: "Q81",
      question: "What are the key differences in clinical trial regulations between Japan and other countries?",
      answer: "Japan's clinical trial regulations have unique characteristics:\n\n**Regulatory Framework:**\n• PMDA (Pharmaceuticals and Medical Devices Agency) oversees approvals\n• GCP (Good Clinical Practice) standards aligned with ICH but with local interpretations\n• J-GCP has specific requirements for document retention and monitoring\n\n**Key Differences:**\n• **Bridging Studies:** Often required to demonstrate efficacy/safety in Japanese population\n• **Phase I Requirements:** Must include Japanese subjects even for global programs\n• **Ethics Committees:** Hospital-specific IRBs rather than centralized review boards\n• **Documentation:** All essential documents must be in Japanese\n• **Informed Consent:** More detailed explanations expected, family involvement common\n\n**Timeline Implications:**\n• Longer startup times due to translation requirements\n• Site selection process can take 3-6 months\n• Contract negotiations often involve multiple departments\n• Protocol amendments require full re-review at each site\n\n**Cost Considerations:**\n• Higher per-patient costs than other Asian countries\n• Translation costs for all study materials\n• Local medical writing support often required\n• Site management fees separate from investigator fees"
    },
    {
      id: "Q82",
      question: "How do Japanese patients typically make treatment decisions?",
      answer: "Japanese patients follow distinctive decision-making patterns:\n\n**Family-Centered Approach:**\n• Family members heavily involved in major medical decisions\n• Spouse/adult children often attend consultations\n• Group consensus valued over individual autonomy\n• Information sometimes shared with family before patient\n\n**Doctor-Patient Dynamics:**\n• High deference to physician recommendations\n• Reluctance to question or seek second opinions\n• Trust-based relationships prioritized\n• Less likely to research conditions independently\n\n**Information Sources:**\n• Primary: Treating physician explanations\n• Secondary: Hospital-provided pamphlets\n• Limited use of online health resources\n• Peer experiences through patient associations\n\n**Cultural Factors:**\n• Preference for conservative treatment approaches\n• Concern about being a burden to family\n• Emphasis on quality of life over aggressive treatment\n• Stigma around certain conditions affects openness\n\n**Research Implications:**\n• Include questions about family involvement\n• Design recruitment materials for family review\n• Consider group interview formats\n• Account for indirect communication styles"
    },
    {
      id: "Q83", 
      question: "What digital health adoption trends should researchers understand?",
      answer: "Japan's digital health landscape presents unique opportunities and challenges:\n\n**Current Adoption Status:**\n• Slower adoption compared to other developed markets\n• Age-related digital divide significant\n• Smartphone penetration high but health app usage low\n• Privacy concerns limit data sharing willingness\n\n**Telemedicine Evolution:**\n• COVID-19 accelerated regulatory acceptance\n• Online consultations now reimbursable for certain conditions\n• Prescription delivery services expanding\n• Rural areas showing higher adoption rates\n\n**Electronic Health Records:**\n• Hospital EHR adoption >80% but limited interoperability\n• Patient portals uncommon\n• MyNumber health insurance integration progressing\n• Data standardization efforts ongoing\n\n**Wearables and Apps:**\n• Fitness trackers popular among younger demographics\n• Medical-grade devices require PMDA approval\n• Line (messaging app) used for appointment reminders\n• AI diagnosis tools gaining regulatory approval\n\n**Research Opportunities:**\n• Digital recruitment showing promise\n• ePRO (electronic patient-reported outcomes) acceptance growing\n• Remote monitoring for clinical trials expanding\n• Real-world data collection becoming feasible\n\n**Barriers to Consider:**\n• Elderly population needs non-digital alternatives\n• Technical support requirements high\n• Japanese language localization essential\n• Regulatory compliance for data handling strict"
    },
    {
      id: "Q84",
      question: "How should researchers approach rare disease studies in Japan?",
      answer: "Rare disease research in Japan requires specialized approaches:\n\n**Regulatory Framework:**\n• Orphan drug designation provides development incentives\n• SAKIGAKE designation for breakthrough therapies\n• Conditional early approval pathway available\n• Patient registry requirements for post-market surveillance\n\n**Patient Population Challenges:**\n• Definition: <50,000 patients in Japan (different from US/EU)\n• 333 designated intractable diseases with government support\n• Geographic dispersion of patients\n• Limited disease awareness even among physicians\n\n**Recruitment Strategies:**\n• Partner with patient advocacy groups (essential)\n• Leverage specialist centers and referral networks\n• Consider multi-center approaches\n• Utilize government intractable disease databases\n\n**Financial Support System:**\n• Government subsidies cover most treatment costs\n• Patients have designated medical certificates\n• Regular follow-ups at specialized centers\n• Travel support available for clinical trial participation\n\n**Study Design Considerations:**\n• Natural history studies often needed first\n• Registry-based trials increasingly accepted\n• International collaboration common\n• Compassionate use programs expected\n\n**Communication Approaches:**\n• Materials must be highly educational\n• Work closely with patient organizations\n• Provide genetic counseling resources\n• Consider family member involvement in recruitment"
    },
    {
      id: "Q85",
      question: "What are the implications of Japan's aging society for healthcare research?",
      answer: "Japan's super-aged society creates unique research considerations:\n\n**Demographic Reality:**\n• 29% of population over 65 (world's highest)\n• 2025: Baby boomers reach 75+\n• Shrinking working-age population\n• Rural areas experiencing severe aging\n\n**Healthcare System Adaptations:**\n• Integrated Community Care System development\n• Shift from cure to care focus\n• Prevention and health maintenance emphasis\n• Long-term care insurance system expansion\n\n**Research Focus Areas:**\n• Dementia and cognitive decline\n• Frailty and sarcopenia\n• Polypharmacy management\n• Care coordination technologies\n• Aging-in-place solutions\n\n**Study Design Challenges:**\n• Cognitive assessment requirements\n• Caregiver involvement necessary\n• Transportation barriers for site visits\n• Higher dropout rates\n• Comorbidity considerations\n\n**Recruitment Adaptations:**\n• Longer recruitment timelines\n• Simplified consent processes\n• Large-print materials standard\n• Phone screening preferred\n• Home visits may be necessary\n\n**Economic Implications:**\n• Cost-effectiveness crucial for reimbursement\n• Budget impact analysis mandatory\n• Healthcare resource utilization data critical\n• Quality of life measures prioritized\n• Caregiver burden assessments important"
    },
    {
      id: "Q86",
      question: "How do Japanese medical societies influence treatment practices?",
      answer: "Medical societies wield significant influence in Japan's healthcare ecosystem:\n\n**Role and Authority:**\n• Develop clinical practice guidelines\n• Set specialist certification standards\n• Influence reimbursement decisions\n• Shape medical education curriculum\n• Drive consensus on treatment approaches\n\n**Key Societies by Specialty:**\n• Japanese Society of Internal Medicine (largest)\n• Japan Medical Association (policy influence)\n• Specialty societies for each therapeutic area\n• Regional medical associations\n• Academic societies linked to universities\n\n**Guideline Development Process:**\n• Evidence-based but consensus-driven\n• Extensive peer review periods\n• Conservative approach to new therapies\n• Slow adoption of international guidelines\n• Japanese evidence weighted heavily\n\n**KOL Dynamics:**\n• University professors hold most influence\n• Hierarchical respect for senior members\n• Regional opinion leaders important\n• Young physicians rarely challenge consensus\n• International KOL connections valued\n\n**Market Access Implications:**\n• Society endorsement critical for adoption\n• Guidelines directly impact prescribing\n• Conference presentations drive awareness\n• Society journals preferred for publications\n• Educational programs through societies effective\n\n**Research Collaboration:**\n• Society registries valuable for RWE\n• Endorsement aids recruitment\n• Scientific committees review protocols\n• Publication support often provided"
    }
  ];

  // ===== Category auto-assignment =====
  // Assign categories to each FAQ entry if none are defined.
  // Categories are determined by matching keywords in the question and answer text.
  (function assignCategories() {
    // Define simple keyword rules for categories.
    const RULES = [
      {cat: 'Patients', keys: [/patient|caregiver|out-of-pocket|health checkup|respondent|patient research|health literacy|caregiver involvement/i]},
      {cat: 'HCP', keys: [/physician|doctor|KOL|honoraria|clinic|hospital physician|medical oncologist|guideline|specialties|board certification|general practitioner/i]},
      {cat: 'System', keys: [/insurance|reimbursement|Chuikyo|MHLW|PMDA|high\-cost|pricing|beds|MRI|free access|gatekeeper|private insurers/i]},
      {cat: 'Compliance', keys: [/ESOMAR|JMRA|PMD Act|Personal Information Protection|ethics|privacy|consent/i]},
      {cat: 'Fieldwork', keys: [/interview|survey|recruit|panel|online|participate|dropout|translation|format|questionnaire|study design/i]},
      {cat: 'Operations', keys: [/timeline|honoraria|payment method|workload|budget|procurement|adoption|hospital management|care pathway/i]},
      {cat: 'Timeline', keys: [/two years|every two years|annual|revisions|EPPV|period|schedule|deadline|time frame/i]}
    ];

    function categorize(item) {
      // If categories already exist and are non-empty, leave them untouched.
      if (Array.isArray(item.categories) && item.categories.length > 0) return;
      const text = ((item.question || '') + ' ' + (item.answer || '')).toLowerCase();
      const cats = [];
      for (const {cat, keys} of RULES) {
        if (keys.some(re => re.test(text))) cats.push(cat);
      }
      if (cats.length === 0) cats.push('Uncategorized');
      item.categories = cats;
    }
    FAQS.forEach(categorize);
  })();

  // 既存の window.FAQS に結合（重複が嫌なら事前に削除ロジックを入れてもOK）
  window.FAQS = window.FAQS.concat(FAQS);
})();
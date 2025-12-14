(function(global) {
  const SPECIALTY_DATA = [
    { code: 'BAS', name: '肥満症専門医', synonyms: ['肥満症専門医', '肥満症', '肥満'] },
    { code: 'CARD', name: '循環器科', synonyms: ['循環器科', '循環器内科', '循環器', '心臓内科'] },
    { code: 'DERM', name: '皮膚科', synonyms: ['皮膚科', '皮膚'] },
    { code: 'Endos', name: '内分泌科', synonyms: ['内分泌科', '内分泌内科', '内分泌・代謝内科', '内分泌代謝科', '糖尿病内科', '内分泌代謝'] },
    { code: 'Gastro', name: '消化器科', synonyms: ['消化器科', '消化器内科', '消化器'] },
    { code: 'GI Surgeon', name: '消化器外科', synonyms: ['消化器外科', '消化器外科医'] },
    { code: 'GYN', name: '産婦人科医', synonyms: ['産婦人科', '産婦人科医', '産婦'] },
    { code: 'HEM', name: '血液科・血液内科', synonyms: ['血液科', '血液内科', '血液'] },
    { code: 'HEPA', name: '肝臓専門医', synonyms: ['肝臓専門医', '肝臓内科', '肝臓', '肝'] },
    { code: 'IM', name: '内科（専門医）', synonyms: ['内科', '内科（専門医）', '一般内科'] },
    { code: 'NEPH', name: '腎臓内科医', synonyms: ['腎臓内科', '腎臓内科医', '腎臓', '腎'] },
    { code: 'NEURO', name: '神経内科', synonyms: ['神経内科', '神経科', '脳神経内科', '神経'] },
    { code: 'ONC', name: '腫瘍内科', synonyms: ['腫瘍内科', '腫瘍科', 'オンコロジー', '腫瘍', 'オンコ'] },
    { code: 'Opht', name: '眼科', synonyms: ['眼科', '眼科医', '眼'] },
    { code: 'ORTHO', name: '整形外科医', synonyms: ['整形外科', '整形外科医', '整形'] },
    { code: 'PATH', name: '病理学医', synonyms: ['病理学医', '病理'] },
    { code: 'PULMs', name: '呼吸器科', synonyms: ['呼吸器科', '呼吸器内科', '呼吸器'] },
    { code: 'Psych', name: '精神科', synonyms: ['精神科', '精神科医', '精神'] },
    { code: 'Rheum', name: 'リウマチ科', synonyms: ['リウマチ科', 'リウマチ'] },
    { code: 'URO', name: '泌尿器科', synonyms: ['泌尿器科', '泌尿器'] },
  ];

  const normalize = value => (value || '').toString().trim().toLowerCase();

  const codeIndex = {};
  const synonymIndex = {};
  const codeSynonyms = {};

  SPECIALTY_DATA.forEach(entry => {
    const normalizedCode = normalize(entry.code);
    codeIndex[normalizedCode] = entry.code;

    const synonyms = new Set();
    synonyms.add(normalize(entry.name));
    (entry.synonyms || []).forEach(synonym => synonyms.add(normalize(synonym)));

    codeSynonyms[entry.code] = Array.from(synonyms);

    synonyms.forEach(synonym => {
      if (!synonym) return;
      synonymIndex[synonym] = entry.code;
    });
  });

  function deriveCodeFromName(name) {
    const normalized = normalize(name);
    if (!normalized) {
      return null;
    }

    if (synonymIndex[normalized]) {
      return synonymIndex[normalized];
    }

    for (const [code, synonyms] of Object.entries(codeSynonyms)) {
      if (synonyms.some(syn => syn && (syn.includes(normalized) || normalized.includes(syn)))) {
        return code;
      }
    }

    return null;
  }

  function expandTerm(term) {
    const normalized = normalize(term);
    if (!normalized) {
      return [];
    }

    const expansions = new Set();

    const directCode = codeIndex[normalized];
    if (directCode) {
      expansions.add(normalize(directCode));
      codeSynonyms[directCode].forEach(syn => expansions.add(syn));
    }

    const directFromName = synonymIndex[normalized];
    if (directFromName) {
      expansions.add(normalize(directFromName));
      codeSynonyms[directFromName].forEach(syn => expansions.add(syn));
    }

    for (const [code, synonyms] of Object.entries(codeSynonyms)) {
      if (synonyms.some(syn => syn && (syn.includes(normalized) || normalized.includes(syn)))) {
        expansions.add(normalize(code));
        synonyms.forEach(synonym => expansions.add(synonym));
      }
    }

    return Array.from(expansions).filter(Boolean);
  }

  function matchesProject(project, term) {
    if (!project || term == null) {
      return false;
    }

    const normalizedTerm = normalize(term);
    if (!normalizedTerm) {
      return true;
    }

    const specialty = normalize(project.specialty);
    const specialtyCode = normalize(project.specialtyCode);

    if (specialty && specialty.includes(normalizedTerm)) {
      return true;
    }

    if (specialtyCode && specialtyCode.includes(normalizedTerm)) {
      return true;
    }

    const expansions = expandTerm(term);
    if (expansions.length > 0) {
      if (specialty && expansions.some(expanded => specialty.includes(expanded))) {
        return true;
      }
      if (specialtyCode && expansions.some(expanded => specialtyCode.includes(expanded))) {
        return true;
      }
    }

    const projectCode = deriveCodeFromName(project.specialty);
    if (projectCode) {
      const normalizedProjectCode = normalize(projectCode);
      if (normalizedTerm === normalizedProjectCode) {
        return true;
      }
      if (expansions.includes(normalizedProjectCode)) {
        return true;
      }
    }

    return false;
  }

  function getAbbreviationMap() {
    const map = {};
    SPECIALTY_DATA.forEach(entry => {
      map[entry.code] = entry.name;
    });
    return map;
  }

  function getSynonymMap() {
    const map = {};
    Object.entries(codeSynonyms).forEach(([code, synonyms]) => {
      map[code] = [...synonyms];
    });
    return map;
  }

  global.SpecialtyDictionary = {
    data: SPECIALTY_DATA.map(entry => ({
      code: entry.code,
      name: entry.name,
      synonyms: [...new Set([entry.name, ...(entry.synonyms || [])])],
    })),
    normalize,
    deriveCodeFromName,
    expandTerm,
    matchesProject,
    getAbbreviationMap,
    getSynonymMap,
  };
})(typeof window !== 'undefined' ? window : globalThis);

/**
 * Project Tracker - 専門科データ統一マスター
 * 
 * すべての専門科関連データを一元管理
 * 重複定義を排除し、保守性を向上
 */

const SPECIALTIES_MASTER = {
  /**
   * 専門科の完全定義
   * code: 一意識別子
   * ja: 日本語正式名称
   * en: 英語名称
   * abbr: 略語
   * category: カテゴリー分類
   * aliases: 別名・同義語
   * priority: 表示優先度
   * color: 表示色
   */
  data: [
    // === 内科系 ===
    {
      code: 'IM',
      ja: '内科',
      en: 'Internal Medicine',
      abbr: 'IM',
      category: '内科系',
      aliases: ['内科（専門医）', '一般内科', '総合内科'],
      priority: 10,
      color: '#3B82F6'
    },
    {
      code: 'CARD',
      ja: '循環器内科',
      en: 'Cardiology',
      abbr: 'CARD',
      category: '内科系',
      aliases: ['循環器科', '循環器', '心臓内科'],
      priority: 9,
      color: '#3B82F6'
    },
    {
      code: 'PULM',
      ja: '呼吸器内科',
      en: 'Pulmonology',
      abbr: 'PULMs',
      category: '内科系',
      aliases: ['呼吸器科', '呼吸器'],
      priority: 9,
      color: '#3B82F6'
    },
    {
      code: 'GASTRO',
      ja: '消化器内科',
      en: 'Gastroenterology',
      abbr: 'Gastro',
      category: '消化器系',
      aliases: ['消化器科', '消化器', '胃腸科'],
      priority: 9,
      color: '#10B981'
    },
    {
      code: 'NEPH',
      ja: '腎臓内科',
      en: 'Nephrology',
      abbr: 'NEPH',
      category: '内科系',
      aliases: ['腎臓内科医', '腎臓科', '腎臓', '腎'],
      priority: 8,
      color: '#3B82F6'
    },
    {
      code: 'ENDO',
      ja: '内分泌内科',
      en: 'Endocrinology',
      abbr: 'Endos',
      category: '内科系',
      aliases: ['内分泌科', '内分泌・代謝内科', '内分泌代謝科', '糖尿病内科', '内分泌代謝'],
      priority: 8,
      color: '#3B82F6'
    },
    {
      code: 'HEM',
      ja: '血液内科',
      en: 'Hematology',
      abbr: 'HEM',
      category: '内科系',
      aliases: ['血液科', '血液科・血液内科', '血液'],
      priority: 7,
      color: '#3B82F6'
    },
    {
      code: 'RHEUM',
      ja: 'リウマチ科',
      en: 'Rheumatology',
      abbr: 'Rheum',
      category: '内科系',
      aliases: ['リウマチ内科', 'リウマチ膠原病内科', 'リウマチ'],
      priority: 7,
      color: '#3B82F6'
    },
    {
      code: 'ONC',
      ja: '腫瘍内科',
      en: 'Oncology',
      abbr: 'ONC',
      category: '内科系',
      aliases: ['腫瘍科', 'オンコロジー', '腫瘍', 'オンコ', '腫瘍治療科'],
      priority: 8,
      color: '#3B82F6'
    },
    
    // === 神経・精神系 ===
    {
      code: 'NEURO',
      ja: '脳神経内科',
      en: 'Neurology',
      abbr: 'NEURO',
      category: '神経・精神系',
      aliases: ['神経内科', '神経科', '神経', '脳神経科'],
      priority: 9,
      color: '#8B5CF6'
    },
    {
      code: 'PSYCH',
      ja: '精神科',
      en: 'Psychiatry',
      abbr: 'Psych',
      category: '神経・精神系',
      aliases: ['精神科医', '精神神経科', '精神', '心療内科'],
      priority: 8,
      color: '#8B5CF6'
    },
    
    // === 外科系 ===
    {
      code: 'SURG',
      ja: '外科',
      en: 'General Surgery',
      abbr: 'SURG',
      category: '外科系',
      aliases: ['一般外科', '総合外科'],
      priority: 8,
      color: '#EF4444'
    },
    {
      code: 'GI_SURG',
      ja: '消化器外科',
      en: 'GI Surgery',
      abbr: 'GI Surgeon',
      category: '外科系',
      aliases: ['消化器外科医', '胃腸外科'],
      priority: 8,
      color: '#EF4444'
    },
    {
      code: 'ORTHO',
      ja: '整形外科',
      en: 'Orthopedics',
      abbr: 'ORTHO',
      category: '外科系',
      aliases: ['整形外科医', '整形', '整形外科・リハビリテーション科'],
      priority: 8,
      color: '#EF4444'
    },
    {
      code: 'BREAST',
      ja: '乳腺外科',
      en: 'Breast Surgery',
      abbr: 'BREAST',
      category: '外科系',
      aliases: ['乳腺科', '乳腺甲状腺外科', '乳腺'],
      priority: 8,
      color: '#EF4444'
    },
    {
      code: 'NS',
      ja: '脳神経外科',
      en: 'Neurosurgery',
      abbr: 'NS',
      category: '外科系',
      aliases: ['脳外科', '脳外', '脳神経'],
      priority: 7,
      color: '#EF4444'
    },
    {
      code: 'CVS',
      ja: '心臓血管外科',
      en: 'Cardiovascular Surgery',
      abbr: 'CVS',
      category: '外科系',
      aliases: ['心臓外科', '血管外科', '心外'],
      priority: 7,
      color: '#EF4444'
    },
    
    // === 皮膚・泌尿器・感覚器系 ===
    {
      code: 'DERM',
      ja: '皮膚科',
      en: 'Dermatology',
      abbr: 'DERM',
      category: '感覚器系',
      aliases: ['皮膚', '皮膚科専門医'],
      priority: 8,
      color: '#F59E0B'
    },
    {
      code: 'URO',
      ja: '泌尿器科',
      en: 'Urology',
      abbr: 'URO',
      category: '泌尿器・生殖器系',
      aliases: ['泌尿器', '泌尿器科専門医'],
      priority: 7,
      color: '#06B6D4'
    },
    {
      code: 'OPHT',
      ja: '眼科',
      en: 'Ophthalmology',
      abbr: 'Opht',
      category: '感覚器系',
      aliases: ['眼科医', '眼'],
      priority: 7,
      color: '#F59E0B'
    },
    {
      code: 'ENT',
      ja: '耳鼻咽喉科',
      en: 'Otolaryngology',
      abbr: 'ENT',
      category: '感覚器系',
      aliases: ['耳鼻科', '耳鼻咽喉科・頭頸部外科', '耳鼻'],
      priority: 7,
      color: '#F59E0B'
    },
    
    // === 生殖器系 ===
    {
      code: 'GYN',
      ja: '産婦人科',
      en: 'Gynecology',
      abbr: 'GYN',
      category: '生殖器系',
      aliases: ['産婦人科医', '産科', '婦人科', '産婦'],
      priority: 7,
      color: '#EC4899'
    },
    
    // === 小児科系 ===
    {
      code: 'PED',
      ja: '小児科',
      en: 'Pediatrics',
      abbr: 'PED',
      category: '小児科系',
      aliases: ['小児科医', '小児'],
      priority: 8,
      color: '#14B8A6'
    },
    {
      code: 'PED_SURG',
      ja: '小児外科',
      en: 'Pediatric Surgery',
      abbr: 'PED_SURG',
      category: '小児科系',
      aliases: ['小児外科医'],
      priority: 6,
      color: '#14B8A6'
    },
    
    // === その他 ===
    {
      code: 'HEPA',
      ja: '肝臓専門医',
      en: 'Hepatology',
      abbr: 'HEPA',
      category: '消化器系',
      aliases: ['肝臓内科', '肝臓科', '肝臓', '肝'],
      priority: 7,
      color: '#10B981'
    },
    {
      code: 'BAS',
      ja: '肥満症専門医',
      en: 'Bariatric Medicine',
      abbr: 'BAS',
      category: '内科系',
      aliases: ['肥満症', '肥満'],
      priority: 5,
      color: '#3B82F6'
    },
    {
      code: 'PATH',
      ja: '病理診断科',
      en: 'Pathology',
      abbr: 'PATH',
      category: 'その他',
      aliases: ['病理学医', '病理', '病理科'],
      priority: 5,
      color: '#6B7280'
    },
    {
      code: 'RAD',
      ja: '放射線科',
      en: 'Radiology',
      abbr: 'RAD',
      category: 'その他',
      aliases: ['放射線診断科', '放射線治療科', '放射線'],
      priority: 6,
      color: '#6B7280'
    },
    {
      code: 'ANES',
      ja: '麻酔科',
      en: 'Anesthesiology',
      abbr: 'ANES',
      category: 'その他',
      aliases: ['麻酔科医', '麻酔'],
      priority: 6,
      color: '#6B7280'
    },
    {
      code: 'REHAB',
      ja: 'リハビリテーション科',
      en: 'Rehabilitation Medicine',
      abbr: 'REHAB',
      category: 'その他',
      aliases: ['リハビリ科', 'リハビリ', 'リハ科'],
      priority: 5,
      color: '#6B7280'
    },
    {
      code: 'ER',
      ja: '救急科',
      en: 'Emergency Medicine',
      abbr: 'ER',
      category: 'その他',
      aliases: ['救急医学科', '救命救急科', '救急'],
      priority: 7,
      color: '#DC2626'
    }
  ],

  /**
   * カテゴリー定義
   */
  categories: {
    '内科系': {
      icon: 'fa-stethoscope',
      color: '#3B82F6',
      priority: 1
    },
    '外科系': {
      icon: 'fa-user-md',
      color: '#EF4444',
      priority: 2
    },
    '消化器系': {
      icon: 'fa-heartbeat',
      color: '#10B981',
      priority: 3
    },
    '神経・精神系': {
      icon: 'fa-brain',
      color: '#8B5CF6',
      priority: 4
    },
    '感覚器系': {
      icon: 'fa-eye',
      color: '#F59E0B',
      priority: 5
    },
    '泌尿器・生殖器系': {
      icon: 'fa-venus-mars',
      color: '#06B6D4',
      priority: 6
    },
    '生殖器系': {
      icon: 'fa-baby',
      color: '#EC4899',
      priority: 7
    },
    '小児科系': {
      icon: 'fa-child',
      color: '#14B8A6',
      priority: 8
    },
    'その他': {
      icon: 'fa-hospital',
      color: '#6B7280',
      priority: 9
    }
  }
};

/**
 * ユーティリティ関数群
 */
const SpecialtyMaster = {
  /**
   * すべての専門科データを取得
   */
  getAllSpecialties() {
    return SPECIALTIES_MASTER.data;
  },

  /**
   * カテゴリー別に専門科を取得
   */
  getSpecialtiesByCategory(category) {
    return SPECIALTIES_MASTER.data.filter(s => s.category === category);
  },

  /**
   * コードから専門科を取得
   */
  getSpecialtyByCode(code) {
    return SPECIALTIES_MASTER.data.find(s => s.code === code);
  },

  /**
   * 名前から専門科を検索（別名も含む）
   */
  findSpecialtyByName(name) {
    if (!name) return null;
    const normalized = name.trim().toLowerCase();
    
    return SPECIALTIES_MASTER.data.find(s => {
      // 正式名称でマッチ
      if (s.ja.toLowerCase() === normalized) return true;
      if (s.en && s.en.toLowerCase() === normalized) return true;
      
      // 別名でマッチ
      if (s.aliases && s.aliases.some(alias => alias.toLowerCase() === normalized)) return true;
      
      return false;
    });
  },

  /**
   * 略語から専門科を取得
   */
  getSpecialtyByAbbr(abbr) {
    if (!abbr) return null;
    const normalized = abbr.trim().toUpperCase();
    return SPECIALTIES_MASTER.data.find(s => s.abbr.toUpperCase() === normalized);
  },

  /**
   * カテゴリーリストを取得（優先度順）
   */
  getCategories() {
    return Object.entries(SPECIALTIES_MASTER.categories)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([name, config]) => ({ name, ...config }));
  },

  /**
   * 専門科名を正規化
   */
  normalizeSpecialtyName(name) {
    const specialty = this.findSpecialtyByName(name);
    return specialty ? specialty.ja : name;
  },

  /**
   * オートコンプリート用データを生成
   */
  getAutocompleteData() {
    const items = [];
    
    SPECIALTIES_MASTER.data.forEach(specialty => {
      // メイン名称を追加
      items.push({
        value: specialty.ja,
        label: specialty.ja,
        category: specialty.category,
        code: specialty.code
      });
      
      // 別名も追加（重複除外）
      if (specialty.aliases) {
        specialty.aliases.forEach(alias => {
          if (alias !== specialty.ja) {
            items.push({
              value: alias,
              label: `${alias} (${specialty.ja})`,
              category: specialty.category,
              code: specialty.code
            });
          }
        });
      }
    });
    
    return items.sort((a, b) => a.value.localeCompare(b.value, 'ja'));
  },

  /**
   * 優先度順にソートされた専門科リストを取得
   */
  getSpecialtiesSorted() {
    return [...SPECIALTIES_MASTER.data].sort((a, b) => {
      // 優先度でソート（高い順）
      if (b.priority !== a.priority) return b.priority - a.priority;
      // 同じ優先度の場合は名前でソート
      return a.ja.localeCompare(b.ja, 'ja');
    });
  },

  /**
   * カテゴリーごとにグループ化された専門科を取得
   */
  getSpecialtiesGrouped() {
    const grouped = {};
    const categories = this.getCategories();
    
    categories.forEach(category => {
      grouped[category.name] = {
        ...category,
        specialties: this.getSpecialtiesByCategory(category.name)
          .sort((a, b) => b.priority - a.priority)
      };
    });
    
    return grouped;
  },

  /**
   * 検索用インデックスを生成
   */
  buildSearchIndex() {
    const index = {};
    
    SPECIALTIES_MASTER.data.forEach(specialty => {
      // コードでインデックス
      index[specialty.code.toLowerCase()] = specialty;
      
      // 日本語名でインデックス
      index[specialty.ja.toLowerCase()] = specialty;
      
      // 英語名でインデックス
      if (specialty.en) {
        index[specialty.en.toLowerCase()] = specialty;
      }
      
      // 略語でインデックス
      index[specialty.abbr.toLowerCase()] = specialty;
      
      // 別名でインデックス
      if (specialty.aliases) {
        specialty.aliases.forEach(alias => {
          index[alias.toLowerCase()] = specialty;
        });
      }
    });
    
    return index;
  }
};

// 検索用インデックスを事前構築
const SEARCH_INDEX = SpecialtyMaster.buildSearchIndex();

// 高速検索関数
SpecialtyMaster.quickSearch = function(query) {
  if (!query) return null;
  return SEARCH_INDEX[query.trim().toLowerCase()] || null;
};

// グローバルに公開
if (typeof window !== 'undefined') {
  window.SpecialtyMaster = SpecialtyMaster;
  window.SPECIALTIES_MASTER = SPECIALTIES_MASTER;
}

// CommonJSとES Modules両対応
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpecialtyMaster, SPECIALTIES_MASTER };
}
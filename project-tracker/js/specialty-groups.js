/**
 * 専門科カテゴリー定義
 * カテゴリー別に専門科を整理し、アコーディオン表示に対応
 */

// カテゴリー別の専門科マッピング
export const SPECIALTY_GROUPS = {
  '内科系': {
    icon: 'fa-stethoscope',
    color: '#3B82F6', // blue
    specialties: [
      '一般内科', '内科', '総合診療科', '総合内科',
      '腫瘍内科', '腫瘍治療科',
      '循環器内科', '循環器科',
      '呼吸器内科', '呼吸器科',
      '腎臓内科', '腎臓科',
      '老年科', '老年内科',
      '心療内科',
      'その他の内科'
    ],
    priority: ['腫瘍内科', '循環器内科', '呼吸器内科', '腎臓内科', '一般内科']
  },
  
  '外科系': {
    icon: 'fa-user-md',
    color: '#EF4444', // red
    specialties: [
      '外科',
      '乳腺外科', '乳腺科', '乳腺甲状腺外科',
      '消化器外科',
      '呼吸器外科',
      '心臓血管外科', '心臓外科',
      '肝胆膵外科',
      '整形外科',
      '形成外科', '美容外科',
      '脳神経外科',
      '小児外科',
      '口腔外科',
      '大腸肛門科',
      'その他の外科'
    ],
    priority: ['乳腺外科', '消化器外科', '呼吸器外科', '心臓血管外科', '整形外科']
  },
  
  '消化器系': {
    icon: 'fa-heartbeat',
    color: '#10B981', // green
    specialties: [
      '消化器内科', '消化器科',
      '消化器外科',
      '胃腸科',
      '肝胆膵外科',
      '大腸肛門科', '肛門科'
    ],
    priority: ['消化器内科', '消化器外科', '胃腸科']
  },
  
  '血液・内分泌・代謝': {
    icon: 'fa-flask',
    color: '#8B5CF6', // purple
    specialties: [
      '血液内科', '血液科',
      '内分泌内科', '内分泌科', '内分泌代謝内科', '内分泌代謝科',
      '糖尿病科', '糖尿病内科',
      '代謝内科',
      'リウマチ科',
      'アレルギー科'
    ],
    priority: ['血液内科', '内分泌内科', '糖尿病科', 'リウマチ科']
  },
  
  '神経・精神': {
    icon: 'fa-brain',
    color: '#F59E0B', // amber
    specialties: [
      '神経内科', '脳神経内科',
      '脳神経外科',
      '精神科',
      '心療内科'
    ],
    priority: ['神経内科', '脳神経外科', '精神科']
  },
  
  '感覚器': {
    icon: 'fa-eye',
    color: '#06B6D4', // cyan
    specialties: [
      '眼科',
      '耳鼻咽喉科', '耳鼻科',
      '気管食道科'
    ],
    priority: ['眼科', '耳鼻咽喉科']
  },
  
  '小児・産婦人科': {
    icon: 'fa-baby',
    color: '#EC4899', // pink
    specialties: [
      '小児科',
      '小児外科',
      '新生児科',
      '小児循環器科',
      '産婦人科', '産科', '婦人科'
    ],
    priority: ['小児科', '産婦人科', '婦人科']
  },
  
  '腎・泌尿器': {
    icon: 'fa-tint',
    color: '#14B8A6', // teal
    specialties: [
      '腎臓内科', '腎臓科',
      '腎移植科',
      '血液透析科',
      '泌尿器科',
      '皮膚泌尿器科'
    ],
    priority: ['腎臓内科', '泌尿器科']
  },
  
  'その他／横断': {
    icon: 'fa-hospital',
    color: '#6B7280', // gray
    specialties: [
      '救急科', '救急医学科',
      '麻酔科',
      '放射線科',
      '病理科',
      'リハビリテーション科',
      '緩和ケア科',
      '皮膚科',
      '性病科',
      '基礎医学系',
      'その他',
      'KOL'
    ],
    priority: ['救急科', '麻酔科', '放射線科', '病理科', 'リハビリテーション科']
  }
};

/**
 * 専門科名から所属カテゴリーを取得
 * @param {string} specialtyName - 専門科名
 * @returns {string|null} - カテゴリー名（見つからない場合はnull）
 */
export function getCategoryForSpecialty(specialtyName) {
  if (!specialtyName) return null;
  
  const normalized = specialtyName.trim();
  
  for (const [category, data] of Object.entries(SPECIALTY_GROUPS)) {
    if (data.specialties.includes(normalized)) {
      return category;
    }
  }
  
  return 'その他／横断'; // デフォルトカテゴリー
}

/**
 * カテゴリー内で専門科名を検索
 * @param {string} category - カテゴリー名
 * @param {string} query - 検索クエリ
 * @returns {Array<string>} - マッチした専門科名の配列
 */
export function searchSpecialtiesInCategory(category, query) {
  const data = SPECIALTY_GROUPS[category];
  if (!data) return [];
  
  const normalized = query.toLowerCase().trim();
  if (!normalized) return data.specialties;
  
  return data.specialties.filter(spec => 
    spec.toLowerCase().includes(normalized)
  );
}

/**
 * すべてのカテゴリーから専門科を検索
 * @param {string} query - 検索クエリ
 * @returns {Object} - カテゴリーごとのマッチ結果 { category: [specialties] }
 */
export function searchAllSpecialties(query) {
  const results = {};
  const normalized = query.toLowerCase().trim();
  
  for (const [category, data] of Object.entries(SPECIALTY_GROUPS)) {
    const matches = data.specialties.filter(spec =>
      spec.toLowerCase().includes(normalized)
    );
    
    if (matches.length > 0) {
      results[category] = matches;
    }
  }
  
  return results;
}

/**
 * カテゴリー内の優先表示する専門科を取得
 * @param {string} category - カテゴリー名
 * @param {number} limit - 最大表示数（デフォルト: 5）
 * @returns {Array<string>} - 優先表示する専門科名
 */
export function getPrioritySpecialties(category, limit = 5) {
  const data = SPECIALTY_GROUPS[category];
  if (!data) return [];
  
  return data.priority ? data.priority.slice(0, limit) : data.specialties.slice(0, limit);
}

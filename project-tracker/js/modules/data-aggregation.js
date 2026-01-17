/**
 * データ集計モジュール
 * @module data-aggregation
 */

/**
 * データ集計マネージャー
 */
export class DataAggregationManager {
  constructor(data = []) {
    this.data = data;
    this.cache = new Map();
  }

  /**
   * データをセット
   * @param {Array} data - プロジェクトデータ配列
   */
  setData(data) {
    this.data = data;
    this.cache.clear(); // キャッシュをクリア
  }

  /**
   * キャッシュキーを生成
   * @private
   */
  getCacheKey(method, ...args) {
    return `${method}:${JSON.stringify(args)}`;
  }

  /**
   * キャッシュから取得または計算
   * @private
   */
  getOrCompute(key, computeFn) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const result = computeFn();
    this.cache.set(key, result);
    return result;
  }

  /**
   * 総プロジェクト数を取得
   */
  getTotalProjects() {
    return this.data.length;
  }

  /**
   * 総リクルート数を取得
   */
  getTotalRecruits() {
    return this.getOrCompute('totalRecruits', () => {
      return this.data.reduce((sum, project) => {
        const count = parseInt(project['実績数'] || project.recruitCount || 0);
        return sum + (isNaN(count) ? 0 : count);
      }, 0);
    });
  }

  /**
   * 対象者種別ごとの集計
   */
  aggregateByTargetType() {
    return this.getOrCompute('byTargetType', () => {
      const result = {};
      
      this.data.forEach(project => {
        const targetType = project['対象者種別'] || project.targetType || 'その他';
        if (!result[targetType]) {
          result[targetType] = {
            count: 0,
            recruitCount: 0,
            projects: []
          };
        }
        result[targetType].count++;
        result[targetType].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
        result[targetType].projects.push(project);
      });
      
      return result;
    });
  }

  /**
   * 診療科ごとの集計
   */
  aggregateBySpecialty() {
    return this.getOrCompute('bySpecialty', () => {
      const result = {};
      
      this.data.forEach(project => {
        const specialty = project['専門'] || project.specialty;
        if (specialty) {
          if (!result[specialty]) {
            result[specialty] = {
              count: 0,
              recruitCount: 0,
              projects: []
            };
          }
          result[specialty].count++;
          result[specialty].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
          result[specialty].projects.push(project);
        }
      });
      
      return result;
    });
  }

  /**
   * 疾患名ごとの集計
   */
  aggregateByDisease() {
    return this.getOrCompute('byDisease', () => {
      const result = {};
      
      this.data.forEach(project => {
        const disease = project['疾患名'] || project.diseaseName;
        if (disease) {
          if (!result[disease]) {
            result[disease] = {
              count: 0,
              recruitCount: 0,
              projects: []
            };
          }
          result[disease].count++;
          result[disease].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
          result[disease].projects.push(project);
        }
      });
      
      return result;
    });
  }

  /**
   * クライアントごとの集計
   */
  aggregateByClient() {
    return this.getOrCompute('byClient', () => {
      const result = {};
      
      this.data.forEach(project => {
        const client = project['クライアント'] || project.client;
        if (client) {
          if (!result[client]) {
            result[client] = {
              count: 0,
              recruitCount: 0,
              projects: []
            };
          }
          result[client].count++;
          result[client].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
          result[client].projects.push(project);
        }
      });
      
      return result;
    });
  }

  /**
   * 実施年月ごとの集計
   */
  aggregateByDate() {
    return this.getOrCompute('byDate', () => {
      const result = {};
      
      this.data.forEach(project => {
        const date = project['実施年月'] || project.implementationDate;
        if (date) {
          // 年月のみ抽出 (YYYY/MM形式)
          const yearMonth = date.substring(0, 7);
          if (!result[yearMonth]) {
            result[yearMonth] = {
              count: 0,
              recruitCount: 0,
              projects: []
            };
          }
          result[yearMonth].count++;
          result[yearMonth].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
          result[yearMonth].projects.push(project);
        }
      });
      
      return result;
    });
  }

  /**
   * 年ごとの集計
   */
  aggregateByYear() {
    return this.getOrCompute('byYear', () => {
      const result = {};
      
      this.data.forEach(project => {
        const date = project['実施年月'] || project.implementationDate;
        if (date) {
          const year = date.substring(0, 4);
          if (!result[year]) {
            result[year] = {
              count: 0,
              recruitCount: 0,
              months: {},
              projects: []
            };
          }
          result[year].count++;
          result[year].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
          result[year].projects.push(project);
          
          // 月別にも集計
          const month = date.substring(5, 7);
          if (month) {
            if (!result[year].months[month]) {
              result[year].months[month] = {
                count: 0,
                recruitCount: 0
              };
            }
            result[year].months[month].count++;
            result[year].months[month].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
          }
        }
      });
      
      return result;
    });
  }

  /**
   * 手法ごとの集計
   */
  aggregateByMethod() {
    return this.getOrCompute('byMethod', () => {
      const result = {};
      
      this.data.forEach(project => {
        const method = project['手法'] || project.method;
        if (method) {
          if (!result[method]) {
            result[method] = {
              count: 0,
              recruitCount: 0,
              projects: []
            };
          }
          result[method].count++;
          result[method].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
          result[method].projects.push(project);
        }
      });
      
      return result;
    });
  }

  /**
   * トップNを取得
   * @param {Object} aggregatedData - 集計データ
   * @param {number} n - 取得数
   * @param {string} sortBy - ソート基準 ('count' or 'recruitCount')
   */
  getTopN(aggregatedData, n = 10, sortBy = 'count') {
    const entries = Object.entries(aggregatedData);
    entries.sort((a, b) => b[1][sortBy] - a[1][sortBy]);
    
    return entries.slice(0, n).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  /**
   * 期間でフィルタリング
   * @param {string} startDate - 開始日 (YYYY/MM形式)
   * @param {string} endDate - 終了日 (YYYY/MM形式)
   */
  filterByDateRange(startDate, endDate) {
    return this.data.filter(project => {
      const date = project['実施年月'] || project.implementationDate;
      if (!date) return false;
      
      const projectDate = date.substring(0, 7);
      return projectDate >= startDate && projectDate <= endDate;
    });
  }

  /**
   * 統計情報を取得
   */
  getStatistics() {
    const cacheKey = 'statistics';
    
    return this.getOrCompute(cacheKey, () => {
      const recruitCounts = this.data.map(p => 
        parseInt(p['実績数'] || p.recruitCount || 0)
      ).filter(n => n > 0);
      
      if (recruitCounts.length === 0) {
        return {
          total: 0,
          average: 0,
          median: 0,
          min: 0,
          max: 0,
          standardDeviation: 0
        };
      }
      
      // ソート
      recruitCounts.sort((a, b) => a - b);
      
      // 統計計算
      const total = recruitCounts.reduce((sum, n) => sum + n, 0);
      const average = total / recruitCounts.length;
      
      // 中央値
      const median = recruitCounts.length % 2 === 0
        ? (recruitCounts[recruitCounts.length / 2 - 1] + recruitCounts[recruitCounts.length / 2]) / 2
        : recruitCounts[Math.floor(recruitCounts.length / 2)];
      
      // 標準偏差
      const variance = recruitCounts.reduce((sum, n) => 
        sum + Math.pow(n - average, 2), 0) / recruitCounts.length;
      const standardDeviation = Math.sqrt(variance);
      
      return {
        total,
        average: Math.round(average * 10) / 10,
        median,
        min: recruitCounts[0],
        max: recruitCounts[recruitCounts.length - 1],
        standardDeviation: Math.round(standardDeviation * 10) / 10
      };
    });
  }

  /**
   * 時系列トレンドを取得
   * @param {string} granularity - 'month' or 'year'
   */
  getTimeTrend(granularity = 'month') {
    const cacheKey = `timeTrend:${granularity}`;
    
    return this.getOrCompute(cacheKey, () => {
      const result = [];
      const dateMap = {};
      
      this.data.forEach(project => {
        const date = project['実施年月'] || project.implementationDate;
        if (!date) return;
        
        const key = granularity === 'year' 
          ? date.substring(0, 4)
          : date.substring(0, 7);
        
        if (!dateMap[key]) {
          dateMap[key] = {
            date: key,
            count: 0,
            recruitCount: 0
          };
        }
        
        dateMap[key].count++;
        dateMap[key].recruitCount += parseInt(project['実績数'] || project.recruitCount || 0);
      });
      
      // ソートして配列に変換
      Object.keys(dateMap).sort().forEach(key => {
        result.push(dateMap[key]);
      });
      
      return result;
    });
  }

  /**
   * 前年同期比を計算
   * @param {string} currentPeriod - 現在の期間 (YYYY/MM形式)
   */
  getYearOverYearComparison(currentPeriod) {
    const currentYear = parseInt(currentPeriod.substring(0, 4));
    const currentMonth = currentPeriod.substring(5, 7);
    const previousPeriod = `${currentYear - 1}/${currentMonth}`;
    
    const current = this.filterByDateRange(currentPeriod, currentPeriod);
    const previous = this.filterByDateRange(previousPeriod, previousPeriod);
    
    const currentStats = {
      count: current.length,
      recruitCount: current.reduce((sum, p) => 
        sum + parseInt(p['実績数'] || p.recruitCount || 0), 0)
    };
    
    const previousStats = {
      count: previous.length,
      recruitCount: previous.reduce((sum, p) => 
        sum + parseInt(p['実績数'] || p.recruitCount || 0), 0)
    };
    
    return {
      current: currentStats,
      previous: previousStats,
      growth: {
        count: previousStats.count ? 
          ((currentStats.count - previousStats.count) / previousStats.count * 100).toFixed(1) : 0,
        recruitCount: previousStats.recruitCount ? 
          ((currentStats.recruitCount - previousStats.recruitCount) / previousStats.recruitCount * 100).toFixed(1) : 0
      }
    };
  }
}

// シングルトンインスタンス
export const dataAggregationManager = new DataAggregationManager();

// デフォルトエクスポート
export default dataAggregationManager;
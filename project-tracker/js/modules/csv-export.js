/**
 * CSVエクスポートモジュール
 * @module csv-export
 */

import { escapeCSVField, formatDateString } from '../utils.js';

/**
 * CSVエクスポートマネージャー
 */
export class CSVExportManager {
  constructor() {
    this.defaultColumns = [
      'registrationId',
      '疾患名',
      '疾患略語',
      '手法',
      '調査種別',
      '対象者種別',
      '専門',
      '実績数',
      '問合せのみ',
      '対象条件',
      '薬剤',
      'リクルート実施',
      'モデレーター',
      'クライアント',
      'エンドクライアント',
      'PJ番号',
      '実施年月',
      '登録担当',
      '登録日'
    ];
  }

  /**
   * プロジェクトをCSV形式でエクスポート
   * @param {Array} projects - プロジェクト配列
   * @param {Object} options - オプション
   * @param {Array} options.columns - エクスポートする列
   * @param {string} options.filename - ファイル名
   * @param {boolean} options.includeBOM - BOMを含めるか
   */
  export(projects, options = {}) {
    const {
      columns = this.defaultColumns,
      filename = this.generateFilename(),
      includeBOM = true
    } = options;

    try {
      const csv = this.convertToCSV(projects, columns);
      this.downloadCSV(csv, filename, includeBOM);
      return true;
    } catch (error) {
      console.error('CSV export error:', error);
      return false;
    }
  }

  /**
   * プロジェクトデータをCSV形式に変換
   * @param {Array} projects - プロジェクト配列
   * @param {Array} columns - 列名配列
   * @returns {string} - CSV文字列
   */
  convertToCSV(projects, columns) {
    // ヘッダー行を作成
    const headerRow = columns.map(col => escapeCSVField(col)).join(',');
    
    // データ行を作成
    const dataRows = projects.map(project => {
      return columns.map(col => {
        let value = this.getProjectValue(project, col);
        
        // 日付フィールドのフォーマット
        if (col === '実施年月' || col === 'implementationDate' || 
            col === '登録日' || col === 'registeredDate') {
          value = formatDateString(value);
        }
        
        // 数値フィールドの処理
        if (col === '実績数' || col === 'recruitCount') {
          value = value || '0';
        }
        
        return escapeCSVField(value);
      }).join(',');
    });

    // ヘッダーとデータを結合
    return [headerRow, ...dataRows].join('\n');
  }

  /**
   * プロジェクトから値を取得
   * @param {Object} project - プロジェクトオブジェクト
   * @param {string} column - 列名
   * @returns {string} - 値
   */
  getProjectValue(project, column) {
    // 複数の可能性がある列名に対応
    const columnMap = {
      'registrationId': ['registrationId', 'id', 'ID'],
      '疾患名': ['疾患名', 'diseaseName'],
      '疾患略語': ['疾患略語', 'diseaseAbbr'],
      '手法': ['手法', 'method'],
      '調査種別': ['調査種別', 'surveyType'],
      '対象者種別': ['対象者種別', 'targetType'],
      '専門': ['専門', 'specialty'],
      '実績数': ['実績数', 'recruitCount'],
      '問合せのみ': ['問合せのみ', 'inquiryOnly'],
      '対象条件': ['対象条件', 'targetConditions'],
      '薬剤': ['薬剤', 'drug'],
      'リクルート実施': ['リクルート実施', 'recruitmentCompany'],
      'モデレーター': ['モデレーター', 'moderator'],
      'クライアント': ['クライアント', 'client'],
      'エンドクライアント': ['エンドクライアント', 'endClient'],
      'PJ番号': ['PJ番号', 'projectNumber'],
      '実施年月': ['実施年月', 'implementationDate'],
      '登録担当': ['登録担当', 'registeredBy'],
      '登録日': ['登録日', 'registeredDate', 'createdAt']
    };

    const possibleKeys = columnMap[column] || [column];
    
    for (const key of possibleKeys) {
      if (project[key] !== undefined && project[key] !== null) {
        return String(project[key]);
      }
    }
    
    return '';
  }

  /**
   * CSVファイルをダウンロード
   * @param {string} csv - CSV文字列
   * @param {string} filename - ファイル名
   * @param {boolean} includeBOM - BOMを含めるか
   */
  downloadCSV(csv, filename, includeBOM = true) {
    // BOMを追加（Excelでの文字化け対策）
    const bom = includeBOM ? '\uFEFF' : '';
    const csvContent = bom + csv;
    
    // Blobを作成
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // ダウンロードリンクを作成
    const link = document.createElement('a');
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      
      // リンクをクリックしてダウンロードを開始
      document.body.appendChild(link);
      link.click();
      
      // クリーンアップ
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    }
  }

  /**
   * ファイル名を生成
   * @returns {string} - ファイル名
   */
  generateFilename() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    return `projects_export_${dateStr}_${timeStr}.csv`;
  }

  /**
   * 選択されたプロジェクトをエクスポート
   * @param {Array} selectedIds - 選択されたプロジェクトID配列
   * @param {Array} allProjects - すべてのプロジェクト
   * @param {Object} options - オプション
   */
  exportSelected(selectedIds, allProjects, options = {}) {
    const selectedProjects = allProjects.filter(p => 
      selectedIds.includes(p.registrationId || p.id)
    );
    
    if (selectedProjects.length === 0) {
      console.warn('No projects selected for export');
      return false;
    }
    
    return this.export(selectedProjects, {
      ...options,
      filename: options.filename || `selected_projects_${selectedIds.length}_items.csv`
    });
  }

  /**
   * フィルター結果をエクスポート
   * @param {Array} filteredProjects - フィルター済みプロジェクト
   * @param {Object} filterCriteria - フィルター条件
   * @param {Object} options - オプション
   */
  exportFiltered(filteredProjects, filterCriteria = {}, options = {}) {
    const filterSummary = this.getFilterSummary(filterCriteria);
    const filename = options.filename || `filtered_projects_${filterSummary}.csv`;
    
    return this.export(filteredProjects, {
      ...options,
      filename
    });
  }

  /**
   * フィルター条件のサマリーを生成
   * @param {Object} criteria - フィルター条件
   * @returns {string} - サマリー文字列
   */
  getFilterSummary(criteria) {
    const parts = [];
    
    if (criteria.searchQuery) {
      parts.push(`search_${criteria.searchQuery.substring(0, 10)}`);
    }
    if (criteria.targetType) {
      parts.push(`target_${criteria.targetType}`);
    }
    if (criteria.specialty) {
      parts.push(`spec_${criteria.specialty.substring(0, 10)}`);
    }
    if (criteria.dateRange) {
      parts.push(`date_${criteria.dateRange}`);
    }
    
    return parts.length > 0 ? parts.join('_') : 'all';
  }

  /**
   * カスタムエクスポートダイアログを表示
   * @param {Array} projects - プロジェクト配列
   */
  async showExportDialog(projects) {
    // モーダルマネージャーが利用可能な場合
    if (window.modalManager) {
      const result = await window.modalManager.confirm({
        title: 'CSVエクスポート',
        message: `${projects.length}件のプロジェクトをエクスポートしますか？`,
        confirmText: 'エクスポート',
        cancelText: 'キャンセル',
        type: 'info'
      });
      
      if (result) {
        return this.export(projects);
      }
    } else {
      // フォールバック
      if (confirm(`${projects.length}件のプロジェクトをエクスポートしますか？`)) {
        return this.export(projects);
      }
    }
    
    return false;
  }
}

// シングルトンインスタンス
export const csvExportManager = new CSVExportManager();

// デフォルトエクスポート
export default csvExportManager;
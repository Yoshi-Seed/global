/**
 * プロジェクト表示モジュール
 * @module project-display
 */

import { truncate, getTargetTypeBadgeClass, formatDateString } from '../utils.js';

/**
 * プロジェクトカード表示マネージャー
 */
export class ProjectDisplayManager {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('projectsGrid');
    this.viewMode = options.viewMode || 'card';
    this.itemsPerPage = options.itemsPerPage || 20;
    this.currentPage = 1;
    this.projects = [];
    this.filteredProjects = [];
  }

  /**
   * プロジェクトをセット
   * @param {Array} projects - プロジェクト配列
   */
  setProjects(projects) {
    this.projects = projects;
    this.filteredProjects = projects;
    this.currentPage = 1;
  }

  /**
   * フィルター済みプロジェクトをセット
   * @param {Array} projects - フィルター済みプロジェクト配列
   */
  setFilteredProjects(projects) {
    this.filteredProjects = projects;
    this.currentPage = 1;
  }

  /**
   * 表示モードを切り替え
   * @param {string} mode - 'card' または 'table'
   */
  switchView(mode) {
    this.viewMode = mode;
    this.render();
  }

  /**
   * プロジェクトを表示
   * @param {Array} projects - 表示するプロジェクト配列
   */
  render(projects = null) {
    const projectsToRender = projects || this.filteredProjects;
    
    if (!this.container) {
      console.error('Container element not found');
      return;
    }

    if (this.viewMode === 'card') {
      this.renderCardView(projectsToRender);
    } else {
      this.renderTableView(projectsToRender);
    }
  }

  /**
   * カードビューで表示
   * @param {Array} projects - プロジェクト配列
   */
  renderCardView(projects) {
    const html = projects.map(project => this.createProjectCard(project)).join('');
    this.container.innerHTML = html;
    this.container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    
    // アニメーション適用
    requestAnimationFrame(() => {
      this.container.querySelectorAll('.project-card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('card-enter');
        }, index * 50);
      });
    });
  }

  /**
   * テーブルビューで表示
   * @param {Array} projects - プロジェクト配列
   */
  renderTableView(projects) {
    const html = `
      <div class="overflow-x-auto">
        <table class="w-full bg-white rounded-lg overflow-hidden">
          <thead class="bg-gray-50">
            <tr>
              ${this.getTableHeaders()}
            </tr>
          </thead>
          <tbody>
            ${projects.map(project => this.createTableRow(project)).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    this.container.innerHTML = html;
    this.container.className = 'w-full';
  }

  /**
   * プロジェクトカードを作成
   * @param {Object} project - プロジェクトデータ
   * @returns {string} - カードHTML
   */
  createProjectCard(project) {
    const registrationId = project.registrationId || project.id || 'N/A';
    const diseaseName = project['疾患名'] || project.diseaseName || '';
    const targetType = project['対象者種別'] || project.targetType || '';
    const specialty = project['専門'] || project.specialty || '';
    const recruitCount = project['実績数'] || project.recruitCount || 0;
    const client = project['クライアント'] || project.client || '';
    const implementationDate = project['実施年月'] || project.implementationDate || '';
    const projectNumber = project['PJ番号'] || project.projectNumber || '';

    return `
      <div class="project-card bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4 border border-gray-200">
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs font-semibold text-gray-500">ID: ${registrationId}</span>
          ${targetType ? `<span class="px-2 py-1 text-xs rounded-full ${getTargetTypeBadgeClass(targetType)}">${targetType}</span>` : ''}
        </div>
        
        <h3 class="font-semibold text-gray-800 mb-2" title="${diseaseName}">
          ${truncate(diseaseName, 30)}
        </h3>
        
        <div class="space-y-2 text-sm">
          ${specialty ? `
            <div class="flex items-center text-gray-600">
              <i class="fas fa-stethoscope w-4 mr-2 text-gray-400"></i>
              <span title="${specialty}">${truncate(specialty, 25)}</span>
            </div>
          ` : ''}
          
          ${recruitCount ? `
            <div class="flex items-center text-gray-600">
              <i class="fas fa-users w-4 mr-2 text-gray-400"></i>
              <span>${recruitCount}名</span>
            </div>
          ` : ''}
          
          ${client ? `
            <div class="flex items-center text-gray-600">
              <i class="fas fa-building w-4 mr-2 text-gray-400"></i>
              <span title="${client}">${truncate(client, 25)}</span>
            </div>
          ` : ''}
          
          ${implementationDate ? `
            <div class="flex items-center text-gray-600">
              <i class="fas fa-calendar w-4 mr-2 text-gray-400"></i>
              <span>${formatDateString(implementationDate)}</span>
            </div>
          ` : ''}

          ${projectNumber ? `
            <div class="flex items-center text-gray-600">
              <i class="fas fa-hashtag w-4 mr-2 text-gray-400"></i>
              <span>${projectNumber}</span>
            </div>
          ` : ''}
        </div>
        
        <div class="mt-4 pt-3 border-t border-gray-100">
          <button onclick="projectDisplayManager.showProjectDetails('${registrationId}')" 
                  class="text-sm text-sp-primary hover:underline">
            詳細を見る →
          </button>
        </div>
      </div>
    `;
  }

  /**
   * テーブル行を作成
   * @param {Object} project - プロジェクトデータ
   * @returns {string} - 行HTML
   */
  createTableRow(project) {
    const registrationId = project.registrationId || project.id || 'N/A';
    const diseaseName = project['疾患名'] || project.diseaseName || '';
    const diseaseAbbr = project['疾患略語'] || project.diseaseAbbr || '';
    const targetType = project['対象者種別'] || project.targetType || '';
    const specialty = project['専門'] || project.specialty || '';
    const recruitCount = project['実績数'] || project.recruitCount || 0;
    const client = project['クライアント'] || project.client || '';
    const implementationDate = project['実施年月'] || project.implementationDate || '';

    return `
      <tr class="hover:bg-gray-50 border-b border-gray-100">
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${registrationId}</td>
        <td class="px-4 py-3 text-sm text-gray-700" title="${diseaseName}">
          ${truncate(diseaseName, 30)}
        </td>
        <td class="px-4 py-3 text-sm text-gray-700">${diseaseAbbr}</td>
        <td class="px-4 py-3">
          ${targetType ? `<span class="px-2 py-1 text-xs rounded-full ${getTargetTypeBadgeClass(targetType)}">${targetType}</span>` : ''}
        </td>
        <td class="px-4 py-3 text-sm text-gray-700" title="${specialty}">
          ${truncate(specialty, 20)}
        </td>
        <td class="px-4 py-3 text-sm text-gray-700 text-center">${recruitCount || '-'}</td>
        <td class="px-4 py-3 text-sm text-gray-700" title="${client}">
          ${truncate(client, 20)}
        </td>
        <td class="px-4 py-3 text-sm text-gray-700">${formatDateString(implementationDate)}</td>
        <td class="px-4 py-3 text-sm">
          <button onclick="projectDisplayManager.showProjectDetails('${registrationId}')" 
                  class="text-sp-primary hover:underline">
            詳細
          </button>
        </td>
      </tr>
    `;
  }

  /**
   * テーブルヘッダーを取得
   * @returns {string} - ヘッダーHTML
   */
  getTableHeaders() {
    const headers = [
      { key: 'registrationId', label: 'ID', sortable: true },
      { key: 'diseaseName', label: '疾患名', sortable: true },
      { key: 'diseaseAbbr', label: '略語', sortable: false },
      { key: 'targetType', label: '対象者', sortable: true },
      { key: 'specialty', label: '診療科', sortable: true },
      { key: 'recruitCount', label: '実績数', sortable: true },
      { key: 'client', label: 'クライアント', sortable: true },
      { key: 'implementationDate', label: '実施年月', sortable: true },
      { key: 'actions', label: 'アクション', sortable: false }
    ];

    return headers.map(header => {
      if (header.sortable) {
        return `
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onclick="projectDisplayManager.sort('${header.key}')">
            ${header.label}
            <i class="fas fa-sort ml-1 text-gray-400"></i>
          </th>
        `;
      } else {
        return `
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ${header.label}
          </th>
        `;
      }
    }).join('');
  }

  /**
   * プロジェクト詳細を表示
   * @param {string} projectId - プロジェクトID
   */
  showProjectDetails(projectId) {
    const project = this.projects.find(p => 
      (p.registrationId || p.id) === projectId
    );

    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return;
    }

    // モーダルまたは詳細ページへの遷移
    // ここでは簡単なアラートで代替
    console.log('Project Details:', project);
    
    // 実際の実装では、モーダルマネージャーを使用
    if (window.modalManager) {
      window.modalManager.alert({
        title: 'プロジェクト詳細',
        message: `
          ID: ${project.registrationId || project.id}<br>
          疾患名: ${project['疾患名'] || project.diseaseName}<br>
          対象者: ${project['対象者種別'] || project.targetType}<br>
          診療科: ${project['専門'] || project.specialty}<br>
          実績数: ${project['実績数'] || project.recruitCount}名
        `,
        type: 'info'
      });
    }
  }

  /**
   * ソート
   * @param {string} key - ソートキー
   */
  sort(key) {
    // ソート実装はfiltersモジュールと連携
    console.log('Sort by:', key);
    // 実装される予定
  }

  /**
   * 空の状態を表示
   * @param {string} message - メッセージ
   */
  showEmptyState(message = 'プロジェクトが見つかりませんでした。') {
    this.container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
        <p class="text-gray-500">${message}</p>
      </div>
    `;
  }

  /**
   * ローディング状態を表示
   */
  showLoading() {
    this.container.innerHTML = `
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sp-primary"></div>
        <p class="text-gray-500 mt-4">読み込み中...</p>
      </div>
    `;
  }
}

// シングルトンインスタンス
export const projectDisplayManager = new ProjectDisplayManager();

// デフォルトエクスポート
export default projectDisplayManager;
(function () {
  function escapeCsvValue(value) {
    const stringValue = String(value ?? '').replace(/"/g, '""');
    return `"${stringValue}"`;
  }

  function convertProjectsToCSV(projects) {
    const headers = [
      '疾患名',
      '疾患略語',
      '手法',
      '調査種別',
      '対象者種別',
      '専門',
      '実績数',
      '対象条件',
      '薬剤',
      'リクルート実施',
      'クライアント',
      '登録日'
    ];

    const rows = projects.map(project => {
      const registeredDate = project.createdAt && !Number.isNaN(new Date(project.createdAt).getTime())
        ? new Date(project.createdAt).toLocaleDateString('ja-JP')
        : (project.registeredDate || '');

      return [
        project.diseaseName || '',
        project.diseaseAbbr || '',
        project.method || '',
        project.surveyType || '',
        project.targetType || '',
        project.specialty || '',
        project.recruitCount ?? '',
        project.targetConditions || '',
        project.drug || '',
        project.recruitCompany || '',
        project.client || '',
        registeredDate
      ].map(escapeCsvValue).join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  function downloadFile(content, filename, mimeType, options = {}) {
    const { addBom = false } = options;
    const payload = addBom ? `\ufeff${content}` : content;
    const blob = new Blob([payload], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function exportData() {
    const exportAsCsv = confirm('CSVでエクスポートしますか？（キャンセルするとJSONでエクスポートします）');

    try {
      const projects = await window.api.getAllProjects();

      if (!projects || projects.length === 0) {
        alert('エクスポートするデータがありません。');
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      if (exportAsCsv) {
        const csv = convertProjectsToCSV(projects);
        downloadFile(csv, `projects_export_${timestamp}.csv`, 'text/csv;charset=utf-8', { addBom: true });
      } else {
        const json = JSON.stringify(projects, null, 2);
        downloadFile(json, `projects_export_${timestamp}.json`, 'application/json;charset=utf-8');
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('データのエクスポートに失敗しました。時間をおいて再度お試しください。');
    }
  }

  window.ProjectExport = {
    exportData,
    convertProjectsToCSV,
    downloadFile,
  };

  window.exportData = exportData;
})();

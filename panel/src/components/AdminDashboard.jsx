import { useState } from 'react'
import { 
  Users, 
  FileText, 
  Coins, 
  TrendingUp, 
  Search,
  Download,
  Upload,
  Filter,
  BarChart3,
  Shield,
  LogOut,
  Settings,
  Bell
} from 'lucide-react'

function AdminDashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('overview')

  const stats = [
    { 
      name: '登録医師数', 
      value: '24,567', 
      change: '+234',
      changeText: '今月の新規登録',
      icon: Users, 
      color: 'bg-blue-500'
    },
    { 
      name: 'アクティブ率', 
      value: '67.8%', 
      change: '+3.2%',
      changeText: '前月比',
      icon: TrendingUp, 
      color: 'bg-green-500'
    },
    { 
      name: '実施中アンケート', 
      value: '15', 
      change: '8件',
      changeText: '今週完了予定',
      icon: FileText, 
      color: 'bg-purple-500'
    },
    { 
      name: '付与ポイント総額', 
      value: '1,234,500', 
      change: '+45,600',
      changeText: '今月',
      icon: Coins, 
      color: 'bg-yellow-500'
    },
  ]

  const recentRegistrations = [
    {
      id: 1,
      name: '田中 一郎',
      hospital: '○○総合病院',
      department: '外科',
      prefecture: '東京都',
      date: '2026-01-14',
      source: 'dm_2026_spring',
      status: 'pending'
    },
    {
      id: 2,
      name: '佐藤 花子',
      hospital: '△△クリニック',
      department: '内科',
      prefecture: '大阪府',
      date: '2026-01-14',
      source: 'conference_2026',
      status: 'approved'
    },
    {
      id: 3,
      name: '鈴木 太郎',
      hospital: '××大学病院',
      department: '小児科',
      prefecture: '神奈川県',
      date: '2026-01-13',
      source: 'referral',
      status: 'approved'
    },
  ]

  const sourceStats = [
    { source: '春期DMキャンペーン', code: 'dm_2026_spring', count: 234, conversion: '12.3%' },
    { source: '2026年学会チラシ', code: 'conference_2026', count: 189, conversion: '8.7%' },
    { source: '紹介', code: 'referral', count: 156, conversion: '45.2%' },
    { source: '直接アクセス', code: 'direct', count: 98, conversion: '3.4%' },
  ]

  const pointManagement = [
    {
      id: 1,
      surveyTitle: '新薬の臨床評価に関するアンケート',
      surveyId: 'SV-2026-001',
      completions: 147,
      totalPoints: 117600,
      avgPoints: 800
    },
    {
      id: 2,
      surveyTitle: '医療機器の使用状況調査',
      surveyId: 'SV-2026-002',
      completions: 203,
      totalPoints: 101500,
      avgPoints: 500
    },
    {
      id: 3,
      surveyTitle: '循環器疾患の治療動向調査',
      surveyId: 'SV-2025-098',
      completions: 89,
      totalPoints: 89000,
      avgPoints: 1000
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">管理者ダッシュボード</h1>
                <p className="text-xs text-gray-500">Medical Panel Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6" />
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">管理者</p>
                <p className="text-xs text-gray-500">admin@seedplanning.co.jp</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'overview'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                概要
              </button>
              <button
                onClick={() => setSelectedTab('members')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'members'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                会員管理
              </button>
              <button
                onClick={() => setSelectedTab('points')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'points'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ポイント管理
              </button>
              <button
                onClick={() => setSelectedTab('analytics')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  selectedTab === 'analytics'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                分析・レポート
              </button>
            </nav>
          </div>
        </div>

        {/* 概要タブ */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* 統計カード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                    <p className="text-xs text-gray-500">{stat.changeText}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 流入元統計 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
                  流入元統計（今月）
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">流入元</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ソースコード</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">登録数</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">コンバージョン率</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sourceStats.map((item) => (
                        <tr key={item.code} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.source}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.code}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.count}人</td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">{item.conversion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 最近の登録 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary-600" />
                    最近の新規登録
                  </h2>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    すべて見る →
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">医療機関</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">診療科</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">都道府県</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">登録日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">流入元</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状態</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentRegistrations.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{member.hospital}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.prefecture}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                          {member.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {member.status === 'approved' ? '承認済み' : '承認待ち'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ポイント管理タブ */}
        {selectedTab === 'points' && (
          <div className="space-y-6">
            {/* ポイント付与インターフェース */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-primary-600" />
                  ポイント一括付与
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSVファイルをアップロード
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept=".csv"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
                        アップロード
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      形式: ユーザーID, ポイント数, アンケートID（例: U12345,800,SV-2026-001）
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      💡 CSVファイルをインポートすると、自動的にポイントが付与されます。
                      処理後、対象の医師にメール通知が送信されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ポイント付与履歴 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Coins className="h-5 w-5 mr-2 text-primary-600" />
                  アンケート別ポイント付与状況
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アンケートタイトル</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">案件ID</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">完了数</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">平均pt</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">総付与pt</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pointManagement.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.surveyTitle}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.surveyId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.completions}人</td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">{item.avgPoints}pt</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          {item.totalPoints.toLocaleString()}pt
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 会員管理タブとレポートタブは省略（同様の構造で実装可能） */}
        {selectedTab === 'members' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">会員検索・管理</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
                <Download className="h-4 w-4" />
                <span>会員データエクスポート</span>
              </button>
            </div>
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="氏名、医療機関名、メールアドレスで検索..."
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              会員検索・詳細管理機能がここに表示されます
            </p>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">分析・レポート</h2>
            <p className="text-sm text-gray-600">
              詳細な統計情報とレポート機能がここに表示されます
            </p>
          </div>
        )}
      </div>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2026 シード・プランニング 医師パネル管理システム
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4" />
              <span>ISO 27001・プライバシーマーク認証取得</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AdminDashboard

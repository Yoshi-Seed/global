import { useState } from 'react'
import { Coins, TrendingUp, Gift, Calendar, Download, Filter } from 'lucide-react'
import Layout from './Layout'

function Points({ onLogout }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  const pointsHistory = [
    { 
      id: 1, 
      date: '2026-01-13', 
      description: '新薬の臨床評価に関するアンケート',
      points: 800,
      type: 'earn',
      surveyId: 'SV-2026-001'
    },
    { 
      id: 2, 
      date: '2026-01-10', 
      description: '医療機器の使用状況調査',
      points: 500,
      type: 'earn',
      surveyId: 'SV-2026-002'
    },
    { 
      id: 3, 
      date: '2026-01-05', 
      description: 'Amazonギフトカード交換',
      points: -3000,
      type: 'redeem',
      rewardType: 'Amazon'
    },
    { 
      id: 4, 
      date: '2025-12-28', 
      description: '循環器疾患の治療動向調査',
      points: 1000,
      type: 'earn',
      surveyId: 'SV-2025-098'
    },
    { 
      id: 5, 
      date: '2025-12-20', 
      description: '年末ボーナスポイント',
      points: 2000,
      type: 'bonus',
      campaignId: 'BONUS-2025-WINTER'
    },
    { 
      id: 6, 
      date: '2025-12-15', 
      description: '患者満足度調査アンケート',
      points: 600,
      type: 'earn',
      surveyId: 'SV-2025-089'
    },
    { 
      id: 7, 
      date: '2025-12-10', 
      description: '新規会員紹介特典',
      points: 1500,
      type: 'referral',
      referralId: 'REF-2025-045'
    },
    { 
      id: 8, 
      date: '2025-12-01', 
      description: '糖尿病治療薬に関する調査',
      points: 700,
      type: 'earn',
      surveyId: 'SV-2025-075'
    },
  ]

  const totalPoints = 12500
  const earnedThisMonth = 1300
  const redeemedTotal = 8500

  const rewardOptions = [
    { name: 'Amazonギフトカード', points: 3000, icon: '🎁' },
    { name: '楽天ポイント', points: 3000, icon: '🎁' },
    { name: 'QUOカード', points: 5000, icon: '💳' },
    { name: '銀行振込', points: 10000, icon: '💰' },
  ]

  return (
    <Layout onLogout={onLogout}>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ポイント管理</h1>
          <p className="text-gray-600">ポイントの獲得履歴と交換</p>
        </div>

        {/* ポイント統計 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">現在のポイント</h3>
              <Coins className="h-8 w-8" />
            </div>
            <p className="text-4xl font-bold mb-2">{totalPoints.toLocaleString()}</p>
            <p className="text-yellow-100 text-sm">pt</p>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">今月の獲得</h3>
              <TrendingUp className="h-8 w-8" />
            </div>
            <p className="text-4xl font-bold mb-2">{earnedThisMonth.toLocaleString()}</p>
            <p className="text-green-100 text-sm">pt</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">累計交換</h3>
              <Gift className="h-8 w-8" />
            </div>
            <p className="text-4xl font-bold mb-2">{redeemedTotal.toLocaleString()}</p>
            <p className="text-purple-100 text-sm">pt</p>
          </div>
        </div>

        {/* ポイント交換オプション */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Gift className="h-5 w-5 mr-2 text-primary-600" />
              ポイント交換
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rewardOptions.map((option) => (
                <div
                  key={option.name}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition duration-150 cursor-pointer"
                >
                  <div className="text-4xl mb-3 text-center">{option.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-center mb-2">{option.name}</h3>
                  <p className="text-sm text-gray-600 text-center mb-3">
                    {option.points.toLocaleString()} pt〜
                  </p>
                  <button
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition duration-150 ${
                      totalPoints >= option.points
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={totalPoints < option.points}
                  >
                    交換する
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ポイント交換は、交換申請後3営業日以内に処理されます。
                最低交換ポイントは各交換先により異なります。
              </p>
            </div>
          </div>
        </div>

        {/* ポイント履歴 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                ポイント履歴
              </h2>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">すべて</option>
                    <option value="thisMonth">今月</option>
                    <option value="lastMonth">先月</option>
                    <option value="last3Months">過去3ヶ月</option>
                  </select>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150">
                  <Download className="h-4 w-4" />
                  <span>CSV出力</span>
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日付
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    内容
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種別
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ポイント
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pointsHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{record.description}</p>
                        {record.surveyId && (
                          <p className="text-xs text-gray-500 mt-1">案件ID: {record.surveyId}</p>
                        )}
                        {record.rewardType && (
                          <p className="text-xs text-gray-500 mt-1">交換先: {record.rewardType}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.type === 'earn' ? 'bg-green-100 text-green-800' :
                        record.type === 'bonus' ? 'bg-blue-100 text-blue-800' :
                        record.type === 'referral' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.type === 'earn' ? '獲得' :
                         record.type === 'bonus' ? 'ボーナス' :
                         record.type === 'referral' ? '紹介' :
                         '交換'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${
                        record.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.points > 0 ? '+' : ''}{record.points.toLocaleString()} pt
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              表示件数: {pointsHistory.length}件 / 全{pointsHistory.length}件
            </p>
          </div>
        </div>

        {/* ポイント獲得のヒント */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 ポイントを効率的に貯めるコツ</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>定期的にログインしてアンケートをチェックしましょう</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>締切間近のアンケートは高ポイント設定のことが多いです</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>お友達を紹介すると紹介ボーナスポイントがもらえます</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>登録情報を最新に保つと、より多くのアンケートが届きます</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default Points

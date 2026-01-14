import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  User, 
  Coins, 
  LogOut, 
  Bell, 
  FileText,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react'
import Layout from './Layout'

function Dashboard({ onLogout }) {
  const navigate = useNavigate()
  const [notifications] = useState([
    { id: 1, title: '新しいアンケートが届いています', date: '2026-01-14', type: 'survey' },
    { id: 2, title: 'ポイントが付与されました（+500pt）', date: '2026-01-13', type: 'point' },
    { id: 3, title: '登録情報の更新をお願いします', date: '2026-01-10', type: 'info' },
  ])

  const stats = [
    { 
      name: '現在のポイント', 
      value: '12,500', 
      unit: 'pt',
      icon: Coins, 
      color: 'bg-yellow-500',
      change: '+500 pt（前月比）'
    },
    { 
      name: '参加アンケート数', 
      value: '47', 
      unit: '件',
      icon: FileText, 
      color: 'bg-blue-500',
      change: '今月: 5件'
    },
    { 
      name: '会員ランク', 
      value: 'ゴールド', 
      unit: '',
      icon: Award, 
      color: 'bg-purple-500',
      change: 'プラチナまであと 2,500pt'
    },
    { 
      name: '登録日数', 
      value: '324', 
      unit: '日',
      icon: Calendar, 
      color: 'bg-green-500',
      change: '登録日: 2025-02-24'
    },
  ]

  const recentSurveys = [
    { 
      id: 1, 
      title: '新薬の臨床評価に関するアンケート',
      points: 800,
      deadline: '2026-01-20',
      status: 'available',
      duration: '約15分'
    },
    { 
      id: 2, 
      title: '医療機器の使用状況調査',
      points: 500,
      deadline: '2026-01-18',
      status: 'available',
      duration: '約10分'
    },
    { 
      id: 3, 
      title: '循環器疾患の治療動向調査',
      points: 1000,
      deadline: '2026-01-25',
      status: 'available',
      duration: '約20分'
    },
  ]

  return (
    <Layout onLogout={onLogout}>
      <div className="space-y-6">
        {/* ウェルカムメッセージ */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ようこそ、山田先生
          </h1>
          <p className="text-gray-600">
            シード・プランニング医療従事者パネルダッシュボード
          </p>
        </div>

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
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                  <span className="text-lg font-normal text-gray-500 ml-1">{stat.unit}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* アンケート一覧 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary-600" />
                    新着アンケート
                  </h2>
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {recentSurveys.length}件
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentSurveys.map((survey) => (
                  <div key={survey.id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-900 mb-2">
                          {survey.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Coins className="h-4 w-4 mr-1 text-yellow-500" />
                            {survey.points}pt
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            締切: {survey.deadline}
                          </span>
                          <span className="flex items-center">
                            所要時間: {survey.duration}
                          </span>
                        </div>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition duration-150">
                        回答する
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  すべてのアンケートを見る →
                </button>
              </div>
            </div>
          </div>

          {/* 通知パネル */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary-600" />
                  お知らせ
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 hover:bg-gray-50 transition duration-150">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-2 w-2 rounded-full mt-2 ${
                        notification.type === 'survey' ? 'bg-blue-500' :
                        notification.type === 'point' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  すべて見る →
                </button>
              </div>
            </div>

            {/* クイックアクション */}
            <div className="bg-white rounded-lg shadow mt-6 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                >
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    登録情報の変更
                  </span>
                  <span className="text-gray-400">→</span>
                </button>
                <button 
                  onClick={() => navigate('/points')}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
                >
                  <span className="flex items-center text-sm font-medium text-gray-700">
                    <Coins className="h-4 w-4 mr-2 text-gray-400" />
                    ポイント履歴
                  </span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  User, 
  Coins, 
  LogOut, 
  Menu,
  X,
  Shield
} from 'lucide-react'

function Layout({ children, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
    { name: '登録情報', href: '/profile', icon: User },
    { name: 'ポイント', href: '/points', icon: Coins },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden mr-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary-600" />
                <div>
                  <h1 className="text-lg font-bold text-gray-900">医師パネル管理システム</h1>
                  <p className="text-xs text-gray-500">Seed Planning Medical Panel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">山田 太郎 先生</p>
                <p className="text-xs text-gray-500">○○大学病院 内科</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー - デスクトップ */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`${
                      isActive(item.href)
                        ? 'bg-primary-50 border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group w-full flex items-center px-3 py-2 text-sm font-medium border-l-4 transition duration-150`}
                  >
                    <item.icon
                      className={`${
                        isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* サイドバー - モバイル */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.href)
                        setSidebarOpen(false)
                      }}
                      className={`${
                        isActive(item.href)
                          ? 'bg-primary-50 border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group w-full flex items-center px-3 py-2 text-sm font-medium border-l-4`}
                    >
                      <item.icon
                        className={`${
                          isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* フッター */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2026 シード・プランニング. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">利用規約</a>
              <a href="#" className="hover:text-gray-900">プライバシーポリシー</a>
              <a href="#" className="hover:text-gray-900">お問い合わせ</a>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Pマーク・ISO 27001認証</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout

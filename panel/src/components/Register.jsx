import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Building, Stethoscope, MapPin, QrCode } from 'lucide-react'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    hospital: '',
    department: '',
    position: '',
    prefecture: '',
    source: new URLSearchParams(window.location.search).get('source') || 'direct'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // デモ用: 登録後にログインページへ
    alert('登録が完了しました。ログインページに移動します。')
    navigate('/login')
  }

  // URLパラメータからソース情報を取得
  const sourceInfo = {
    'dm_2026_spring': '春期DMキャンペーン',
    'conference_2026': '2026年学会チラシ',
    'referral': '紹介',
    'direct': '直接アクセス'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            新規会員登録
          </h1>
          <p className="text-gray-600">
            シード・プランニング医療従事者パネルへようこそ
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* 流入元表示 */}
          {formData.source !== 'direct' && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <QrCode className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  流入元: {sourceInfo[formData.source] || formData.source}
                </p>
                <p className="text-xs text-green-600">
                  QRコードからのご登録ありがとうございます
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="山田 太郎"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="doctor@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    パスワード <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="8文字以上"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    パスワード（確認） <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="再度入力してください"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 勤務先情報 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">勤務先情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-2">
                    医療機関名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="hospital"
                      name="hospital"
                      type="text"
                      value={formData.hospital}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="○○大学病院"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    診療科 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Stethoscope className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="internal">内科</option>
                      <option value="surgery">外科</option>
                      <option value="pediatrics">小児科</option>
                      <option value="orthopedics">整形外科</option>
                      <option value="psychiatry">精神科</option>
                      <option value="dermatology">皮膚科</option>
                      <option value="ophthalmology">眼科</option>
                      <option value="otolaryngology">耳鼻咽喉科</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                    役職 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="director">院長・副院長</option>
                    <option value="chief">部長</option>
                    <option value="deputy">医長</option>
                    <option value="staff">医員</option>
                    <option value="resident">研修医</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-2">
                    都道府県 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="prefecture"
                      name="prefecture"
                      value={formData.prefecture}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">選択してください</option>
                      <option value="tokyo">東京都</option>
                      <option value="osaka">大阪府</option>
                      <option value="kanagawa">神奈川県</option>
                      <option value="aichi">愛知県</option>
                      <option value="hokkaido">北海道</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 同意事項 */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  <a href="#" className="text-primary-600 hover:text-primary-500 underline">利用規約</a>
                  および
                  <a href="#" className="text-primary-600 hover:text-primary-500 underline">プライバシーポリシー</a>
                  に同意します <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="flex items-start">
                <input
                  id="research"
                  name="research"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  required
                />
                <label htmlFor="research" className="ml-2 block text-sm text-gray-700">
                  医療・医薬品に関する調査・アンケートへの協力に同意します <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                登録する
              </button>
            </div>
          </form>
        </div>

        {/* セキュリティ情報 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>このサイトは SSL/TLS 暗号化通信により保護されています</p>
          <p className="mt-1">プライバシーマーク・ISO 27001 認証取得済み</p>
        </div>
      </div>
    </div>
  )
}

export default Register

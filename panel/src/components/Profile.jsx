import { useState } from 'react'
import { User, Mail, Lock, Building, Stethoscope, MapPin, Save, Eye, EyeOff } from 'lucide-react'
import Layout from './Layout'

function Profile({ onLogout }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '山田 太郎',
    email: 'yamada.taro@example.com',
    hospital: '○○大学病院',
    department: 'internal',
    position: 'staff',
    prefecture: 'tokyo',
    phone: '090-1234-5678',
    bedCount: '500-999'
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('登録情報を更新しました')
    setIsEditing(false)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('新しいパスワードが一致しません')
      return
    }
    alert('パスワードを変更しました')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  return (
    <Layout onLogout={onLogout}>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">登録情報</h1>
          <p className="text-gray-600">プロフィール情報の確認・変更</p>
        </div>

        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">基本情報</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition duration-150"
              >
                編集する
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  氏名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    } focus:ring-primary-500 focus:border-primary-500`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    } focus:ring-primary-500 focus:border-primary-500`}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  医療機関名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="hospital"
                    type="text"
                    value={formData.hospital}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    } focus:ring-primary-500 focus:border-primary-500`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  診療科 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Stethoscope className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    } focus:ring-primary-500 focus:border-primary-500`}
                  >
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  役職 <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  } focus:ring-primary-500 focus:border-primary-500`}
                >
                  <option value="director">院長・副院長</option>
                  <option value="chief">部長</option>
                  <option value="deputy">医長</option>
                  <option value="staff">医員</option>
                  <option value="resident">研修医</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  都道府県 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="prefecture"
                    value={formData.prefecture}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    } focus:ring-primary-500 focus:border-primary-500`}
                  >
                    <option value="tokyo">東京都</option>
                    <option value="osaka">大阪府</option>
                    <option value="kanagawa">神奈川県</option>
                    <option value="aichi">愛知県</option>
                    <option value="hokkaido">北海道</option>
                    <option value="other">その他</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  病床数
                </label>
                <select
                  name="bedCount"
                  value={formData.bedCount}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  } focus:ring-primary-500 focus:border-primary-500`}
                >
                  <option value="0-99">0-99床</option>
                  <option value="100-299">100-299床</option>
                  <option value="300-499">300-499床</option>
                  <option value="500-999">500-999床</option>
                  <option value="1000+">1000床以上</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 flex items-center space-x-2 transition duration-150"
                >
                  <Save className="h-4 w-4" />
                  <span>保存する</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* パスワード変更 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">パスワード変更</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6">
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現在のパスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新しいパスワード（確認）
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition duration-150"
              >
                パスワードを変更
              </button>
            </div>
          </form>
        </div>

        {/* 登録情報の更新履歴 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">重要なお知らせ</h3>
          <p className="text-sm text-blue-800">
            年に一度、登録情報の確認・更新をお願いしております。
            勤務先が変わられた場合は、速やかに更新をお願いいたします。
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Profile

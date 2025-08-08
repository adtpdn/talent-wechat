const app = getApp()
Page({
  data: {
    userRole: '',
    profile: {},
    isShare: false
  },
  onLoad(options) {
    this.setData({ isShare: options.share === 'true' })
    this.loadProfile()
  },
  loadProfile() {
    const openId = app.globalData.openId
    const talents = wx.getStorageSync('talents') || []
    const profile = talents.find(t => t._openid === openId) || {}
    const users = wx.getStorageSync('users') || []
    const user = users.find(u => u._openid === openId)
    this.setData({
      profile,
      userRole: user ? user.role : 'external'
    })
  },
  editProfile() {
    wx.navigateTo({ url: '/pages/editProfile/editProfile' })
  },
  shareProfile() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage() {
    return {
      title: `Talent Profile: ${this.data.profile.name || 'Unknown'}`,
      path: `/pages/profile/profile?id=${this.data.profile._id || ''}&share=true`
    }
  }
})
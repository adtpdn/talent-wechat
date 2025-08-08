const app = getApp()
Page({
  data: {
    talent: {},
    userRole: '',
    isShare: false
  },
  onLoad(options) {
    this.setData({ isShare: options.share === 'true' })
    this.loadTalent(options.id)
    this.checkUserRole()
  },
  checkUserRole() {
    const openId = app.globalData.openId
    const users = wx.getStorageSync('users') || []
    const user = users.find(u => u._openid === openId)
    this.setData({ userRole: user ? user.role : 'external' })
  },
  loadTalent(talentId) {
    const talents = wx.getStorageSync('talents') || []
    const talent = talents.find(t => t._id === talentId) || {}
    this.setData({ talent })
  },
  collectTalent(e) {
    const talentId = e.currentTarget.dataset.id
    const collections = wx.getStorageSync('collections') || []
    collections.push({ talentId, userId: app.globalData.openId, timestamp: new Date() })
    wx.setStorageSync('collections', collections)
    wx.showToast({ title: 'Talent collected' })
  },
  editTalent(e) {
    const talentId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/editProfile/editProfile?id=${talentId}` })
  },
  shareTalent() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage() {
    return {
      title: `Talent Profile: ${this.data.talent.name || 'Unknown'}`,
      path: `/pages/talentDetail/talentDetail?id=${this.data.talent._id || ''}&share=true`
    }
  }
})
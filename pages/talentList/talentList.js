const app = getApp()
Page({
  data: {
    userRole: '',
    talentList: [],
    mode: ''
  },
  onLoad(options) {
    this.setData({ mode: options.mode || '' })
    this.checkUserRole()
    this.loadTalents()
  },
  checkUserRole() {
    const openId = app.globalData.openId
    const users = wx.getStorageSync('users') || []
    const user = users.find(u => u._openid === openId)
    this.setData({ userRole: user ? user.role : 'external' })
  },
  loadTalents() {
    const talents = wx.getStorageSync('talents') || []
    if (this.data.mode === 'collected') {
      const collections = wx.getStorageSync('collections') || []
      const talentIds = collections.filter(c => c.userId === app.globalData.openId).map(c => c.talentId)
      this.setData({ talentList: talents.filter(t => talentIds.includes(t._id)) })
    } else {
      this.setData({ talentList: talents })
    }
  },
  collectTalent(e) {
    const talentId = e.detail.id
    const collections = wx.getStorageSync('collections') || []
    collections.push({ talentId, userId: app.globalData.openId, timestamp: new Date() })
    wx.setStorageSync('collections', collections)
    wx.showToast({ title: 'Talent collected' })
  },
  editTalent(e) {
    const talentId = e.detail.id
    wx.navigateTo({ url: `/pages/editProfile/editProfile?id=${talentId}` })
  },
  shareTalent(e) {
    const talentId = e.detail.id
    wx.navigateTo({ url: `/pages/talentDetail/talentDetail?id=${talentId}&share=true` })
  }
})
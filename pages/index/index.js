const app = getApp()
Page({
  data: {
    userRole: '',
    talentList: [],
    filters: {},
    genderOptions: ['All', 'Male', 'Female'],
    ageRangeOptions: [['All'], ['18-25', '26-35', '36-50', '50+']],
    locationOptions: ['All', 'China', 'Not China']
  },
  onLoad() {
    this.checkUserRole()
    this.loadTalents()
  },
  checkUserRole() {
    const openId = app.globalData.openId
    const users = app.getStorageWithFallback('users', app.DEFAULT_USERS)
    const user = users.find(u => u._openid === openId)
    this.setData({ userRole: user ? user.role : 'external' })
  },
  loadTalents() {
    const talents = app.getStorageWithFallback('talents', app.DEFAULT_TALENTS)
    this.setData({ talentList: talents })
  },
  onSearchInput(e) {
    this.setData({ 'filters.search': e.detail.value })
  },
  onGenderChange(e) {
    this.setData({ 'filters.gender': this.data.genderOptions[e.detail.value] })
  },
  onAgeRangeChange(e) {
    this.setData({ 'filters.ageRange': this.data.ageRangeOptions[0][e.detail.value[0]] })
  },
  onLocationChange(e) {
    this.setData({ 'filters.location': this.data.locationOptions[e.detail.value] })
  },
  searchTalents() {
    let talents = app.getStorageWithFallback('talents', app.DEFAULT_TALENTS)
    const filters = this.data.filters
    if (filters.search) {
      talents = talents.filter(t => t.name.toLowerCase().includes(filters.search.toLowerCase()))
    }
    if (filters.gender && filters.gender !== 'All') {
      talents = talents.filter(t => t.gender === filters.gender)
    }
    if (filters.ageRange && filters.ageRange !== 'All') {
      const [min, max] = filters.ageRange.split('-').map(v => parseInt(v) || 0)
      talents = talents.filter(t => t.age >= min && t.age <= (max || Infinity))
    }
    if (filters.location && filters.location !== 'All') {
      talents = talents.filter(t => t.location === filters.location)
    }
    this.setData({ talentList: talents })
  },
  viewCollectedTalents() {
    wx.navigateTo({ url: '/pages/talentList/talentList?mode=collected' })
  },
  collectTalent(e) {
    const talentId = e.detail.id
    let collections = app.getStorageWithFallback('collections', app.DEFAULT_COLLECTIONS)
    collections.push({ talentId, userId: app.globalData.openId, timestamp: new Date() })
    app.setStorage('collections', collections)
    wx.showToast({ title: 'Talent collected' })
    this.loadTalents() // Refresh talent list
  },
  shareTalent() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  // Manual reset option
  resetData() {
    app.setStorage('users', app.DEFAULT_USERS)
    app.setStorage('talents', app.DEFAULT_TALENTS)
    app.setStorage('collections', app.DEFAULT_COLLECTIONS)
    this.loadTalents()
    wx.showToast({ title: 'Data reset to defaults' })
  }
})
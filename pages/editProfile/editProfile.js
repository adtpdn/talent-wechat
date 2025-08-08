const app = getApp()
Page({
  data: {
    userRole: '',
    profile: {},
    genderOptions: ['Select', 'Male', 'Female'],
    locationOptions: ['Select', 'China', 'Not China']
  },
  onLoad() {
    this.checkUserRole()
    this.loadProfile()
  },
  checkUserRole() {
    const openId = app.globalData.openId
    const users = wx.getStorageSync('users') || []
    const user = users.find(u => u._openid === openId)
    this.setData({ userRole: user ? user.role : 'external' })
  },
  loadProfile() {
    const openId = app.globalData.openId
    const talents = wx.getStorageSync('talents') || []
    const profile = talents.find(t => t._openid === openId) || {}
    this.setData({ profile })
  },
  inputName(e) { this.setData({ 'profile.name': e.detail.value }) },
  inputGender(e) { this.setData({ 'profile.gender': this.data.genderOptions[e.detail.value] }) },
  inputAge(e) { this.setData({ 'profile.age': e.detail.value }) },
  inputHeight(e) { this.setData({ 'profile.height': e.detail.value }) },
  inputWeight(e) { this.setData({ 'profile.weight': e.detail.value }) },
  inputGenre(e) { this.setData({ 'profile.genre': e.detail.value }) },
  inputArtistType(e) { this.setData({ 'profile.artistType': e.detail.value }) },
  inputCitizenship(e) { this.setData({ 'profile.citizenship': e.detail.value }) },
  inputEthnicity(e) { this.setData({ 'profile.ethnicity': e.detail.value }) },
  inputBodyType(e) { this.setData({ 'profile.bodyType': e.detail.value }) },
  inputEyeColor(e) { this.setData({ 'profile.eyeColor': e.detail.value }) },
  inputHairColor(e) { this.setData({ 'profile.hairColor': e.detail.value }) },
  inputMandarinLevel(e) { this.setData({ 'profile.mandarinLevel': e.detail.value }) },
  inputEnglishLevel(e) { this.setData({ 'profile.englishLevel': e.detail.value }) },
  inputOtherLanguages(e) { this.setData({ 'profile.otherLanguages': e.detail.value }) },
  inputAccents(e) { this.setData({ 'profile.accents': e.detail.value }) },
  inputBustWaistHips(e) { this.setData({ 'profile.bustWaistHips': e.detail.value }) },
  inputLocation(e) { this.setData({ 'profile.location': this.data.locationOptions[e.detail.value] }) },
  saveProfile() {
    const openId = app.globalData.openId
    let talents = wx.getStorageSync('talents') || []
    const index = talents.findIndex(t => t._openid === openId)
    if (index !== -1) {
      talents[index] = this.data.profile
    } else {
      this.data.profile._id = 'talent' + (talents.length + 1)
      this.data.profile._openid = openId
      talents.push(this.data.profile)
    }
    wx.setStorageSync('talents', talents)
    wx.navigateBack()
  }
})
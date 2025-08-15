
const { debounce } = require('../../utils/utils');
const app = getApp();

Page({
  data: {
    userRole: '',
    userInfo: {},
    talentList: [],
    filters: {
      gender: 'All',
      ageRange: 'All',
      location: 'All',
      search: ''
    },
    genderOptions: ['All', 'Male', 'Female'],
    ageRangeOptions: [['All', '18-25', '26-35', '36-50', '50+']],
    locationOptions: ['All', 'China', 'Not China'],
    sliderWidth: 0 // For dynamic width adjustment
  },

  onLoad() {
    this.checkUserRole();
    this.loadUserInfo();
    this.loadTalents();
    this.adjustSliderWidth();
  },

  onShow() {
    this.loadTalents();
  },

  checkUserRole() {
    const openId = app.globalData.openId;
    const users = app.getStorageWithFallback('users', app.DEFAULT_USERS);
    const user = users.find(u => u._openid === openId);
    this.setData({ userRole: user ? user.role : 'external' });
  },

  loadUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    } else {
      wx.getUserProfile({
        desc: 'Used to display your profile',
        success: res => {
          app.globalData.userInfo = res.userInfo;
          wx.setStorageSync('userInfo', res.userInfo);
          this.setData({ userInfo: res.userInfo });
        },
        fail: () => {
          this.setData({ userInfo: { nickName: 'Anonymous', avatarUrl: '/images/talent.jpg' } });
        }
      });
    }
  },

  loadTalents() {
    const talents = app.getStorageWithFallback('talents', app.DEFAULT_TALENTS);
    this.setData({ talentList: talents });
    this.searchTalents();
  },

  onSearchInput(e) {
    this.setData({ 'filters.search': e.detail.value });
    this.searchTalents();
  },

  onGenderChange(e) {
    this.setData({ 'filters.gender': this.data.genderOptions[e.detail.value] });
    this.searchTalents();
  },

  onAgeRangeChange(e) {
    this.setData({ 'filters.ageRange': this.data.ageRangeOptions[0][e.detail.value[0]] });
    this.searchTalents();
  },

  onLocationChange(e) {
    this.setData({ 'filters.location': this.data.locationOptions[e.detail.value] });
    this.searchTalents();
  },

  searchTalents: debounce(function () {
    let talents = app.getStorageWithFallback('talents', app.DEFAULT_TALENTS);
    const filters = this.data.filters;

    if (filters.search) {
      talents = talents.filter(t =>
        t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (t.attributes && t.attributes.some(attr =>
          attr.toLowerCase().includes(filters.search.toLowerCase())
        ))
      );
    }

    if (filters.gender && filters.gender !== 'All') {
      talents = talents.filter(t => t.gender === filters.gender);
    }

    if (filters.ageRange && filters.ageRange !== 'All') {
      if (filters.ageRange === '50+') {
        talents = talents.filter(t => t.age >= 50);
      } else {
        const [min, max] = filters.ageRange.split('-').map(v => parseInt(v) || 0);
        talents = talents.filter(t => t.age >= min && t.age <= (max || Infinity));
      }
    }

    if (filters.location && filters.location !== 'All') {
      talents = talents.filter(t => t.location === filters.location);
    }

    this.setData({ talentList: talents });
    wx.showToast({
      title: talents.length ? `${talents.length} talents found` : 'No talents found',
      icon: talents.length ? 'success' : 'none'
    });
  }, 300),

  viewCollectedTalents() {
    wx.navigateTo({ url: '/pages/talentList/talentList?mode=collected' });
  },

  collectTalent(e) {
    const talentId = e.currentTarget.dataset.id;
    let collections = app.getStorageWithFallback('collections', app.DEFAULT_COLLECTIONS);
    collections.push({
      talentId,
      userId: app.globalData.openId,
      timestamp: new Date()
    });
    app.setStorage('collections', collections);
    wx.showToast({ title: 'Talent collected' });
    this.loadTalents();
  },

  loadFromWeCom() {
    app.loadFromWeComSpreadsheet(data => {
      this.loadTalents();
      wx.showToast({ title: 'Data loaded from WeCom' });
    });
  },

  resetData() {
    app.setStorage('users', app.DEFAULT_USERS);
    app.setStorage('talents', app.DEFAULT_TALENTS);
    app.setStorage('collections', app.DEFAULT_COLLECTIONS);
    this.loadTalents();
    wx.showToast({ title: 'Data reset to defaults' });
  },

  adjustSliderWidth() {
    const query = wx.createSelectorQuery();
    query.select('.filter-section').boundingClientRect(rect => {
      if (rect) {
        this.setData({ sliderWidth: rect.width });
      }
    }).exec();
  },

  navigateToProfile() {
    wx.navigateTo({
      url: '/pages/myProfile/myProfile',
      fail: err => {
        console.error('Navigation to profile failed:', err);
        wx.showToast({
          title: 'Failed to open profile',
          icon: 'none'
        });
      }
    });
  }
});

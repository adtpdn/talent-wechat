// utils.js (or include this directly in the page if not using a separate utils file)
const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Page JavaScript
const app = getApp();

Page({
  data: {
    userRole: '',
    talentList: [],
    filters: {
      gender: 'All',
      ageRange: 'All',
      location: 'All',
      search: ''
    },
    genderOptions: ['All', 'Male', 'Female'],
    ageRangeOptions: [['All'], ['18-25', '26-35', '36-50', '50+']],
    locationOptions: ['All', 'China', 'Not China'],
    sliderWidth: 0 // For dynamic width adjustment
  },

  // Lifecycle: Initialize page
  onLoad() {
    this.checkUserRole();
    this.loadTalents();
    this.adjustSliderWidth(); // Adjust slider width on load
  },

  // Lifecycle: Refresh talents when page is shown
  onShow() {
    this.loadTalents();
  },

  // Check user role based on openId
  checkUserRole() {
    const openId = app.globalData.openId;
    const users = app.getStorageWithFallback('users', app.DEFAULT_USERS);
    const user = users.find(u => u._openid === openId);
    this.setData({ userRole: user ? user.role : 'external' });
  },

  // Load talents from storage
  loadTalents() {
    const talents = app.getStorageWithFallback('talents', app.DEFAULT_TALENTS);
    this.setData({ talentList: talents });
    this.searchTalents(); // Apply filters after loading
  },

  // Handle search input
  onSearchInput(e) {
    this.setData({ 'filters.search': e.detail.value });
    this.searchTalents(); // Trigger search with debounce
  },

  // Handle gender filter change
  onGenderChange(e) {
    this.setData({ 'filters.gender': this.data.genderOptions[e.detail.value] });
    this.searchTalents();
  },

  // Handle age range filter change
  onAgeRangeChange(e) {
    this.setData({ 'filters.ageRange': this.data.ageRangeOptions[0][e.detail.value[0]] });
    this.searchTalents();
  },

  // Handle location filter change
  onLocationChange(e) {
    this.setData({ 'filters.location': this.data.locationOptions[e.detail.value] });
    this.searchTalents();
  },

  // Filter talents based on current filters
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
  }, 300),

  // Navigate to collected talents page
  viewCollectedTalents() {
    wx.navigateTo({ url: '/pages/talentList/talentList?mode=collected' });
  },

  // Collect a talent
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

  // Load data from WeCom spreadsheet
  loadFromWeCom() {
    app.loadFromWeComSpreadsheet(data => {
      this.loadTalents();
      wx.showToast({ title: 'Data loaded from WeCom' });
    });
  },

  // Reset data to defaults
  resetData() {
    app.setStorage('users', app.DEFAULT_USERS);
    app.setStorage('talents', app.DEFAULT_TALENTS);
    app.setStorage('collections', app.DEFAULT_COLLECTIONS);
    this.loadTalents();
    wx.showToast({ title: 'Data reset to defaults' });
  },

  // Adjust slider width dynamically
  adjustSliderWidth() {
    const query = wx.createSelectorQuery();
    query.select('.filter-container').boundingClientRect(rect => {
      if (rect) {
        this.setData({ sliderWidth: rect.width });
      }
    }).exec();
  }
});
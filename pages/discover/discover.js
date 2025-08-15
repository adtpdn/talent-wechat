
Page({
  data: {
    talents: [],
    searchQuery: '',
    activeTab: 'all',
    isLoading: false,
    page: 1,
    hasMore: true,
    userRole: 'external'
  },

  onLoad() {
    this.initializePage();
  },

  initializePage() {
    // Set initial data
    this.setData({
      userRole: getApp().globalData.userRole || 'external'
    });

    // Ensure talents are loaded from storage
    const talents = wx.getStorageSync('talents') || [];
    console.log('Initial talents from storage:', talents);

    // If no talents, reload from app.js
    if (!talents.length) {
      console.log('No talents in storage, loading from WeCom...');
      getApp().loadFromWeComSpreadsheet((data) => {
        console.log('Talents loaded from WeCom:', data);
        this.loadTalents();
      });
    } else {
      console.log('Talents found in storage, proceeding to load...');
      this.loadTalents();
    }
  },

  onShow() {
    this.checkNewTalents();
  },

  loadTalents() {
    if (this.data.isLoading || !this.data.hasMore) {
      console.log('Skipping loadTalents: isLoading=', this.data.isLoading, 'hasMore=', this.data.hasMore);
      return;
    }

    this.setData({ isLoading: true });
    console.log('Loading talents for page:', this.data.page, 'tab:', this.data.activeTab);

    setTimeout(() => {
      const filteredTalents = this.filterAndSortTalents();
      console.log('Filtered talents:', filteredTalents);

      const newTalents = filteredTalents.slice(
        (this.data.page - 1) * 5,
        this.data.page * 5
      );
      console.log('New talents for this page:', newTalents);

      this.setData({
        talents: [...this.data.talents, ...newTalents],
        page: this.data.page + 1,
        hasMore: newTalents.length === 5,
        isLoading: false
      });
      console.log('Updated talents in data:', this.data.talents);
    }, 800);
  },

  filterAndSortTalents() {
    let talents = wx.getStorageSync('talents') || [];
    console.log('Raw talents from storage:', talents);

    if (this.data.searchQuery) {
      const query = this.data.searchQuery.toLowerCase();
      talents = talents.filter(talent =>
        (talent.name && talent.name.toLowerCase().includes(query)) ||
        (talent.genre && talent.genre.toLowerCase().includes(query)) ||
        (talent.location && talent.location.toLowerCase().includes(query))
      );
      console.log('Talents after search filter:', talents);
    }

    switch (this.data.activeTab) {
      case 'all':
        console.log('All talents:', talents);
        return talents; // Return all talents without filtering
      case 'trending':
        return talents.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'new':
        return talents.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case 'nearby':
        return talents.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      default: // featured
        const featuredTalents = talents.filter(talent => talent.isFeatured === true);
        console.log('Featured talents:', featuredTalents);
        return featuredTalents;
    }
  },

  onSearchInput(e) {
    const query = e.detail.value.trim();
    console.log('Search input:', query);
    this.setData({
      searchQuery: query,
      talents: [],
      page: 1,
      hasMore: true
    });
    if (!query) {
      console.log('Search query cleared, reloading talents...');
      this.loadTalents();
    }
  },

  onSearchConfirm() {
    console.log('Search confirmed with query:', this.data.searchQuery);
    this.loadTalents();
  },

  onClearSearch() {
    console.log('Clearing search query...');
    this.setData({
      searchQuery: '',
      talents: [],
      page: 1,
      hasMore: true
    });
    this.loadTalents();
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;

    console.log('Switching to tab:', tab);
    this.setData({
      activeTab: tab,
      talents: [],
      page: 1,
      hasMore: true
    });

    this.loadTalents();
  },

  onReachBottom() {
    console.log('Reached bottom, loading more talents...');
    this.loadTalents();
  },

  onPullDownRefresh() {
    console.log('Pull down refresh triggered...');
    wx.stopPullDownRefresh();
    this.setData({
      talents: [],
      page: 1,
      hasMore: true
    });
    this.loadTalents();
  },

  viewTalent(e) {
    const talentId = e.currentTarget.dataset.id;
    console.log('Navigating to talent detail:', talentId);
    wx.navigateTo({
      url: `/pages/talentDetail/talentDetail?id=${talentId}`
    });
  },

  checkNewTalents() {
    const lastVisit = wx.getStorageSync('lastDiscoverVisit') || 0;
    const newCount = this.getNewTalentsCount(lastVisit);

    if (newCount > 0) {
      wx.showToast({
        title: `${newCount} new talents available`,
        icon: 'none',
        duration: 2000
      });
    }

    wx.setStorageSync('lastDiscoverVisit', Date.now());
  },

  getNewTalentsCount(since) {
    const talents = wx.getStorageSync('talents') || [];
    return talents.filter(t => new Date(t.createdAt || 0) > new Date(since)).length;
  },

  onShareAppMessage() {
    return {
      title: 'Discover Amazing Talents',
      path: '/pages/discover/discover'
    };
  }
});

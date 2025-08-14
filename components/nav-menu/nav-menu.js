Component({
  properties: {
    role: {
      type: String,
      value: 'external'
    },
    showTalentDetail: {
      type: Boolean,
      value: false
    },
    talentDetailId: {
      type: String,
      value: ''
    },
    currentPage: {
      type: String,
      value: ''
    }
  },
  
  data: {
    isSmallScreen: false,
    menuOpen: false
  },
  
  lifetimes: {
    attached() {
      wx.getSystemInfo({
        success: res => {
          this.setData({ isSmallScreen: res.windowWidth < 400 })
        }
      })
    }
  },
  
  methods: {
    navigateTo(e) {
      const url = e.currentTarget.dataset.url;
      const page = e.currentTarget.dataset.page;
      
      wx.navigateTo({ url });
      this.triggerEvent('pageChange', { page });
    },
    
    onAddClick() {
      this.triggerEvent('addClick');
    },
    
    toggleMenu() {
      this.setData({ menuOpen: !this.data.menuOpen });
    }
  },
  
  observers: {
    'talentDetailId': function(id) {
      this.setData({
        talentDetailUrl: id ? `/pages/talentDetail/talentDetail?id=${id}` : '/pages/talentDetail/talentDetail'
      })
    }
  }
})
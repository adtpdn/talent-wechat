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
        // Check screen size for responsive design
        wx.getSystemInfo({
          success: res => {
            this.setData({ isSmallScreen: res.windowWidth < 400 })
          }
        })
      }
    },
    methods: {
      navigateTo(e) {
        const url = e.currentTarget.dataset.url
        const page = url.split('/').pop().split('?')[0]
        wx.navigateTo({ url })
        if (this.data.isSmallScreen) {
          this.setData({ menuOpen: false })
        }
        this.triggerEvent('pageChange', { page })
      },
      toggleMenu() {
        this.setData({ menuOpen: !this.data.menuOpen })
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
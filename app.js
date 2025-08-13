App({
    // Default data mimicking a WeCom spreadsheet export
    DEFAULT_USERS: [
      { _openid: 'user1', role: 'external' },
      { _openid: 'user2', role: 'talent' },
      { _openid: 'user3', role: 'staff' }
    ],
    DEFAULT_TALENTS: [
      // Sample talent data (replace with your spreadsheet export)
      {
        _id: 'talent1',
        _openid: 'user2',
        name: 'Alice Smith',
        gender: 'Female',
        age: 25,
        height: 165,
        weight: 55,
        genre: 'Acting',
        artistType: 'Film',
        citizenship: 'China',
        ethnicity: 'Han',
        bodyType: 'Slim',
        eyeColor: 'Brown',
        hairColor: 'Black',
        mandarinLevel: 'Native',
        englishLevel: 'Fluent',
        otherLanguages: 'None',
        accents: 'Beijing',
        bustWaistHips: '32-24-34',
        location: 'China'
      },
      // Add more talents as per your spreadsheet
      {
        _id: 'talent2',
        _openid: 'user1',
        name: 'Bob Johnson',
        gender: 'Male',
        age: 30,
        height: 180,
        weight: 75,
        genre: 'Music',
        artistType: 'Singer',
        citizenship: 'Not China',
        ethnicity: 'Caucasian',
        bodyType: 'Athletic',
        eyeColor: 'Blue',
        hairColor: 'Blonde',
        mandarinLevel: 'Basic',
        englishLevel: 'Native',
        otherLanguages: 'French',
        accents: 'American',
        bustWaistHips: 'N/A',
        location: 'Not China'
      }
    ],
    DEFAULT_COLLECTIONS: [
      { talentId: 'talent1', userId: 'user1', timestamp: new Date() },
      { talentId: 'talent3', userId: 'user1', timestamp: new Date() }
    ],
  
    onLaunch() {
      this.initializeStorage('users', this.DEFAULT_USERS)
      this.initializeStorage('talents', this.DEFAULT_TALENTS)
      this.initializeStorage('collections', this.DEFAULT_COLLECTIONS)
  
      wx.getSystemInfo({
        success: res => {
          const mockOpenId = res.deviceId || 'guest-user-' + Date.now()
          this.globalData.openId = mockOpenId
          let users = this.getStorageWithFallback('users', this.DEFAULT_USERS)
          if (!users.find(u => u._openid === mockOpenId)) {
            users.push({ _openid: mockOpenId, role: 'external' })
            this.setStorage('users', users)
          }
          wx.redirectTo({ url: '/pages/index/index' })
        }
      })
    },
  
    // Helper methods
    initializeStorage(key, defaultData) {
      const storedData = wx.getStorageSync(key)
      if (!storedData || !Array.isArray(storedData)) {
        wx.setStorageSync(key, defaultData)
      }
    },
    getStorageWithFallback(key, defaultData) {
      const data = wx.getStorageSync(key)
      return data && Array.isArray(data) ? data : defaultData
    },
    setStorage(key, data) {
      wx.setStorageSync(key, data)
    },
  
    // Simulate loading from WeCom spreadsheet
    loadFromWeComSpreadsheet(callback) {
      // Mock API call (replace with real API if access is granted)
      wx.showLoading({ title: 'Loading from WeCom...' })
      setTimeout(() => {
        const mockSpreadsheetData = this.DEFAULT_TALENTS // Simulate spreadsheet data
        this.setStorage('talents', mockSpreadsheetData)
        wx.hideLoading()
        if (callback) callback(mockSpreadsheetData)
      }, 1000) // Simulate network delay
    },
  
    globalData: {
      openId: null
    }
  })
App({
    // Default data embedded as constants
    DEFAULT_USERS: [
      { _openid: 'user1', role: 'external' },
      { _openid: 'user2', role: 'talent' },
      { _openid: 'user3', role: 'staff' }
    ],
    DEFAULT_TALENTS: [
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
      },
      {
        _id: 'talent3',
        _openid: 'user3',
        name: 'Chen Wei',
        gender: 'Male',
        age: 40,
        height: 175,
        weight: 70,
        genre: 'Acting',
        artistType: 'Theater',
        citizenship: 'China',
        ethnicity: 'Han',
        bodyType: 'Average',
        eyeColor: 'Black',
        hairColor: 'Black',
        mandarinLevel: 'Native',
        englishLevel: 'Intermediate',
        otherLanguages: 'None',
        accents: 'Shanghai',
        bustWaistHips: 'N/A',
        location: 'China'
      },
      {
        _id: 'talent4',
        _openid: 'user2',
        name: 'Diana Lee',
        gender: 'Female',
        age: 28,
        height: 170,
        weight: 60,
        genre: 'Dance',
        artistType: 'Contemporary',
        citizenship: 'Not China',
        ethnicity: 'Korean',
        bodyType: 'Slim',
        eyeColor: 'Brown',
        hairColor: 'Dark Brown',
        mandarinLevel: 'Intermediate',
        englishLevel: 'Fluent',
        otherLanguages: 'Korean',
        accents: 'None',
        bustWaistHips: '34-26-36',
        location: 'China'
      },
      {
        _id: 'talent5',
        _openid: 'user1',
        name: 'Emma Brown',
        gender: 'Female',
        age: 22,
        height: 160,
        weight: 50,
        genre: 'Modeling',
        artistType: 'Fashion',
        citizenship: 'Not China',
        ethnicity: 'Mixed',
        bodyType: 'Petite',
        eyeColor: 'Green',
        hairColor: 'Brown',
        mandarinLevel: 'Basic',
        englishLevel: 'Native',
        otherLanguages: 'Spanish',
        accents: 'British',
        bustWaistHips: '30-22-32',
        location: 'Not China'
      }
    ],
    DEFAULT_COLLECTIONS: [
      { talentId: 'talent1', userId: 'user1', timestamp: new Date() },
      { talentId: 'talent3', userId: 'user1', timestamp: new Date() }
    ],
  
    onLaunch() {
      // Initialize or restore data from storage with fallback to defaults
      this.initializeStorage('users', this.DEFAULT_USERS)
      this.initializeStorage('talents', this.DEFAULT_TALENTS)
      this.initializeStorage('collections', this.DEFAULT_COLLECTIONS)
  
      // Simulate user authentication in guest mode with a mock user ID
      wx.getSystemInfo({
        success: res => {
          const mockOpenId = res.deviceId || 'guest-user-' + Date.now()
          this.globalData.openId = mockOpenId
          let users = this.getStorageWithFallback('users', this.DEFAULT_USERS)
          if (!users.find(u => u._openid === mockOpenId)) {
            users.push({ _openid: mockOpenId, role: 'external' })
            this.setStorage('users', users)
          }
          // Redirect to index page after login
          wx.redirectTo({ url: '/pages/index/index' })
        }
      })
    },
  
    // Helper methods for storage management
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
  
    globalData: {
      openId: null
    }
  })
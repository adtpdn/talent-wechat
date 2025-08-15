
App({
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
      location: 'Shanghai',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isFeatured: true,
      views: 15.2,
      rating: 4.9,
      createdAt: '2023-05-10T08:00:00Z',
      distance: 10
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
      citizenship: 'USA',
      ethnicity: 'Caucasian',
      bodyType: 'Athletic',
      eyeColor: 'Blue',
      hairColor: 'Blonde',
      mandarinLevel: 'Basic',
      englishLevel: 'Native',
      otherLanguages: 'French',
      accents: 'American',
      bustWaistHips: 'N/A',
      location: 'Los Angeles',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      isFeatured: true,
      views: 10.5,
      rating: 4.7,
      createdAt: '2023-06-15T12:00:00Z',
      distance: 20
    },
    {
      _id: 'talent3',
      _openid: 'user3',
      name: 'Chen Wei',
      gender: 'Male',
      age: 28,
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
      otherLanguages: 'Cantonese',
      accents: 'Shanghai',
      bustWaistHips: 'N/A',
      location: 'Beijing',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      isFeatured: false,
      views: 8.7,
      rating: 4.5,
      createdAt: '2023-07-01T09:30:00Z',
      distance: 15
    },
    {
      _id: 'talent4',
      _openid: 'user2',
      name: 'Emma Li',
      gender: 'Female',
      age: 22,
      height: 160,
      weight: 50,
      genre: 'Dance',
      artistType: 'Contemporary',
      citizenship: 'China',
      ethnicity: 'Han',
      bodyType: 'Slim',
      eyeColor: 'Brown',
      hairColor: 'Brown',
      mandarinLevel: 'Native',
      englishLevel: 'Basic',
      otherLanguages: 'None',
      accents: 'Guangdong',
      bustWaistHips: '30-22-32',
      location: 'Guangzhou',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      isFeatured: true,
      views: 12.3,
      rating: 4.8,
      createdAt: '2023-04-20T14:00:00Z',
      distance: 8
    },
    {
      _id: 'talent5',
      _openid: 'user1',
      name: 'Michael Brown',
      gender: 'Male',
      age: 35,
      height: 182,
      weight: 80,
      genre: 'Modeling',
      artistType: 'Fashion',
      citizenship: 'UK',
      ethnicity: 'Caucasian',
      bodyType: 'Athletic',
      eyeColor: 'Green',
      hairColor: 'Brown',
      mandarinLevel: 'None',
      englishLevel: 'Native',
      otherLanguages: 'Spanish',
      accents: 'British',
      bustWaistHips: 'N/A',
      location: 'London',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      isFeatured: false,
      views: 6.4,
      rating: 4.3,
      createdAt: '2023-08-10T11:00:00Z',
      distance: 50
    }
  ],
  DEFAULT_COLLECTIONS: [
    { talentId: 'talent1', userId: 'user1', timestamp: new Date('2023-08-01T10:00:00Z') },
    { talentId: 'talent3', userId: 'user1', timestamp: new Date('2023-08-02T12:00:00Z') },
    { talentId: 'talent2', userId: 'user2', timestamp: new Date('2023-08-03T14:00:00Z') },
    { talentId: 'talent4', userId: 'user3', timestamp: new Date('2023-08-04T16:00:00Z') },
    { talentId: 'talent5', userId: 'user1', timestamp: new Date('2023-08-05T18:00:00Z') }
  ],

  onLaunch() {
    this.initializeStorage('users', this.DEFAULT_USERS);
    this.initializeStorage('talents', this.DEFAULT_TALENTS);
    this.initializeStorage('collections', this.DEFAULT_COLLECTIONS);

    wx.getSystemInfo({
      success: res => {
        const mockOpenId = res.deviceId || 'guest-user-' + Date.now();
        this.globalData.openId = mockOpenId;
        let users = this.getStorageWithFallback('users', this.DEFAULT_USERS);
        if (!users.find(u => u._openid === mockOpenId)) {
          users.push({ _openid: mockOpenId, role: 'external' });
          this.setStorage('users', users);
        }
        wx.redirectTo({ url: '/pages/index/index' });
      }
    });
  },

  initializeStorage(key, defaultData) {
    const storedData = wx.getStorageSync(key);
    if (!storedData || !Array.isArray(storedData)) {
      console.log(`Initializing storage for ${key} with default data`);
      wx.setStorageSync(key, defaultData);
    }
  },

  getStorageWithFallback(key, defaultData) {
    const data = wx.getStorageSync(key);
    console.log(`Fetching ${key} from storage:`, data);
    return data && Array.isArray(data) ? data : defaultData;
  },

  setStorage(key, data) {
    console.log(`Setting ${key} in storage:`, data);
    wx.setStorageSync(key, data);
  },

  loadFromWeComSpreadsheet(callback) {
    wx.showLoading({ title: 'Loading from WeCom...' });
    setTimeout(() => {
      const mockSpreadsheetData = this.DEFAULT_TALENTS;
      this.setStorage('talents', mockSpreadsheetData);
      wx.hideLoading();
      if (callback) callback(mockSpreadsheetData);
    }, 1000);
  },

  globalData: {
    openId: null
  }
});

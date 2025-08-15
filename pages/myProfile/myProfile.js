Page({
  data: {
    userInfo: {},
    userRole: '',
    openId: '',
    showResetForm: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  },

  onLoad() {
    this.loadUserData();
  },

  loadUserData() {
    const app = getApp();
    const openId = app.globalData.openId;
    const users = wx.getStorageSync('users') || [];
    const user = users.find(u => u._openid === openId) || {};
    const userInfo = wx.getStorageSync('userInfo') || {}; // Assuming userInfo is stored

    this.setData({
      openId,
      userRole: user.role || 'external',
      userInfo
    });
  },

  toggleResetPassword() {
    this.setData({
      showResetForm: !this.data.showResetForm
    });
  },

  onOldPasswordInput(e) {
    this.setData({ oldPassword: e.detail.value });
  },

  onNewPasswordInput(e) {
    this.setData({ newPassword: e.detail.value });
  },

  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  resetPassword() {
    const { oldPassword, newPassword, confirmPassword } = this.data;

    if (!oldPassword || !newPassword || !confirmPassword) {
      wx.showToast({ title: 'All fields are required', icon: 'none' });
      return;
    }

    if (newPassword !== confirmPassword) {
      wx.showToast({ title: 'New passwords do not match', icon: 'none' });
      return;
    }

    const users = wx.getStorageSync('users') || [];
    const openId = getApp().globalData.openId;
    const userIndex = users.findIndex(u => u._openid === openId);

    if (userIndex === -1) {
      wx.showToast({ title: 'User not found', icon: 'none' });
      return;
    }

    if (users[userIndex].password !== oldPassword) {
      wx.showToast({ title: 'Old password incorrect', icon: 'none' });
      return;
    }

    users[userIndex].password = newPassword;
    wx.setStorageSync('users', users);

    wx.showToast({ title: 'Password reset successfully', icon: 'success' });
    this.setData({
      showResetForm: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }
});

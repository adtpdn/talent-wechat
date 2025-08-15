
Component({
  data: {
    showPopup: false,
    searchQuery: '',
    messageText: '',
    selectedTalent: null,
    talents: [
      {
        id: '1',
        name: 'Alice Smith',
        role: 'Designer',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        id: '2',
        name: 'Bob Johnson',
        role: 'Developer',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      {
        id: '3',
        name: 'Carol White',
        role: 'Marketer',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
      },
      {
        id: '4',
        name: 'David Brown',
        role: 'Project Manager',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
      },
      {
        id: '5',
        name: 'Emma Davis',
        role: 'Content Creator',
        avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
      }
    ],
    filteredTalents: []
  },

  lifetimes: {
    attached() {
      // Initialize filteredTalents with all talents
      this.setData({
        filteredTalents: this.data.talents
      });
    }
  },

  methods: {
    togglePopup() {
      this.setData({
        showPopup: !this.data.showPopup,
        searchQuery: '',
        messageText: '',
        selectedTalent: null,
        filteredTalents: this.data.talents
      });
    },

    onSearchInput(e) {
      const query = e.detail.value.trim().toLowerCase();
      const filteredTalents = this.data.talents.filter(talent =>
        talent.name.toLowerCase().includes(query)
      );
      this.setData({
        searchQuery: query,
        filteredTalents
      });
    },

    selectTalent(e) {
      const talentId = e.currentTarget.dataset.id;
      const talent = this.data.talents.find(t => t.id === talentId);
      this.setData({
        selectedTalent: talent,
        messageText: ''
      });
    },

    backToSearch() {
      this.setData({
        selectedTalent: null,
        messageText: '',
        filteredTalents: this.data.talents,
        searchQuery: ''
      });
    },

    onMessageInput(e) {
      this.setData({
        messageText: e.detail.value
      });
    },

    sendMessage() {
      if (!this.data.messageText.trim()) {
        wx.showToast({
          title: 'Please enter a message',
          icon: 'none'
        });
        return;
      }
      wx.showToast({
        title: `Message sent to ${this.data.selectedTalent.name}`,
        icon: 'success'
      });
      // Optionally navigate to a chat page or save message to storage
      // wx.navigateTo({ url: `/pages/chat/chat?id=${this.data.selectedTalent.id}` });
      this.setData({
        showPopup: false,
        selectedTalent: null,
        messageText: '',
        searchQuery: '',
        filteredTalents: this.data.talents
      });
    }
  }
});

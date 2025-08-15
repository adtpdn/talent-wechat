Page({
  data: {
    posts: [],
    conversations: [], // Added for inbox
    activeTab: 'discussions',
    newPostContent: '',
    userInfo: null,
    isLoading: false,
    page: 1,
    hasMore: true,
    isPosting: false,
    userRole: 'external'
  },

  onLoad() {
    this.initializePosts();
    this.initializeConversations();
    this.loadContent();
    this.getUserInfo();
    this.setUserRole();
  },

  onShow() {
    this.checkNewPosts();
    this.checkNewMessages();
  },

  setUserRole() {
    const app = getApp();
    const openId = app.globalData.openId;
    const users = wx.getStorageSync('users') || app.DEFAULT_USERS;
    const user = users.find(u => u._openid === openId) || { role: 'external' };
    this.setData({ userRole: user.role });
  },

  initializePosts() {
    const storedPosts = wx.getStorageSync('communityPosts') || [];
    if (storedPosts.length === 0) {
      const defaultPosts = [
        {
          id: Date.now() - 1000,
          author: {
            name: 'Alice Smith',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
          },
          content: 'Welcome to our community! Share your thoughts!',
          time: '2 hours ago',
          likes: 5,
          comments: [
            {
              id: Date.now() - 3000,
              author: { name: 'Bob Johnson', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
              text: 'This is a great start! Excited to see more posts like this.',
              time: '1 hour ago'
            },
            {
              id: Date.now() - 2500,
              author: { name: 'Carol White', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
              text: 'Love the community vibe here! Any plans for events?',
              time: '45 minutes ago'
            },
            {
              id: Date.now() - 2000,
              author: { name: 'David Brown', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
              text: 'Thanks for sharing! I have some ideas to contribute.',
              time: '30 minutes ago'
            }
          ],
          liked: false,
          showCommentInput: false,
          newCommentText: '',
          isEvent: false,
          isGroupPost: false,
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() - 500,
          author: {
            name: 'Emma Davis',
            avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
          },
          content: 'Anyone interested in a virtual meetup this weekend?',
          time: '1 hour ago',
          likes: 3,
          comments: [
            {
              id: Date.now() - 1500,
              author: { name: 'Frank Wilson', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
              text: 'Count me in! What time are we meeting?',
              time: '20 minutes ago'
            }
          ],
          liked: false,
          showCommentInput: false,
          newCommentText: '',
          isEvent: true,
          isGroupPost: false,
          createdAt: new Date().toISOString()
        }
      ];
      wx.setStorageSync('communityPosts', defaultPosts);
    }
  },

  initializeConversations() {
    const storedConversations = wx.getStorageSync('conversations') || [];
    if (storedConversations.length === 0) {
      const defaultConversations = [
        {
          id: Date.now() - 1000,
          recipient: {
            name: 'Alice Smith',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
          },
          lastMessage: 'Hey, looking forward to the meetup!',
          time: '1 hour ago',
          unreadCount: 2,
          createdAt: new Date().toISOString()
        },
        {
          id: Date.now() - 500,
          recipient: {
            name: 'Bob Johnson',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
          },
          lastMessage: 'Can we discuss the group project?',
          time: '30 minutes ago',
          unreadCount: 0,
          createdAt: new Date().toISOString()
        }
      ];
      wx.setStorageSync('conversations', defaultConversations);
    }
  },

  loadContent() {
    if (this.data.activeTab === 'inbox') {
      this.loadConversations();
    } else {
      this.loadPosts();
    }
  },

  loadPosts() {
    if (this.data.isLoading || !this.data.hasMore) return;

    this.setData({ isLoading: true });

    setTimeout(() => {
      try {
        const newPosts = this.mockFetchPosts(this.data.activeTab, this.data.page);
        const updatedPosts = newPosts.map(post => ({
          ...post,
          liked: post.liked || false,
          showCommentInput: post.showCommentInput || false,
          newCommentText: post.newCommentText || '',
          comments: Array.isArray(post.comments) ? post.comments : []
        }));
        this.setData({
          posts: [...this.data.posts, ...updatedPosts],
          page: this.data.page + 1,
          hasMore: newPosts.length >= 10,
          isLoading: false
        });
      } catch (error) {
        console.error('Error loading posts:', error);
        this.setData({ isLoading: false });
        wx.showToast({ title: 'Failed to load posts', icon: 'none' });
      }
    }, 800);
  },

  mockFetchPosts(tab, page) {
    const allPosts = wx.getStorageSync('communityPosts') || [];
    let filtered = allPosts.map(post => ({
      ...post,
      comments: Array.isArray(post.comments) ? post.comments : []
    }));

    if (tab === 'events') {
      filtered = filtered.filter(p => p.isEvent);
    } else if (tab === 'groups') {
      filtered = filtered.filter(p => p.isGroupPost);
    }

    return filtered.slice((page - 1) * 10, page * 10);
  },

  loadConversations() {
    if (this.data.isLoading || !this.data.hasMore) return;

    this.setData({ isLoading: true });

    setTimeout(() => {
      try {
        const newConversations = this.mockFetchConversations(this.data.page);
        this.setData({
          conversations: [...this.data.conversations, ...newConversations],
          page: this.data.page + 1,
          hasMore: newConversations.length >= 10,
          isLoading: false
        });
      } catch (error) {
        console.error('Error loading conversations:', error);
        this.setData({ isLoading: false });
        wx.showToast({ title: 'Failed to load conversations', icon: 'none' });
      }
    }, 800);
  },

  mockFetchConversations(page) {
    const allConversations = wx.getStorageSync('conversations') || [];
    return allConversations.slice((page - 1) * 10, page * 10);
  },

  getUserInfo() {
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({ userInfo: res.userInfo });
      };
    }
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;

    this.setData({
      activeTab: tab,
      posts: tab !== 'inbox' ? [] : this.data.posts,
      conversations: tab === 'inbox' ? [] : this.data.conversations,
      page: 1,
      hasMore: true
    });
    this.loadContent();
  },

  onPostInput(e) {
    this.setData({ newPostContent: e.detail.value });
  },

  createPost() {
    if (!this.data.newPostContent.trim() || this.data.isPosting) return;

    this.setData({ isPosting: true });

    setTimeout(() => {
      try {
        const newPost = {
          id: Date.now(),
          author: {
            name: this.data.userInfo?.nickName || 'Anonymous',
            avatar: this.data.userInfo?.avatarUrl || '/images/talent.jpg'
          },
          content: this.data.newPostContent,
          time: 'Just now',
          likes: 0,
          comments: [],
          liked: false,
          showCommentInput: false,
          newCommentText: '',
          isEvent: this.data.activeTab === 'events',
          isGroupPost: this.data.activeTab === 'groups',
          createdAt: new Date().toISOString()
        };

        const posts = wx.getStorageSync('communityPosts') || [];
        posts.unshift(newPost);
        wx.setStorageSync('communityPosts', posts);

        this.setData({
          posts: [newPost, ...this.data.posts],
          newPostContent: '',
          isPosting: false
        });

        wx.showToast({
          title: 'Posted successfully',
          icon: 'success'
        });
      } catch (error) {
        console.error('Error creating post:', error);
        this.setData({ isPosting: false });
        wx.showToast({ title: 'Failed to post', icon: 'none' });
      }
    }, 1000);
  },

  likePost(e) {
    const postId = e.currentTarget.dataset.id;
    const posts = this.data.posts.map(post => {
      if (post.id === postId) {
        const liked = !post.liked;
        return {
          ...post,
          liked,
          likes: liked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });

    this.setData({ posts });

    try {
      const allPosts = wx.getStorageSync('communityPosts') || [];
      const updated = allPosts.map(p => {
        if (p.id === postId) {
          const liked = !p.liked;
          return { ...p, liked, likes: liked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      });
      wx.setStorageSync('communityPosts', updated);
    } catch (error) {
      console.error('Error updating likes:', error);
      wx.showToast({ title: 'Failed to like post', icon: 'none' });
    }
  },

  toggleCommentInput(e) {
    const postId = e.currentTarget.dataset.id;
    const posts = this.data.posts.map(post => {
      if (post.id === postId) {
        return { ...post, showCommentInput: !post.showCommentInput };
      }
      return post;
    });
    this.setData({ posts });
  },

  onCommentInput(e) {
    const postId = e.currentTarget.dataset.id;
    const posts = this.data.posts.map(post => {
      if (post.id === postId) {
        return { ...post, newCommentText: e.detail.value };
      }
      return post;
    });
    this.setData({ posts });
  },

  submitComment(e) {
    const postId = e.currentTarget.dataset.id;
    const posts = this.data.posts.map(post => {
      if (post.id === postId && post.newCommentText.trim()) {
        const newComment = {
          id: Date.now(),
          author: {
            name: this.data.userInfo?.nickName || 'Anonymous',
            avatar: this.data.userInfo?.avatarUrl || '/images/talent.jpg'
          },
          text: post.newCommentText,
          time: 'Just now'
        };
        return {
          ...post,
          comments: Array.isArray(post.comments) ? [...post.comments, newComment] : [newComment],
          newCommentText: '',
          showCommentInput: true
        };
      }
      return post;
    });

    this.setData({ posts });

    try {
      const allPosts = wx.getStorageSync('communityPosts') || [];
      const updated = allPosts.map(p => {
        if (p.id === postId && posts.find(p => p.id === postId).newCommentText.trim()) {
          const newComment = {
            id: Date.now(),
            author: {
              name: this.data.userInfo?.nickName || 'Anonymous',
              avatar: this.data.userInfo?.avatarUrl || '/images/talent.jpg'
            },
            text: posts.find(p => p.id === postId).newCommentText,
            time: 'Just now'
          };
          return {
            ...p,
            comments: Array.isArray(p.comments) ? [...p.comments, newComment] : [newComment]
          };
        }
        return p;
      });
      wx.setStorageSync('communityPosts', updated);

      wx.showToast({
        title: 'Comment added',
        icon: 'success'
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      wx.showToast({ title: 'Failed to add comment', icon: 'none' });
    }
  },

  onReachBottom() {
    this.loadContent();
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    this.setData({
      posts: this.data.activeTab !== 'inbox' ? [] : this.data.posts,
      conversations: this.data.activeTab === 'inbox' ? [] : this.data.conversations,
      page: 1,
      hasMore: true
    });
    this.loadContent();
  },

  checkNewPosts() {
    try {
      const lastVisit = wx.getStorageSync('lastCommunityVisit') || 0;
      const newCount = this.getNewPostsCount(lastVisit);

      if (newCount > 0) {
        wx.showToast({
          title: `${newCount} new posts`,
          icon: 'none'
        });
      }
      wx.setStorageSync('lastCommunityVisit', Date.now());
    } catch (error) {
      console.error('Error checking new posts:', error);
    }
  },

  getNewPostsCount(since) {
    const posts = wx.getStorageSync('communityPosts') || [];
    return posts.filter(p => new Date(p.createdAt) > new Date(since)).length;
  },

  checkNewMessages() {
    try {
      const lastVisit = wx.getStorageSync('lastInboxVisit') || 0;
      const newCount = this.getNewMessagesCount(lastVisit);

      if (newCount > 0) {
        wx.showToast({
          title: `${newCount} new messages`,
          icon: 'none'
        });
      }
      wx.setStorageSync('lastInboxVisit', Date.now());
    } catch (error) {
      console.error('Error checking new messages:', error);
    }
  },

  getNewMessagesCount(since) {
    const conversations = wx.getStorageSync('conversations') || [];
    return conversations.filter(c => new Date(c.createdAt) > new Date(since)).length;
  },

  navigateToPostDetail(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/postDetail?id=${postId}`
    });
  },

  navigateToChat(e) {
    const conversationId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/chat?id=${conversationId}`
    });
  }
});
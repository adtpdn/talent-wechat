Component({
    properties: {
      talent: Object,
      userRole: String
    },
    methods: {
      collectTalent(e) {
        this.triggerEvent('collect', { id: e.currentTarget.dataset.id })
      },
      editTalent(e) {
        this.triggerEvent('edit', { id: e.currentTarget.dataset.id })
      },
      shareTalent() {
        this.triggerEvent('share')
      }
    }
  })
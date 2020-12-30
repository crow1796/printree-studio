<script>
import { mapGetters } from 'vuex'
import find from 'lodash/find'

export default {
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    userTypeIs(type){
      const { roles } = this.user
      return find(roles, { name: type}) ? true : false
    }
  }
}
</script>
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
    },
    makeId(length = 5) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
  }
}
</script>
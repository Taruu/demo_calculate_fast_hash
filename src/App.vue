<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <div class="d-flex align-center">
        Hash Demo
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <LoadFile/>
    </v-main>
  </v-app>
</template>

<script>
import LoadFile from './components/LoadFile';

export default {
  name: 'App',

  components: {
    LoadFile,
  },

  data: () => ({

    //
  }),
};
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">

      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Simple demo fast hash calculation
        </h1>

        <p class="subheading font-weight-regular">

        </p>
      </v-col>

      <v-col
          cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          What's next?
        </h2>
        <v-row class="mx-lg-16 mx-lg-auto">
          <v-file-input
              v-model="files"
              color="deep-purple accent-4"
              counter
              label="File input"
              multiple
              placeholder="Select your files"
              prepend-icon="mdi-paperclip"
              outlined

              :show-size="1000"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                  v-if="index < 2"
                  color="deep-purple accent-4"
                  dark
                  label
                  small
              >
                {{ text }}
              </v-chip>

              <span
                  v-else-if="index === 2"
                  class="text-overline grey--text text--darken-3 mx-2"
              >
        +{{ files.length - 2 }} File(s)
      </span>
            </template>
          </v-file-input>
          <v-progress-linear
              v-model="progress"
              class="mx-lg-8"
              color="blue-grey"
              height="25"
          >
            <template>
              <strong>{{ `${nowFileObj.filename} ${this.file_size_str(this.progressNow)} / ${this.file_size_str(this.progressMax)}` }}</strong>
            </template>
          </v-progress-linear>
        </v-row>

      </v-col>

      <v-col
          class="mb-5"
          cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          <v-btn color="primary" v-on:click="start">Start</v-btn>
        </h2>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

import HashCalculation from '../сommon/hash_calculation.js'

export default {
  name: 'LoadFile',

  created() {
    this.hashWorker = new HashCalculation(this.max_progress, this.now_progress, this.file_done)
    this.hashWorker.createWorker().then()
  },
  computed: {
    progress() {
      return Math.round((this.progressNow / this.progressMax) * 100)
    }
  },
  watch: {
    files() {
      this.hashWorker.setFiles(this.files);
    }
  },
  methods: {
    start() {
      this.hashWorker.startHashCalculation().then()
    },
    file_done(fileObj, fileHash) {
      console.log(fileObj, fileHash)
    },
    now_progress: function (progressNow) {
      this.progressNow = progressNow;
    },
    max_progress: function (progressMax) {
      this.progressMax = progressMax
    },
    now_file: function (fileObj) {

    },
    file_size_str(file_size) {
      let str_size = ""
      if (file_size > 1073741824) {
        str_size = `${(file_size / 1073741824).toFixed(2)} GB`
      } else if (file_size > 1048576) {
        str_size = `${(file_size / 1048576).toFixed(2)} MB`
      } else {
        str_size = `${(file_size / 1024).toFixed(2)} KB`
      }
      return str_size
    },
  },
  data: () => ({
    nowFileObj: new File([], ""),
    progressMax: 0,
    progressNow: 0,
    files: [],
    hashWorker: undefined,
  }),
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">

      </v-col>
      <v-col class="mb-4 text-center">
        <h1 class="display-2 font-weight-bold mb-3">
          Simple demo fast hash calculation
        </h1>

        <p class="subheading font-weight-regular">
          A simple example of a quick hash calculation using xxhash. In most supported browsers
        </p>
      </v-col>

      <v-col
          cols="12"
      >
        <h2 class="headline text-center font-weight-bold mb-3">
          Select you files
        </h2>
        <v-row class="mx-lg-16 mx-1 mx-lg-auto">
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
        +{{ files.length - 2 }} File(s)</span>
            </template>
          </v-file-input>
        </v-row>
      </v-col>
      <v-col>
        <v-progress-linear
            :value="progress"
            color="#f7945e"
            height="60"
            striped
        >
          <template>
            <strong>{{
                `${this.nowFileObj.name} ${this.file_size_str(this.progressNow)} / ${this.file_size_str(this.progressMax)}`
              }}</strong>
          </template>
        </v-progress-linear>
      </v-col>
      <v-col
          class="mb-5 text-center"
          cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          <v-btn :loading="startCalc" large x-large color="primary" v-on:click="start">Start</v-btn>
        </h2>
      </v-col>
      <v-col>
        <v-card
            class="mx-auto"
            max-width="auto"
            tile
        >
          <v-card-title>{{ this.doneFiles.length }}/{{ this.files.length }}</v-card-title>
          <v-list-item v-for="item in doneFiles"
                       :key="item.file.name" three-line>
            <v-list-item-content>
              <v-list-item-title>{{ `${item.file.name}` }}</v-list-item-title>
              <v-list-item-subtitle>
                File hash: {{ item.hash }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ `File size: ${file_size_str(item.file.size)} Time: ${item.time}s.` }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import HashCalculation from '../сommon/hash_calculation.js'
import throttle from 'lodash/throttle'

export default {
  name: 'LoadFile',

  created() {
    this.hashWorker = new HashCalculation(this.max_progress, this.now_progress, this.file_done, this.now_file)
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
    },
    doneFiles() {
      if (this.doneFiles.length === this.files.length) this.startCalc = false;
    }

  },
  methods: {
    start() {
      this.hashWorker.startHashCalculation().then()
      this.doneFiles = []
      this.startCalc = true;
    },
    file_done: function (fileObj, fileHash, time) {
      console.log(this.doneFiles)
      console.log(fileObj, fileHash, time)
      this.doneFiles.push({
        file: fileObj,
        hash: fileHash,
        time: time,
      })

    },
    now_progress: throttle(function (progressNow) {
      this.progressNow = progressNow;
    },100),
    max_progress: function (progressMax) {
      this.progressMax = progressMax
    },
    now_file: function (fileObj) {
      this.nowFileObj = fileObj;

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
    doneFiles: [],
    startCalc: false,
    hashWorker: undefined,
  }),
}
</script>

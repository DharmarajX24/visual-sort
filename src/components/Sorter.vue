<template>
  <v-app>
    <div class="d-flex flex-column py-4 px-10 mt-2">
      <v-card class="d-flex x-w-100 pa-4" elevation="5">
        <v-slider v-model="numCount" :disabled="running" class="ml-6" hide-details label="Elements" max="175" min="2" style="max-width: 20rem;"
                  thumb-label="always"></v-slider>
        <v-slider v-model="delay" class="ml-6" hide-details label="Delay(ms)" max="200" min="1" style="max-width: 20rem;"
                  thumb-label="always"></v-slider>
        <v-spacer></v-spacer>
        <v-menu bottom transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" class="purple" color="primary" dark>
              {{ selectedAlgo }}
              <v-icon class="ml-2">mdi-arrow-down-drop-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(a, i) in algorithms" class="ma-0 pa-0" :key="i">
              <v-list-item-title>{{ a }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn class="ml-3" color="success" @click="bubbleSort">
          Start
        </v-btn>
      </v-card>
      <v-card class="d-flex x-w-100 pa-4 mt-4" elevation="5">
        <div id="div-sort-area" class="x-w-100 x-h-100 d-flex justify-center">
          <div v-for="(num, i) in numbers" :key="i" :class="getElemClasses(i)" v-bind:style="{height: num+'%', width: getElemWidth()}">
          </div>
        </div>
      </v-card>
      <v-card class="d-flex x-w-100 pa-4 mt-4" elevation="5">
        <p class="mb-0">Array Accesses: {{ arrayAccesses }}</p>
        <p class="mb-0 ml-6">Comparisons: {{ comps }}</p>
      </v-card>
    </div>
  </v-app>
</template>

<style>
@import url("../css/sorter.css");
</style>

<script>
export default {
  name: "Sorter",
  data: () => ({
    selectedAlgo: "Bubble Sort",
    algorithms: ["Bubble Sort"],
    numCount: 50,
    delay: 10,
    numbers: [],
    curComp: [],
    lastCurRes: "valid",
    running: false,
    arrayAccesses: 0,
    comps: 0
  }),
  methods: {
    async bubbleSort() {
      this.arrayAccesses = 0
      this.comps = 0
      this.running = true
      let n = this.numbers.length
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
          //Clear previous colors
          this.curComp = [j, j+1]
          this.comps++
          this.arrayAccesses++
          if (this.numbers[j] > this.numbers[j + 1]) {
            //Set red
            this.arrayAccesses++
            this.lastCurRes = "invalid"
            let temp = this.numbers[j]
            this.numbers[j] = this.numbers[j + 1]
            this.numbers[j + 1] = temp
          } else {
            //set green
            this.lastCurRes = "valid"
          }
        await this.wait(this.delay)
        }
      }
      console.log(String(this.numbers))
      this.curComp = []
      this.running = false
    },
    getElemClasses(i) {
      let classes = ""
      if (this.curComp.includes(i)) {
        classes = classes + "sort-element sort-cur-comp"
        if (this.lastCurRes === "valid") {
          classes = classes + " sort-comp-valid"
        } else {
          classes = classes + " sort-comp-invalid"
        }
        return classes
      } else {
        return "sort-element"
      }
    },
    getElemWidth() {
      if (this.numCount <= 80) {
        return "12px"
      } else if (this.numCount >= 81 && this.numCount <= 130) {
        return "8px"
      } else {
        return "6px"
      }
    },
    async wait(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const x = 1
          if (x === 1) {
            return resolve(true)
          } else {
            return reject(false)
          }
        }, ms)
      })
    },
    markDone() {
      //Add Success Class
    },
    generateNum(n) {
      this.numbers = []
      console.log(n, this.numbers)
      for (let i = 0; i < n; i++) {
        this.numbers.push(Math.floor((Math.random() * 100) + 1))
        //await this.wait(5)
      }
    }
  },
  created() {
    this.generateNum(50)
  },
  watch: {
    numCount: function () {
      this.generateNum(this.numCount)
    }
  }
}
</script>
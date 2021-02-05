<template>
  <v-app>
    <div class="d-flex flex-column py-4 px-10 mt-2">
      <v-card class="d-flex x-w-100 pa-4" elevation="5">
        <v-slider v-model="numCount" :disabled="running" class="ml-6" hide-details label="Elements" max="175" min="2"
                  style="max-width: 20rem;"
                  thumb-label="always"></v-slider>
        <v-slider v-model="delay" class="ml-6" hide-details label="Delay(ms)" max="200" min="1"
                  style="max-width: 20rem;"
                  thumb-label="always"></v-slider>
        <v-spacer></v-spacer>
        <v-btn :disabled="running" color="success" @click="generateNum(numCount)">
          Shuffle
        </v-btn>
        <v-menu bottom transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" class="purple ml-3" color="primary" dark>
              {{ selectedAlgo }}
              <v-icon class="ml-2">mdi-arrow-down-drop-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(a, i) in algorithms" @click="selectedAlgo=a" :key="i" class="ma-0 pa-0">
              <v-list-item-title class="ma-0 pa-0 unselectable">{{ a }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn :disabled="running" class="ml-3" color="success" @click="sort">
          Start
        </v-btn>
      </v-card>
      <v-card class="d-flex x-w-100 pa-4 mt-4" elevation="5">
        <div id="div-sort-area" class="x-w-100 x-h-100 d-flex justify-center">
          <div v-for="(num, i) in numbers" :key="i" :class="getElemClasses(i)"
               v-bind:style="{height: num+'%', width: getElemWidth()}">
          </div>
        </div>
      </v-card>
      <v-card class="d-flex x-w-100 pa-4 mt-4" elevation="5">
        <p class="mb-0">{{ selectedAlgo }}</p>
        <p class="mb-0 ml-6">Array Accesses: {{ arrayAccesses }}</p>
        <p class="mb-0 ml-6">Comparisons: {{ comps }}</p>
        <p class="mb-0 ml-6">Time: {{ running ? '[sorting]' : time.completion + 'ms' }}</p>
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
    algorithms: ["Bubble Sort", "Cocktail Sort", "Comb Sort", "Insertion Sort", "Selection Sort"],
    numCount: 50,
    delay: 10,
    numbers: [],
    curComp: [],
    lastCurRes: "valid",
    running: false,
    arrayAccesses: 0,
    comps: 0,
    time: { start: 0, end: 0, completion: 0 }
  }),
  methods: {
    sort() {
      const algoToUse = this.selectedAlgo.toLocaleLowerCase()
      switch (algoToUse) {
        case "bubble sort":
          this.bubbleSort()
          break;
        case "selection sort":
          this.selectionSort()
          break;
        case "cocktail sort":
          this.cocktailSort()
          break;
        case "comb sort":
          this.combSort()
          break;
        case "insertion sort":
          this.insertionSort()
          break;
        default:
          alert("Invalid Algorithm Selected!")
      }
    },
    async bubbleSort() {
      this.clearCounts()
      this.running = true
      this.startTimer()
      let n = this.numbers.length
      for (let i = 0; i < n - 1; i++) {
        let sorted = true
        for (let j = 0; j < n - 1 - i; j++) {
          this.curComp = [j, j + 1]
          this.comps++
          this.arrayAccesses++
          if (this.numbers[j] > this.numbers[j + 1]) {
            this.arrayAccesses++
            this.lastCurRes = "invalid"
            let temp = this.numbers[j]
            this.numbers[j] = this.numbers[j + 1]
            this.numbers[j + 1] = temp
            sorted = false
          } else {
            this.lastCurRes = "valid"
          }
          await this.wait(this.delay)
        }
        if (sorted) break;
      }
      console.log(String(this.numbers))
      this.curComp = []
      this.running = false
      this.endTimer()
    },
    async selectionSort() {
      this.clearCounts()
      this.startTimer()
      this.running = true
      for (let i = 0; i < this.numbers.length - 1; i++) {
        let minIndex = i
        for (let j = i + 1; j < this.numbers.length; j++) {
          this.curComp = [j, minIndex]
          this.arrayAccesses++
          this.comps++
          //TODO add exit if sorted
          if (this.numbers[j] < this.numbers[minIndex]) {
            this.lastCurRes = "invalid"
            this.arrayAccesses++
            minIndex = j
          } else {
            this.lastCurRes = "valid"
          }
          await this.wait(this.delay)
        }
        let temp = this.numbers[i]
        this.numbers[i] = this.numbers[minIndex]
        this.numbers[minIndex] = temp
      }
      this.curComp = []
      this.running = false
      this.endTimer()
    },
    async cocktailSort() {
      this.clearCounts()
      this.startTimer()
      this.running = true
      let end = this.numbers.length - 1
      const n = this.numbers.length
      for (let i = 0; i < n - 1; i++) {
        let sorted = true
        for (let j = 0; j < n - 1 - i; j++) {
          this.curComp = [j, j + 1]
          this.comps++
          this.arrayAccesses++
          if (this.numbers[j] > this.numbers[j + 1]) {
            let temp = this.numbers[j]
            this.arrayAccesses++
            this.numbers[j] = this.numbers[j + 1]
            this.numbers[j + 1] = temp
            this.lastCurRes = "invalid"
            sorted = false
          } else {
            this.lastCurRes = "valid"
          }
          await this.wait(this.delay)
        }
        if (sorted) break;
        end--
        for (let k = end; k > 0; k--) {
          this.curComp = [k, k - 1]
          this.comps++
          this.arrayAccesses++
          if (this.numbers[k] < this.numbers[k-1]) {
            let temp = this.numbers[k]
            this.arrayAccesses++
            this.numbers[k] = this.numbers[k - 1]
            this.numbers[k - 1] = temp
            this.lastCurRes = "invalid"
          } else {
            this.lastCurRes = "valid"
          }
          await this.wait(this.delay)
        }
      }
      this.curComp = []
      this.running = false
      this.endTimer()
    },
    async combSort() {
      this.clearCounts()
      this.startTimer()
      this.running = true
      let gap = Math.floor(this.numbers.length / 1.3)
      let sorted = false
      while (!sorted || gap !== 1) {
        sorted = true
        for (let i = 0; i < this.numbers.length - gap; i++) {
          this.arrayAccesses++
          this.comps++
          this.curComp = [i, i + gap]
          if (this.numbers[i] > this.numbers[i + gap]) {
            this.arrayAccesses++
            let temp = this.numbers[i]
            this.numbers[i] = this.numbers[i + gap]
            this.numbers[i + gap] = temp
            sorted = false
            this.lastCurRes = "invalid"
          } else {
            this.lastCurRes = "valid"
          }
          await this.wait(this.delay)
        }
        gap = Math.floor(gap / 1.3) < 1 ? 1 : Math.floor(gap / 1.3)
        if (sorted) break;
      }
      this.curComp = []
      this.running = false
      this.endTimer()
    },
    async insertionSort() {
      this.clearCounts()
      this.startTimer()
      this.running = true
      for (let i = 1; i < this.numbers.length; i++) {
        let preIndex = i - 1
        let key = this.numbers[i]
        while (this.numbers[preIndex] > key && preIndex >= 0) {
          this.curComp = [i, preIndex]
          this.lastCurRes = "invalid"
          this.arrayAccesses++
          this.comps++
          console.log('Comparing', this.numbers[i], this.numbers[i - preIndex]);
          this.numbers[preIndex + 1] = this.numbers[preIndex]
          preIndex = preIndex - 1
          await this.wait(this.delay)
        }
        this.lastCurRes = "valid"
        await this.wait(this.delay)
        this.numbers[preIndex + 1] = key
        this.arrayAccesses++
      }
      this.curComp = []
      this.running = false
      this.endTimer()
    },
    startTimer() {
      this.time.start = Date.now()
    },
    endTimer() {
      this.time.end = Date.now()
      this.time.completion = this.time.end - this.time.start
    },
    clearCounts() {
      this.arrayAccesses = 0
      this.comps = 0
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
<script setup lang="ts">
    import { ref } from 'vue'
    
    const inputValue = ref('500')
    
    const handleNumberClick = (num: string) => {
      if (inputValue.value === '0') {
        inputValue.value = num
      } else {
        inputValue.value += num
      }
    }
    
    const handleClear = () => {
      inputValue.value = '0'
    }
    
    const handleBackspace = () => {
      if (inputValue.value.length > 1) {
        inputValue.value = inputValue.value.slice(0, -1)
      } else {
        inputValue.value = '0'
      }
    }
    </script>
    
    <template>
      <div class="flex flex-col justify-center items-start flex-1 self-stretch rounded-2xl bg-white overflow-hidden">
        <div class="flex items-start flex-1 self-stretch bg-ash-200">
          <!-- Input & Numpad -->
          <div class="flex flex-col items-center flex-1 self-stretch border-r border-border-primary overflow-hidden">
            <!-- Input Display -->
            <div class="flex h-[170px] px-10 justify-end items-center gap-2 self-stretch border-b-2 border-ash-200 bg-white">
              <div class="flex pt-0.5 items-center gap-2.5 self-stretch">
                <div class="flex w-8 h-8 justify-center items-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.33301 20H11.9997C11.9997 21.44 13.8263 22.6667 15.9997 22.6667C18.173 22.6667 19.9997 21.44 19.9997 20C19.9997 18.5333 18.613 18 15.6797 17.2933C12.853 16.5867 9.33301 15.7067 9.33301 12C9.33301 9.61333 11.293 7.58667 13.9997 6.90667V4H17.9997V6.90667C20.7063 7.58667 22.6663 9.61333 22.6663 12H19.9997C19.9997 10.56 18.173 9.33333 15.9997 9.33333C13.8263 9.33333 11.9997 10.56 11.9997 12C11.9997 13.4667 13.3863 14 16.3197 14.7067C19.1463 15.4133 22.6663 16.2933 22.6663 20C22.6663 22.3867 20.7063 24.4133 17.9997 25.0933V28H13.9997V25.0933C11.293 24.4133 9.33301 22.3867 9.33301 20Z" fill="#F7B84B"/>
                  </svg>
                </div>
              </div>
              <div class="text-ash-800 text-right font-inter text-[56px] font-semibold leading-[120%]">
                {{ inputValue }}
              </div>
            </div>
    
            <!-- Numpad -->
            <div class="flex flex-col items-start flex-1 self-stretch">
              <!-- Row 1 -->
              <div class="flex items-center flex-1 self-stretch">
                <button
                  @click="handleNumberClick('1')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">1</div>
                </button> 
                <button
                  @click="handleNumberClick('2')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">2</div>
                </button>
                <button
                  @click="handleNumberClick('3')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">3</div>
                </button>
              </div>
    
              <!-- Row 2 -->
              <div class="flex items-center flex-1 self-stretch">
                <button
                  @click="handleNumberClick('4')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">4</div>
                </button>
                <button
                  @click="handleNumberClick('5')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">5</div>
                </button>
                <button
                  @click="handleNumberClick('6')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">6</div>
                </button>
              </div>
    
              <!-- Row 3 -->
              <div class="flex items-center flex-1 self-stretch">
                <button
                  @click="handleNumberClick('7')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">7</div>
                </button>
                <button
                  @click="handleNumberClick('8')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">8</div>
                </button>
                <button
                  @click="handleNumberClick('9')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-b-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">9</div>
                </button>
              </div>
    
              <!-- Row 4 -->
              <div class="flex items-center flex-1 self-stretch">
                <button
                  @click="handleClear"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-gray-500 text-center font-inter text-[40px] font-semibold leading-[120%]">C</div>
                </button>
                <button
                  @click="handleNumberClick('0')"
                  class="flex flex-col justify-center items-center flex-1 self-stretch border-r-2 border-ash-300 bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <div class="self-stretch text-ash-700 text-center font-inter text-[40px] font-semibold leading-[120%]">0</div>
                </button>
                <button
                  @click="handleBackspace"
                  class="flex flex-col justify-center items-center flex-1 self-stretch bg-ash-100 hover:bg-ash-200 transition-colors"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.3337 22.3333L26.5003 25.5C26.8059 25.8055 27.1948 25.9583 27.667 25.9583C28.1392 25.9583 28.5281 25.8055 28.8337 25.5C29.1392 25.1944 29.292 24.8055 29.292 24.3333C29.292 23.8611 29.1392 23.4722 28.8337 23.1666L25.667 20L28.8337 16.8333C29.1392 16.5277 29.292 16.1388 29.292 15.6666C29.292 15.1944 29.1392 14.8055 28.8337 14.5C28.5281 14.1944 28.1392 14.0416 27.667 14.0416C27.1948 14.0416 26.8059 14.1944 26.5003 14.5L23.3337 17.6666L20.167 14.5C19.8614 14.1944 19.4725 14.0416 19.0003 14.0416C18.5281 14.0416 18.1392 14.1944 17.8337 14.5C17.5281 14.8055 17.3753 15.1944 17.3753 15.6666C17.3753 16.1388 17.5281 16.5277 17.8337 16.8333L21.0003 20L17.8337 23.1666C17.5281 23.4722 17.3753 23.8611 17.3753 24.3333C17.3753 24.8055 17.5281 25.1944 17.8337 25.5C18.1392 25.8055 18.5281 25.9583 19.0003 25.9583C19.4725 25.9583 19.8614 25.8055 20.167 25.5L23.3337 22.3333ZM15.0003 33.3333C14.4725 33.3333 13.9725 33.215 13.5003 32.9783C13.0281 32.7416 12.6392 32.4155 12.3337 32L4.83366 22C4.38921 21.4166 4.16699 20.75 4.16699 20C4.16699 19.25 4.38921 18.5833 4.83366 18L12.3337 7.99996C12.6392 7.58329 13.0281 7.25718 13.5003 7.02163C13.9725 6.78607 14.4725 6.66774 15.0003 6.66663H33.3337C34.2503 6.66663 35.0353 6.99329 35.6887 7.64663C36.342 8.29996 36.6681 9.0844 36.667 9.99996V30C36.667 30.9166 36.3409 31.7016 35.6887 32.355C35.0364 33.0083 34.2514 33.3344 33.3337 33.3333H15.0003Z" fill="#9297A1"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
    
          <!-- Payment Methods -->
          <div class="flex flex-col items-start self-stretch border-r border-border-primary">
            <div class="flex flex-col items-start gap-px flex-1 self-stretch overflow-hidden">
              <button class="flex w-[280px] h-[90px] min-w-[100px] max-w-[280px] px-4 pr-6 justify-center items-center gap-4 bg-ash-600 hover:bg-ash-700 transition-colors">
                <div class="flex w-7 h-7 justify-center items-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0003 3.50002C8.20134 3.50002 3.50033 8.20103 3.50033 14C3.50033 19.799 8.20134 24.5 14.0003 24.5C19.7993 24.5 24.5003 19.799 24.5003 14C24.5003 8.20103 19.7993 3.50002 14.0003 3.50002ZM1.16699 14C1.16699 6.91237 6.91267 1.16669 14.0003 1.16669C21.088 1.16669 26.8337 6.91237 26.8337 14C26.8337 21.0877 21.088 26.8334 14.0003 26.8334C6.91267 26.8334 1.16699 21.0877 1.16699 14Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0003 5.83337C14.6447 5.83337 15.167 6.35571 15.167 7.00004V8.16671H18.667C19.3113 8.16671 19.8337 8.68904 19.8337 9.33337C19.8337 9.97771 19.3113 10.5 18.667 10.5H15.167V12.8334H16.3337C17.2619 12.8334 18.1522 13.2021 18.8085 13.8585C19.4649 14.5149 19.8337 15.4051 19.8337 16.3334C19.8337 17.2616 19.4649 18.1519 18.8085 18.8082C18.1522 19.4646 17.2619 19.8334 16.3337 19.8334H15.167V21C15.167 21.6444 14.6447 22.1667 14.0003 22.1667C13.356 22.1667 12.8337 21.6444 12.8337 21V19.8334H9.33366C8.68933 19.8334 8.16699 19.311 8.16699 18.6667C8.16699 18.0224 8.68933 17.5 9.33366 17.5H12.8337V15.1667H11.667C10.7387 15.1667 9.8485 14.798 9.19212 14.1416C8.53574 13.4852 8.16699 12.595 8.16699 11.6667C8.16699 10.7384 8.53574 9.84821 9.19212 9.19183C9.8485 8.53546 10.7387 8.16671 11.667 8.16671H12.8337V7.00004C12.8337 6.35571 13.356 5.83337 14.0003 5.83337ZM12.8337 10.5H11.667C11.3576 10.5 11.0608 10.623 10.842 10.8418C10.6232 11.0605 10.5003 11.3573 10.5003 11.6667C10.5003 11.9761 10.6232 12.2729 10.842 12.4917C11.0608 12.7105 11.3576 12.8334 11.667 12.8334H12.8337V10.5ZM15.167 15.1667V17.5H16.3337C16.6431 17.5 16.9398 17.3771 17.1586 17.1583C17.3774 16.9395 17.5003 16.6428 17.5003 16.3334C17.5003 16.024 17.3774 15.7272 17.1586 15.5084C16.9398 15.2896 16.6431 15.1667 16.3337 15.1667H15.167Z" fill="white"/>
                  </svg>
                </div>
                <div class="text-white text-center font-noto text-[22px] font-medium leading-[120%]">現 金</div>
              </button>
              <button class="flex w-[280px] h-[90px] min-w-[100px] max-w-[280px] px-4 pr-6 justify-center items-center gap-4 bg-ash-600 hover:bg-ash-700 transition-colors">
                <div class="flex w-7 h-7 justify-center items-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.66699 7.00002C4.02266 7.00002 3.50033 7.52235 3.50033 8.16669V19.8334C3.50033 20.4777 4.02266 21 4.66699 21H23.3337C23.978 21 24.5003 20.4777 24.5003 19.8334V8.16669C24.5003 7.52235 23.978 7.00002 23.3337 7.00002H4.66699ZM1.16699 8.16669C1.16699 6.23369 2.734 4.66669 4.66699 4.66669H23.3337C25.2667 4.66669 26.8337 6.23369 26.8337 8.16669V19.8334C26.8337 21.7664 25.2667 23.3334 23.3337 23.3334H4.66699C2.734 23.3334 1.16699 21.7664 1.16699 19.8334V8.16669Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.16699 11.6667C1.16699 11.0223 1.68933 10.5 2.33366 10.5H25.667C26.3113 10.5 26.8337 11.0223 26.8337 11.6667C26.8337 12.311 26.3113 12.8333 25.667 12.8333H2.33366C1.68933 12.8333 1.16699 12.311 1.16699 11.6667Z" fill="white"/>
                  </svg>
                </div>
                <div class="text-white text-center font-noto text-[22px] font-medium leading-[120%]">信 用 卡</div>
              </button>
              <button class="flex w-[280px] h-[90px] min-w-[100px] max-w-[280px] px-4 pr-6 justify-center items-center gap-4 bg-ash-600 hover:bg-ash-700 transition-colors">
                <div class="flex w-7 h-7 justify-center items-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.00033 23.3333C7.00033 23.6639 6.88833 23.9412 6.66433 24.1652C6.44033 24.3892 6.16344 24.5008 5.83366 24.5H2.33366C2.0031 24.5 1.72621 24.388 1.50299 24.164C1.27977 23.94 1.16777 23.6631 1.16699 23.3333V19.8333C1.16699 19.5028 1.27899 19.2259 1.50299 19.0027C1.72699 18.7794 2.00388 18.6674 2.33366 18.6667C2.66344 18.6659 2.94071 18.7779 3.16549 19.0027C3.39027 19.2274 3.50188 19.5043 3.50033 19.8333V22.1667H5.83366C6.16421 22.1667 6.44149 22.2787 6.66549 22.5027C6.88949 22.7267 7.0011 23.0036 7.00033 23.3333ZM25.667 18.6667C25.9975 18.6667 26.2748 18.7787 26.4988 19.0027C26.7228 19.2267 26.8344 19.5036 26.8337 19.8333V23.3333C26.8337 23.6639 26.7217 23.9412 26.4977 24.1652C26.2737 24.3892 25.9968 24.5008 25.667 24.5H22.167C21.8364 24.5 21.5595 24.388 21.3363 24.164C21.1131 23.94 21.0011 23.6631 21.0003 23.3333C20.9995 23.0036 21.1115 22.7267 21.3363 22.5027C21.5611 22.2787 21.838 22.1667 22.167 22.1667H24.5003V19.8333C24.5003 19.5028 24.6123 19.2259 24.8363 19.0027C25.0603 18.7794 25.3372 18.6674 25.667 18.6667ZM5.25033 21C5.09477 21 4.95866 20.9417 4.84199 20.825C4.72533 20.7083 4.66699 20.5722 4.66699 20.4167V7.58333C4.66699 7.42778 4.72533 7.29167 4.84199 7.175C4.95866 7.05833 5.09477 7 5.25033 7H6.41699C6.57255 7 6.70866 7.05833 6.82533 7.175C6.94199 7.29167 7.00033 7.42778 7.00033 7.58333V20.4167C7.00033 20.5722 6.94199 20.7083 6.82533 20.825C6.70866 20.9417 6.57255 21 6.41699 21H5.25033ZM8.75033 21C8.59477 21 8.45866 20.9417 8.34199 20.825C8.22533 20.7083 8.16699 20.5722 8.16699 20.4167V7.58333C8.16699 7.42778 8.22533 7.29167 8.34199 7.175C8.45866 7.05833 8.59477 7 8.75033 7C8.90588 7 9.04199 7.05833 9.15866 7.175C9.27533 7.29167 9.33366 7.42778 9.33366 7.58333V20.4167C9.33366 20.5722 9.27533 20.7083 9.15866 20.825C9.04199 20.9417 8.90588 21 8.75033 21ZM12.2503 21C12.0948 21 11.9587 20.9417 11.842 20.825C11.7253 20.7083 11.667 20.5722 11.667 20.4167V7.58333C11.667 7.42778 11.7253 7.29167 11.842 7.175C11.9587 7.05833 12.0948 7 12.2503 7H13.417C13.5725 7 13.7087 7.05833 13.8253 7.175C13.942 7.29167 14.0003 7.42778 14.0003 7.58333V20.4167C14.0003 20.5722 13.942 20.7083 13.8253 20.825C13.7087 20.9417 13.5725 21 13.417 21H12.2503ZM15.7503 21C15.5948 21 15.4587 20.9417 15.342 20.825C15.2253 20.7083 15.167 20.5722 15.167 20.4167V7.58333C15.167 7.42778 15.2253 7.29167 15.342 7.175C15.4587 7.05833 15.5948 7 15.7503 7H18.0837C18.2392 7 18.3753 7.05833 18.492 7.175C18.6087 7.29167 18.667 7.42778 18.667 7.58333V20.4167C18.667 20.5722 18.6087 20.7083 18.492 20.825C18.3753 20.9417 18.2392 21 18.0837 21H15.7503ZM20.417 21C20.2614 21 20.1253 20.9417 20.0087 20.825C19.892 20.7083 19.8337 20.5722 19.8337 20.4167V7.58333C19.8337 7.42778 19.892 7.29167 20.0087 7.175C20.1253 7.05833 20.2614 7 20.417 7C20.5725 7 20.7087 7.05833 20.8253 7.175C20.942 7.29167 21.0003 7.42778 21.0003 7.58333V20.4167C21.0003 20.5722 20.942 20.7083 20.8253 20.825C20.7087 20.9417 20.5725 21 20.417 21ZM22.7503 21C22.5948 21 22.4587 20.9417 22.342 20.825C22.2253 20.7083 22.167 20.5722 22.167 20.4167V7.58333C22.167 7.42778 22.2253 7.29167 22.342 7.175C22.4587 7.05833 22.5948 7 22.7503 7C22.9059 7 23.042 7.05833 23.1587 7.175C23.2753 7.29167 23.3337 7.42778 23.3337 7.58333V20.4167C23.3337 20.5722 23.2753 20.7083 23.1587 20.825C23.042 20.9417 22.9059 21 22.7503 21ZM7.00033 4.66667C7.00033 4.99722 6.88833 5.2745 6.66433 5.4985C6.44033 5.7225 6.16344 5.83411 5.83366 5.83333H3.50033V8.16667C3.50033 8.49722 3.38833 8.7745 3.16433 8.9985C2.94033 9.2225 2.66344 9.33411 2.33366 9.33333C2.00388 9.33256 1.72699 9.22056 1.50299 8.99733C1.27899 8.77411 1.16699 8.49722 1.16699 8.16667V4.66667C1.16699 4.33611 1.27899 4.05922 1.50299 3.836C1.72699 3.61278 2.00388 3.50078 2.33366 3.5H5.83366C6.16421 3.5 6.44149 3.612 6.66549 3.836C6.88949 4.06 7.0011 4.33689 7.00033 4.66667ZM21.0003 4.66667C21.0003 4.33611 21.1123 4.05922 21.3363 3.836C21.5603 3.61278 21.8372 3.50078 22.167 3.5H25.667C25.9975 3.5 26.2748 3.612 26.4988 3.836C26.7228 4.06 26.8344 4.33689 26.8337 4.66667V8.16667C26.8337 8.49722 26.7217 8.7745 26.4977 8.9985C26.2737 9.2225 25.9968 9.33411 25.667 9.33333C25.3372 9.33256 25.0603 9.22056 24.8363 8.99733C24.6123 8.77411 24.5003 8.49722 24.5003 8.16667V5.83333H22.167C21.8364 5.83333 21.5595 5.72133 21.3363 5.49733C21.1131 5.27333 21.0011 4.99644 21.0003 4.66667Z" fill="white"/>
                  </svg>
                </div>
                <div class="text-white text-center font-noto text-[22px] font-medium leading-[120%]">電子支付</div>
              </button>
              <button class="flex w-[280px] h-[90px] min-w-[100px] max-w-[280px] px-4 justify-center items-center gap-2 bg-ash-600 hover:bg-ash-700 transition-colors">
                <div class="text-white text-center font-noto text-[22px] font-medium leading-[120%]">SOGO 現金券</div>
              </button>
            </div>
          </div>
        </div>
    
        <!-- Bottom Actions -->
        <div class="flex h-[122px] p-4 items-start gap-4 self-stretch border-t border-ash-200">
          <button class="flex w-[140px] h-[90px] px-4 justify-center items-center gap-2 rounded-2xl bg-ash-600 hover:bg-ash-700 transition-colors">
            <div class="w-[87px] flex-shrink-0 text-white text-center font-noto text-[28px] font-medium leading-[128%] tracking-[1.12px]">發票</div>
          </button>
          <div class="flex justify-end items-center gap-4 flex-1">
            <button class="flex w-[180px] h-[90px] px-4 justify-center items-center gap-2 rounded-2xl bg-ash-600 hover:bg-ash-700 transition-colors">
              <div class="w-[87px] flex-shrink-0 text-white text-center font-noto text-[28px] font-medium leading-[128%] tracking-[1.12px]">暫存</div>
            </button>
            <button class="flex w-[220px] h-[90px] min-w-[180px] max-w-[220px] px-4 justify-center items-center gap-2 rounded-2xl bg-indianred-600 hover:bg-indianred-600/90 transition-colors">
              <div class="text-white text-center font-noto text-[28px] font-medium leading-[128%] tracking-[1.12px]">完成結帳</div>
            </button>
          </div>
        </div>
      </div>
    </template>
    
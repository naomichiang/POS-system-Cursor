<script setup lang="ts">
    import { ref } from 'vue'
    
    interface PaymentItem {
      type: 'cash' | 'credit'
      amount: number
    }
    
    const payments = ref<PaymentItem[]>([
      { type: 'cash', amount: 5500 },
      { type: 'credit', amount: 17500 },
      { type: 'cash', amount: 8000 },
    ])
    
    const removePayment = (index: number) => {
      payments.value.splice(index, 1)
    }
    </script>
    
    <template>
      <div class="flex h-[938px] flex-col justify-center items-center">
        <div class="flex w-[440px] flex-col items-center flex-1 rounded-2xl shadow-lg overflow-hidden">
          <!-- Header -->
          <div class="flex w-[440px] h-[72px] items-start">
            <div class="flex w-[160px] px-6 flex-col justify-center items-center flex-shrink-0 self-stretch bg-ash-900">
              <div class="text-white text-center font-noto text-[22px] font-normal leading-[120%]">2Ａ桌</div>
            </div>
            <div class="flex justify-center items-center gap-6 flex-1 self-stretch bg-ash-700">
              <div class="flex items-center gap-1">
                <div class="flex w-8 h-8 justify-center items-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9997 16C14.533 16 13.2775 15.4778 12.233 14.4333C11.1886 13.3889 10.6663 12.1333 10.6663 10.6666C10.6663 9.19998 11.1886 7.94442 12.233 6.89998C13.2775 5.85554 14.533 5.33331 15.9997 5.33331C17.4663 5.33331 18.7219 5.85554 19.7663 6.89998C20.8108 7.94442 21.333 9.19998 21.333 10.6666C21.333 12.1333 20.8108 13.3889 19.7663 14.4333C18.7219 15.4778 17.4663 16 15.9997 16ZM5.33301 24V22.9333C5.33301 22.1778 5.52767 21.4835 5.91701 20.8506C6.30634 20.2178 6.82279 19.7342 7.46634 19.4C8.84412 18.7111 10.2441 18.1946 11.6663 17.8506C13.0886 17.5066 14.533 17.3342 15.9997 17.3333C17.4663 17.3324 18.9108 17.5049 20.333 17.8506C21.7552 18.1964 23.1552 18.7129 24.533 19.4C25.1775 19.7333 25.6943 20.2169 26.0837 20.8506C26.473 21.4844 26.6672 22.1786 26.6663 22.9333V24C26.6663 24.7333 26.4055 25.3613 25.8837 25.884C25.3619 26.4066 24.7339 26.6675 23.9997 26.6666H7.99967C7.26634 26.6666 6.63879 26.4058 6.11701 25.884C5.59523 25.3622 5.3339 24.7342 5.33301 24Z" fill="white"/>
                  </svg>
                </div>
                <div class="text-white font-inter text-[22px] font-medium leading-[120%]">5</div>
              </div>
              <div class="flex items-center gap-6">
                <div class="text-white font-noto text-[22px] font-normal leading-[120%]">已開桌</div>
                <div class="w-[72px] text-white text-center font-inter text-[22px] font-medium leading-[120%]">01:13</div>
              </div>
            </div>
          </div>
    
          <!-- Summary -->
          <div class="flex flex-col items-start self-stretch overflow-hidden">
            <!-- Total -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-white">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">總計</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-ash-800 text-right font-inter text-[40px] font-semibold leading-[120%]">17,500</div>
              </div>
            </div>
    
            <!-- Paid -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-white">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">已付</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-ash-800 text-right font-inter text-[40px] font-semibold leading-[120%]">10,500</div>
              </div>
            </div>
    
            <!-- Unpaid -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-[#FFF5E2]">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">未結</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-indianred-600 text-right font-inter text-[40px] font-semibold leading-[120%]">7,000</div>
              </div>
            </div>
    
            <!-- Change -->
            <div class="flex min-h-[90px] px-6 items-center self-stretch border-b border-ash-200 bg-white">
              <div class="flex items-start flex-1">
                <div class="max-w-[192px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">找零</div>
              </div>
              <div class="flex pl-6 justify-end items-start gap-1">
                <div class="text-ash-800 text-right font-inter text-[40px] font-semibold leading-[120%]">0</div>
              </div>
            </div>
          </div>
    
          <!-- Payment List -->
          <div class="flex p-4 flex-col items-start gap-2 flex-1 self-stretch bg-ash-200 overflow-auto">
            <div
              v-for="(payment, index) in payments"
              :key="index"
              class="flex h-[90px] min-h-[72px] items-center gap-6 self-stretch rounded-2xl bg-white"
            >
              <div
                class="flex w-[60px] justify-center items-center self-stretch"
                :class="payment.type === 'cash' ? 'bg-yellow-400' : 'bg-green-500'"
              >
                <div class="flex w-8 h-8 justify-center items-center flex-shrink-0">
                  <svg v-if="payment.type === 'cash'" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9997 4.00004C9.37226 4.00004 3.99967 9.37262 3.99967 16C3.99967 22.6275 9.37226 28 15.9997 28C22.6271 28 27.9997 22.6275 27.9997 16C27.9997 9.37262 22.6271 4.00004 15.9997 4.00004ZM1.33301 16C1.33301 7.89986 7.8995 1.33337 15.9997 1.33337C24.0998 1.33337 30.6663 7.89986 30.6663 16C30.6663 24.1002 24.0998 30.6667 15.9997 30.6667C7.8995 30.6667 1.33301 24.1002 1.33301 16Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9997 6.66675C16.7361 6.66675 17.333 7.2637 17.333 8.00008V9.33341H21.333C22.0694 9.33341 22.6663 9.93037 22.6663 10.6667C22.6663 11.4031 22.0694 12.0001 21.333 12.0001H17.333V14.6667H18.6663C19.7272 14.6667 20.7446 15.0882 21.4948 15.8383C22.2449 16.5885 22.6663 17.6059 22.6663 18.6667C22.6663 19.7276 22.2449 20.745 21.4948 21.4952C20.7446 22.2453 19.7272 22.6667 18.6663 22.6667H17.333V24.0001C17.333 24.7365 16.7361 25.3334 15.9997 25.3334C15.2633 25.3334 14.6663 24.7365 14.6663 24.0001V22.6667H10.6663C9.92996 22.6667 9.33301 22.0698 9.33301 21.3334C9.33301 20.597 9.92996 20.0001 10.6663 20.0001H14.6663V17.3334H13.333C12.2721 17.3334 11.2547 16.912 10.5046 16.1618C9.75444 15.4117 9.33301 14.3943 9.33301 13.3334C9.33301 12.2725 9.75444 11.2551 10.5046 10.505C11.2547 9.75484 12.2721 9.33341 13.333 9.33341H14.6663V8.00008C14.6663 7.2637 15.2633 6.66675 15.9997 6.66675ZM14.6663 12.0001H13.333C12.9794 12.0001 12.6402 12.1406 12.3902 12.3906C12.1401 12.6407 11.9997 12.9798 11.9997 13.3334C11.9997 13.687 12.1401 14.0262 12.3902 14.2762C12.6402 14.5263 12.9794 14.6667 13.333 14.6667H14.6663V12.0001ZM17.333 17.3334V20.0001H18.6663C19.02 20.0001 19.3591 19.8596 19.6091 19.6096C19.8592 19.3595 19.9997 19.0204 19.9997 18.6667C19.9997 18.3131 19.8592 17.974 19.6091 17.7239C19.3591 17.4739 19.02 17.3334 18.6663 17.3334H17.333Z" fill="white"/>
                  </svg>
                  <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.33301 8.00004C4.59663 8.00004 3.99967 8.59699 3.99967 9.33337V22.6667C3.99967 23.4031 4.59663 24 5.33301 24H26.6663C27.4027 24 27.9997 23.4031 27.9997 22.6667V9.33337C27.9997 8.59699 27.4027 8.00004 26.6663 8.00004H5.33301ZM1.33301 9.33337C1.33301 7.12423 3.12387 5.33337 5.33301 5.33337H26.6663C28.8755 5.33337 30.6663 7.12423 30.6663 9.33337V22.6667C30.6663 24.8758 28.8755 26.6667 26.6663 26.6667H5.33301C3.12387 26.6667 1.33301 24.8758 1.33301 22.6667V9.33337Z" fill="white"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.33301 13.3333C1.33301 12.597 1.92996 12 2.66634 12H29.333C30.0694 12 30.6663 12.597 30.6663 13.3333C30.6663 14.0697 30.0694 14.6667 29.333 14.6667H2.66634C1.92996 14.6667 1.33301 14.0697 1.33301 13.3333Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div class="flex items-start flex-1">
                <div class="max-w-[128px] text-gray-700 font-noto text-[22px] font-normal leading-[120%]">
                  {{ payment.type === 'cash' ? '現金' : '信用卡' }}
                </div>
              </div>
              <div class="flex justify-end items-start gap-1">
                <div class="text-gray-700 text-right font-inter text-[28px] font-medium leading-[120%]">
                  {{ payment.amount.toLocaleString() }}
                </div>
              </div>
              <div class="flex items-center self-stretch">
                <button
                  @click="removePayment(index)"
                  class="flex w-[90px] flex-col justify-center items-center self-stretch aspect-square bg-indianred-100 hover:bg-indianred-600 transition-colors group"
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.82116 8.82153C9.47204 8.17066 10.5273 8.17066 11.1782 8.82153L19.9997 17.643L28.8212 8.82153C29.472 8.17066 30.5273 8.17066 31.1782 8.82153C31.8291 9.4724 31.8291 10.5277 31.1782 11.1786L22.3567 20L31.1782 28.8215C31.8291 29.4724 31.8291 30.5277 31.1782 31.1786C30.5273 31.8294 29.472 31.8294 28.8212 31.1786L19.9997 22.3571L11.1782 31.1786C10.5273 31.8294 9.47204 31.8294 8.82116 31.1786C8.17029 30.5277 8.17029 29.4724 8.82116 28.8215L17.6427 20L8.82116 11.1786C8.17029 10.5277 8.17029 9.4724 8.82116 8.82153Z" class="fill-[#92A7C0] group-hover:fill-white" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
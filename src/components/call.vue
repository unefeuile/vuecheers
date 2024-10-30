<template>
    <v-container class="d-flex align-center justify-center fill-height">
      <div class="text-container">
        <h1 class="main-title">コール発生</h1>
        <p class="highlighted-text">〇〇〇</p>
        <p class="highlighted-text">飲んでなくないーー？</p>
        <v-btn class="cta-button" @click="navigateBack">
          戻る 
        </v-btn>
      </div>
    </v-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // 戻るボタンの処理
  const navigateBack = () => {
    router.push({ name: 'face' }); // face.vue への遷移
  };
  </script>
  
  <style scoped>
  .text-container {
    text-align: center;
    background-color: #f8f8f8;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .main-title {
    font-size: 3rem;
    font-weight: bold;
    color: #ff5722; /* 鮮やかなオレンジ色 */
    margin-bottom: 20px;
  }
  
  .highlighted-text {
    font-size: 1.5rem;
    color: #2196f3; /* 鮮やかな青色 */
    font-weight: bold;
    background-color: #ffeb3b; /* 明るい黄色の背景 */
    padding: 10px;
    border-radius: 5px;
  }
  
  .cta-button {
    margin-top: 20px;
    font-size: 1.25rem;
    padding: 10px 20px;
    background-color: #4caf50; /* 緑色のボタン */
    color: white;
    border-radius: 5px;
  }
  
  .cta-button:hover {
    background-color: #388e3c; /* ホバー時の緑色 */
  }
  </style>
  
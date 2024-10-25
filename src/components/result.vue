<template>
    <v-container class="d-flex align-center justify-center fill-height">
      <div class="text-center">
        <h1 class="title">{{ partyName }} 結果発表</h1>
        <v-divider class="my-4" />
  
        <h2 class="subtitle">参加者一覧</h2>
        <v-list>
          <v-list-item v-for="(participant, index) in participants" :key="index" class="participant-item">
            <v-list-item-avatar>
              <v-img :src="participant.avatar || 'https://via.placeholder.com/50'" alt="アイコン" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ participant.name }} ({{ participant.gender }})</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
  
        <v-divider class="my-4" />
  
        <h2 class="subtitle">経過時間</h2>
        <div class="elapsed-time">{{ formattedTime }}</div>
  
        <div class="button-container">
          <v-btn @click="goBack" class="back-button">
            終了
          </v-btn>
        </div>
      </div>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  
  const participants = ref(JSON.parse(route.params.participants || '[]'));
  const elapsedTime = ref(Number(route.params.elapsedTime) || 0);
  const partyName = ref(route.params.partyName || '');
  
  const formattedTime = computed(() => {
    const minutes = Math.floor(elapsedTime.value / 60);
    const seconds = elapsedTime.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });
  
  const goBack = () => {
    router.push({ name: 'face' }); // 飲み会画面に戻る
  };
  </script>
  
  <style scoped>
  .title {
    font-size: 2rem;
    margin-bottom: 16px;
  }
  
  .subtitle {
    font-size: 1.5rem;
    margin: 20px 0;
  }
  
  .elapsed-time {
    font-size: 1.5rem;
    margin: 20px 0;
  }
  
  .button-container {
    display: flex;
    justify-content: center; /* 水平方向に中央揃え */
    align-items: center;    /* 垂直方向に中央揃え */
    height: 100px;         /* ボタンを中央にするための高さ */
  }
  
  .back-button {
    font-size: 1.5rem;
    padding: 10px 20px;
    border-radius: 10px;
    background-color: #1976d2;
    color: #fff;
    /* ボタンのサイズを調整 */
    width: 150px;          /* 幅を固定 */
    height: 50px;         /* 高さを固定 */
  }
  </style>
  
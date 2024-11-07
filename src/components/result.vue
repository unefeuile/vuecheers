<template>
  <v-container class="d-flex align-center justify-center fill-height container">
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
            <v-list-item-title class="participant-name">{{ participant.name }} ({{ participant.gender }})</v-list-item-title>
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

// 終了ボタンを押したときのメソッド
const goBack = () => {
  router.push({ name: 'title' }); // title.vueに戻る
};
</script>

<style scoped>
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f);
  height: 100vh;
}

.title, .subtitle, .elapsed-time {
  color: #5d3d2c; /* 茶色に変更 */
}

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.back-button {
  font-size: 1.5rem;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #ff0000;
  color: #fff;
  width: 150px;
  height: 50px;
  transition: background-color 0.3s, transform 0.3s;
}

.back-button:hover {
  background-color: #cc0000; /* ホバー時の色 */
  transform: scale(1.05);
}
</style>


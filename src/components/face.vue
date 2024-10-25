<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div class="text-center">
      <h1 class="title">{{ partyName }} 飲み会</h1>
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

      <div class="elapsed-time">
        経過時間: {{ formattedTime }}
      </div>

      <v-divider class="my-4" />
      <v-btn
  variant="outlined"
  style="padding: 20px 40px; font-size: 24px; font-weight: bold; width: 200px; height: 60px; display: flex; align-items: center; justify-content: center; border: 2px solid red; margin-bottom: 16px;" 
  @click="navigateToUser1"
>
  ユーザー１
</v-btn>

<v-btn
  variant="outlined"
  style="padding: 20px 40px; font-size: 24px; font-weight: bold; width: 200px; height: 60px; display: flex; align-items: center; justify-content: center; border: 2px solid red; margin-bottom: 16px;" 
  @click="navigateToUser2"
>
  ユーザー２
</v-btn>

<v-btn
  variant="outlined"
  style="padding: 20px 40px; font-size: 24px; font-weight: bold; width: 200px; height: 60px; display: flex; align-items: center; justify-content: center; border: 2px solid red;" 
  @click="navigateToUser3"
>
  ユーザー３

</v-btn>
      <div class="button-container">
        <v-btn @click="endParty" class="end-button">
          飲み会終了
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const participants = ref(JSON.parse(route.params.participants || '[]'));
const elapsedTime = ref(Number(route.params.elapsedTime) || 0);
const partyName = ref(route.params.partyName || '');
let timer;

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60);
  const seconds = elapsedTime.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
};

const endParty = () => {
  console.log('飲み会が終了しました！');
  clearInterval(timer);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.title {
  font-size: 2rem;
  margin-bottom: 16px;
}

.elapsed-time {
  font-size: 1.5rem;
  margin: 20px 0;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.end-button {
  font-size: 1.5rem;
  padding: 15px 30px;
  border-radius: 10px;
  background-color: #ff0000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.3s;
}

.end-button:hover {
  background-color: #cc0000;
  transform: scale(1.05);
}

.participant-item {
  display: flex;
  align-items: center; /* アイコンとテキストを中央に揃える */
  justify-content: center; /* アイコンとテキストを中央に配置 */
}
</style>

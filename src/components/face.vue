<template>
  <v-container class="d-flex align-center justify-center fill-height container">
    <div class="text-center">
      <h1 class="title">{{ partyName }} 飲み会</h1>
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

      <div class="elapsed-time">
        経過時間: {{ formattedTime }}
      </div>

      <v-divider class="my-4" />

      <v-btn
        variant="outlined"
        @click="navigateToRegistration('user1')"
        class="user-button user-name"
      >
        ユーザー１
      </v-btn>

      <v-btn
        variant="outlined"
        @click="navigateToRegistration('user2')"
        class="user-button user-name"
      >
        ユーザー２
      </v-btn>

      <v-btn
        variant="outlined"
        @click="navigateToRegistration('user3')"
        class="user-button user-name"
      >
        ユーザー３
      </v-btn>

      <v-container class="d-flex align-center justify-center fill-height">
        <v-btn
          variant="outlined"
          @click="navigateToCall"
          class="call-button"
          style="margin: 0 auto; display: flex; align-items: center; justify-content: center; width: 50px; height: 50px;"
        >
          ★
        </v-btn>
      </v-container>

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
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

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

  router.push({
    name: 'result',
    params: {
      participants: JSON.stringify(participants.value),
      elapsedTime: elapsedTime.value,
      partyName: partyName.value,
    }
  });
};

const navigateToRegistration = (userId) => {
  router.push({ name: 'registration', params: { userId } });
};

const navigateToCall = () => {
  router.push({ name: 'call' });
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* ビールの色をイメージしたグラデーション */
  height: 100vh; /* 全画面の高さを指定 */
}

.title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #5d3d2c; /* 茶色に変更 */
}

.elapsed-time {
  font-size: 1.5rem;
  margin: 20px 0;
  color: #5d3d2c; /* 茶色に変更 */
}

.participant-name {
  color: #5d3d2c; /* 茶色に変更 */
}

.user-name {
  color: #5d3d2c; /* ボタンの文字を茶色に変更 */
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
  align-items: center;
  justify-content: center;
}

.call-button {
  font-size: 1.5rem;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #4caf50; /* 緑色のボタン */
  color: white;
}
</style>

<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div class="text-center">
      <h1 class="title">飲み会名を入力</h1>
      <v-text-field v-model="partyName" label="飲み会名" />
      <v-btn @click="startParty" :disabled="!partyName">決定</v-btn>

      <v-divider class="my-4" />

      <h2 class="title">参加者登録</h2>
      <v-text-field v-model="participantName" label="名前" />
      <v-select v-model="selectedGender" :items="genders" label="性別" />
      <v-btn @click="addParticipant" :disabled="!participantName || !selectedGender">参加者追加</v-btn>

      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(participant, index) in participants" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ participant.name }} ({{ participant.gender }})</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider class="my-4" />

      <div class="button-container">
        <v-btn @click="startMeeting" :disabled="participants.length === 0" class="fun-button">
          START
        </v-btn>
      </div>
      
      <div v-if="elapsedTime" class="elapsed-time">
        経過時間: {{ formatTime(elapsedTime) }}
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const partyName = ref('');
const participantName = ref('');
const selectedGender = ref('');
const participants = ref([]);
const genders = ['男性', '女性'];
const elapsedTime = ref(0);
let timer;

const addParticipant = () => {
  if (participantName.value && selectedGender.value) {
    // 参加者情報をオブジェクトとして追加
    participants.value.push({ name: participantName.value, gender: selectedGender.value, avatar: '' });
    participantName.value = '';
    selectedGender.value = '';
  }
};

const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
};

const startMeeting = () => {
  console.log('飲み会がスタートしました！');
  startTimer();
  router.push({ 
    name: 'face', 
    params: { 
      participants: JSON.stringify(participants.value), 
      elapsedTime: elapsedTime.value,
      partyName: partyName.value 
    } 
  });
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.title {
  font-size: 2rem;
  margin-bottom: 16px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.fun-button {
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

.fun-button:hover {
  background-color: #cc0000;
  transform: scale(1.05);
}

.elapsed-time {
  font-size: 1.5rem;
  margin-top: 20px;
}
</style>

<template>
  <v-container class="d-flex align-center justify-center fill-height container">
    <div class="text-center">
      <h1 class="title">飲み会名を入力</h1>
      <v-text-field v-model="partyName" label="飲み会名" class="text-field" />
      <v-btn @click="startParty" :disabled="!partyName">決定</v-btn>

      <v-divider class="my-4" />

      <h2 class="title">参加者登録</h2>
      <v-text-field v-model="participantName" label="名前" class="text-field" />
      <v-select v-model="selectedGender" :items="genders" label="性別" class="text-field" />
      <v-btn @click="addParticipant" :disabled="!participantName || !selectedGender">参加者追加</v-btn>

      <v-list class="transparent-list">
        <v-list-item-group>
          <v-list-item v-for="(participant, index) in participants" :key="index" class="transparent-background">
            <v-list-item-content>
              <v-list-item-title class="participant-name">{{ participant.name }} ({{ participant.gender }})</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider class="my-4" />

      <div class="button-container">
        <v-btn @click="startMeeting" :disabled="participants.length === 0" class="fun-button">
          スタート
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
import { db } from '@/firebase';
import { setDoc, doc } from 'firebase/firestore';

const router = useRouter();

const partyName = ref('');
const participantName = ref('');
const selectedGender = ref('');
const participants = ref([]);
const genders = ['男性', '女性'];
const elapsedTime = ref(0);
let timer;

const startParty = async () => {
  if (partyName.value) {
    try {
      await setDoc(doc(db, 'drinking_place', 'place'), {
        location: partyName.value,
        created_at: new Date(),
      });
      console.log(`飲み会名 '${partyName.value}' が 'drinking_place' コレクションに保存されました。`);
    } catch (error) {
      console.error('飲み会名の保存に失敗しました:', error);
    }
  }
};

const addParticipant = async () => {
  if (participantName.value && selectedGender.value) {
    participants.value.push({ name: participantName.value, gender: selectedGender.value });

    // 性別を数値に変換
    let genderValue = 0; // デフォルトは男性
    if (selectedGender.value === '女性') {
      genderValue = 1; // 女性の場合は1に設定
    }

    try {
      // drinking_records コレクションに参加者の情報を保存
      await setDoc(doc(db, 'drinking_records', participantName.value), {
        gender: genderValue, // 数値に変換した性別を保存
        blood_alcohol_level: 0,
        alcohol_name_list: [],
      });
      console.log(`参加者 '${participantName.value}' の情報が保存されました。`);
    } catch (error) {
      console.error('参加者の保存に失敗しました:', error);
    }

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
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* ビールの色をイメージしたグラデーション */
  height: 100vh; /* 全画面の高さを指定 */
}

.title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #5d3d2c; /* 茶色に変更 */
}


.text-field {
  color: #5d3d2c; /* テキストフィールドの文字色を茶色に変更 */
}

.transparent-list {
  background-color: transparent; /* リストの背景を透明に設定 */
}

.transparent-background {
  background-color: transparent; /* 参加者の背景を透明に設定 */
}

.participant-name {
  color: black; /* 参加者名の文字色を黒に設定 */
  list-style-type: disc; /* 箇条書きのスタイルを指定 */
  padding-left: 20px; /* 左に少し余白を追加 */
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
  color: #5d3d2c; /* 茶色に変更 */
}
</style>
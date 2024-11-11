<template>
  <v-container class="d-flex align-center justify-center fill-height container">

    <v-progress-circular
        v-if="users.length === 0"
        indeterminate
        color="primary"
      ></v-progress-circular>

    <div class="text-center">
      <!-- 飲み会のタイトル -->
      <h1 class="title">{{ partyName }} 飲み会</h1>

      <!-- セクションを区切るための区切り線 -->
      <v-divider class="my-4" />

      <!-- 経過時間の表示 -->
      <div class="elapsed-time">
        経過時間: {{ formattedTime }}
      </div>

      <!-- セクションを区切るための区切り線 -->
      <v-divider class="my-4" />

      <!-- Firebaseから取得したユーザーの写真付きボタン -->
      <div class="user-buttons">
        <v-card
          v-for="(user, index) in users"
          :key="user.id"  
          class="user-card"
          @click="navigateToRegistration(user.name)"
        >
          <!-- <img :src="c" class="user-image" alt="user.name" /> -->
          
          <v-img v-bind:src="user.alcohol_level_image" class="user-image" alt="User 1" />
          <!-- <v-img src="@/assets/images/stage1.png" class="user-image" alt="User 1" /> -->

          <v-card-title class="user-name">{{ user.name }}</v-card-title>
        </v-card>
      </div>

      <!-- コールボタン -->
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

      <!-- 飲み会終了ボタン -->
      <div class="button-container">
        <v-btn @click="endParty" class="end-button">
          飲み会終了
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

import alcStage1Img from "@/assets/images/stage1.png";
import alcStage2Img from "@/assets/images/stage2.png";
import alcStage3Img from "@/assets/images/stage3.png";
import alcStage4Img from "@/assets/images/stage4.png";
import alcStage5Img from "@/assets/images/stage5.png";
import alcStage6Img from "@/assets/images/stage6.png";

const users = ref([]);
const defaultImage = alcStage1Img; // 画像がない場合のデフォルト画像
const route = useRoute();
const router = useRouter();
const participants = ref(JSON.parse(route.params.participants || '[]'));
const elapsedTime = ref(Number(route.params.elapsedTime) || 0);　//route.params.elapsedTimeここをDBから取得する
const partyName = ref(route.params.partyName || '');
const userName = ref(route.params.userName || '');
let timer;

// Firebaseからユーザー情報を取得
const fetchPartyName = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "drinking_place"));
    if (!querySnapshot.empty) {
      // 最初のドキュメントからlocationを取得
      const doc = querySnapshot.docs[0];
      partyName.value = doc.data().location;  // locationフィールドを取得
    } else {
      console.error("drinking_place コレクションにデータがありません");
    }
  } catch (error) {
    console.error("パーティ名の取得に失敗しました: ", error);
  }
};

const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "drinking_records"));
    users.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().user_name || doc.id,
      alcohol_level_image: fetchAlcoholLevelImage(doc.data().blood_alcohol_level) || defaultImage // 画像URLがある場合に設定
      // alcohol_level_image:alcStage1Img || defaultImage // 画像URLがある場合に設定
    }));

    console.log(users)
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました: ", error);
  }
};

function fetchAlcoholLevelImage(blood_alcohol_level){
  let img;
  if (blood_alcohol_level < 6) {
    img = alcStage1Img;
  } else if (blood_alcohol_level < 11) {
    img = alcStage2Img;
  } else if (blood_alcohol_level < 16) {
    img = alcStage3Img;
  } else if (blood_alcohol_level < 31) {
    img = alcStage4Img;
  } else if (blood_alcohol_level < 41) {
    img = alcStage5Img;
  } else {
    img = alcStage6Img;
  }
  return img;
}

// タイマーが1200秒で割り切れる場合に処理を実行
const formattedTime = computed(() => {
  const minutes = String(Math.floor(elapsedTime.value / 60)).padStart(2, '0');
  const seconds = String(elapsedTime.value % 60).padStart(2, '0');

  // 1200秒で割り切れる場合の処理
  if (elapsedTime.value % 5 === 0 && elapsedTime.value !== 0) {
    // WebAPI を呼び出す
    callWebAPI(elapsedTime.value);
    // Firestore に時間を保存
    saveElapsedTimeToFirestore(elapsedTime.value);
    // call.vue に遷移
    router.push('/call');
  }

  return `${minutes}:${seconds}`;
});

// WebAPIを呼び出す関数
const callWebAPI = async (time) => {
  try {
    const response = await axios.post('https://your-api-endpoint.com', { time });
    console.log('API response:', response.data);
  } catch (error) {
    console.error('Error calling API:', error);
  }
};

// Firestore に spend_time を保存する関数
const saveElapsedTimeToFirestore = async (time) => {
  const docRef = firestore().collection('drinking_place').doc('place');
  try {
    await docRef.update({ spend_time: route.params.elapsedTime });
    console.log('Firestore updated with new time');
  } catch (error) {
    console.error('Error updating Firestore:', error);
  }
};


const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++;
  }, 1000);
};

const endParty = () => {
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

const navigateToRegistration = (userName) => {
  if (!userName) {
    console.error("ユーザー名が設定されていません");
    return;
  }

  console.log("userName:", userName);  // userNameを確認

  router.push({
    name: 'registration',  // お酒登録ページのルート名
    params: {
      userId: userName,    // ユーザー名を渡す
    }
  });
};

const navigateToCall = () => {
  router.push({ name: 'call' });
};

onMounted(() => {
  fetchPartyName();
  fetchUsers();
  startTimer();
});

</script>

<style scoped>
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f);
  height: 100vh;
}

.title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #5d3d2c;
}

.elapsed-time {
  font-size: 1.5rem;
  margin: 20px 0;
  color: #5d3d2c;
}

.user-name {
  color: #5d3d2c;
  text-align: center;
}

.user-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
}

.user-card {
  width: 150px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.user-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
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
</style>
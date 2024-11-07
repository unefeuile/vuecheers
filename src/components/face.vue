<template>
  <!-- メインコンテナ -->
  <v-container class="d-flex align-center justify-center fill-height container">
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

      <!-- ユーザー1〜6の写真付きボタン -->
      <v-row class="user-buttons" justify="center">
        <v-col v-for="(user, index) in participants" :key="index" cols="6" md="3" class="d-flex justify-center">
          <v-card class="user-card" @click="navigateToRegistration('user' + (index + 1))">
            <v-img :src="getImagePath(index)" class="user-image" alt="User 1" />
            <v-card-title class="user-name">{{ user.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>

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
// Vue Composition APIから必要な機能をインポート
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// ルーターと現在のルートを取得
const router = useRouter();
const route = useRoute();

// 参加者情報、経過時間、飲み会名を設定
const participants = ref([
  { name: 'ユーザー１', alcoholLevel: 4 },
  { name: 'ユーザー２', alcoholLevel: 8 },
  { name: 'ユーザー３', alcoholLevel: 12 },
  { name: 'ユーザー４', alcoholLevel: 20 },
  { name: 'ユーザー５', alcoholLevel: 40 },
  { name: 'ユーザー６', alcoholLevel: 4 },
]);

const partyName = ref(route.params.partyName || '飲み会');
const elapsedTime = ref(Number(route.params.elapsedTime) || 0);

// タイマー用の変数
let timer;

// 経過時間のフォーマット（分:秒）
const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60);
  const seconds = elapsedTime.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// タイマーをスタートする関数
const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++;

    // 10秒経過したらコールページに遷移
    if (elapsedTime.value >= 10) {
      clearInterval(timer); // タイマー停止
      navigateToCall(); // コールページへ遷移
    }
  }, 1000);
};

// 飲み会終了処理
const endParty = () => {
  console.log('飲み会が終了しました！');
  clearInterval(timer); // タイマーを停止

  // 終了後、結果ページに遷移
  router.push({
    name: 'result',
    params: {
      participants: JSON.stringify(participants.value),
      elapsedTime: elapsedTime.value,
      partyName: partyName.value,
    }
  });
};

// ユーザー登録ページに遷移する関数
const navigateToRegistration = (userId) => {
  router.push({ name: 'registration', params: { userId } });
};

// コールページに遷移する関数
const navigateToCall = () => {
  router.push({ name: 'call' }); // call.vueへの遷移
};

// 血中アルコール濃度に基づいて画像を選ぶ関数
const getImagePath = (index) => {
  const alcoholLevel = participants.value[index].alcoholLevel;
  let imagePath = '';

  if (alcoholLevel >= 41) {
    imagePath = '/stage6.png';
  } else if (alcoholLevel >= 31) {
    imagePath = '/stage5.png';
  } else if (alcoholLevel >= 16) {
    imagePath = '/stage4.png';
  } else if (alcoholLevel >= 11) {
    imagePath = '/stage3.png';
  } else if (alcoholLevel >= 6) {
    imagePath = '/stage2.png';
  } else {
    imagePath = "/stage1.png";
  }

  return imagePath;
};

// コンポーネントがマウントされたときにタイマーを開始
onMounted(() => {
  startTimer();
});

// コンポーネントがアンマウントされる前にタイマーを停止
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
/* コンテナ全体のスタイル */
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* ビールの色 */
  height: 100vh; /* 画面の高さに合わせる */
}

/* 飲み会のタイトル */
.title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #5d3d2c; /* 茶色 */
}

/* 経過時間の表示 */
.elapsed-time {
  font-size: 1.5rem;
  margin: 20px 0;
  color: #5d3d2c;
}

/* ユーザーカード */
.user-card {
  width: 130px;
  margin: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

/* ユーザー画像 */
.user-image {
  height: 120px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
}

/* ユーザー名 */
.user-name {
  font-size: 1rem;
  padding: 8px;
  color: #5d3d2c;
  font-weight: bold;
}

/* コールボタン */
.call-button {
  font-size: 30px;
  color: #ff5722;
  background-color: #ff9800;
}

/* 飲み会終了ボタン */
.end-button {
  background-color: #5d3d2c;
  color: white;
  font-size: 1.2rem;
  padding: 10px 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  margin: 20px auto;
  border-radius: 25px;
}
</style>

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
<div class="user-buttons">
        <!-- ユーザー１ -->
        <v-card class="user-card" @click="navigateToRegistration('user1')">
          <v-img src="C:\Users\bi222064\Documents\３年前期\研究室\vuecheers\stage1.png" class="user-image" alt="User 1" />
          <v-card-title class="user-name">ユーザー１</v-card-title>
        </v-card>

        <!-- ユーザー２ -->
        <v-card class="user-card" @click="navigateToRegistration('user2')">
          <v-img src="C:\Users\bi222064\Documents\３年前期\研究室\vuecheers\stage2.png" class="user-image" alt="User 2" />
          <v-card-title class="user-name">ユーザー２</v-card-title>
        </v-card>

        <!-- ユーザー３ -->
        <v-card class="user-card" @click="navigateToRegistration('user3')">
          <v-img src="C:\Users\bi222064\Documents\３年前期\研究室\vuecheers\stage3.png" class="user-image" alt="User 3" />
          <v-card-title class="user-name">ユーザー３</v-card-title>
        </v-card>

        <!-- ユーザー４ -->
        <v-card class="user-card" @click="navigateToRegistration('user4')">
          <v-img src="C:\Users\bi222064\Documents\３年前期\研究室\vuecheers\stage4.png" class="user-image" alt="User 4" />
          <v-card-title class="user-name">ユーザー４</v-card-title>
        </v-card>

        <!-- ユーザー５ -->
        <v-card class="user-card" @click="navigateToRegistration('user5')">
          <v-img src="C:\Users\bi222064\Documents\３年前期\研究室\vuecheers\stage5.png" class="user-image" alt="User 5" />
          <v-card-title class="user-name">ユーザー５</v-card-title>
        </v-card>

        <!-- ユーザー６ -->
        <v-card class="user-card" @click="navigateToRegistration('user6')">
          <v-img src="C:\Users\bi222064\Documents\３年前期\研究室\vuecheers\stage6.png"class="user-image" alt="User 6" />
          <v-card-title class="user-name">ユーザー６</v-card-title>
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
// Vue Composition APIから必要な機能をインポート
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 現在のルート情報とルーターを取得
const route = useRoute();
const router = useRouter();

// 参加者情報、経過時間、飲み会名を設定
const participants = ref(JSON.parse(route.params.participants || '[]'));
const elapsedTime = ref(Number(route.params.elapsedTime) || 0);
const partyName = ref(route.params.partyName || '');

// タイマー用の変数
let timer;

// 経過時間のフォーマット（分:秒）
const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60); // 分
  const seconds = elapsedTime.value % 60; // 秒
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // フォーマットされた時間
});

// タイマーをスタートする関数
const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++; // 1秒ごとに経過時間を1増加
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
  router.push({ name: 'call' });
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
/* コンテナ全体のスタイル：背景をビール色をイメージしたグラデーションに設定 */
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* ビールの色をイメージしたグラデーション */
  height: 100vh; /* 全画面の高さを指定 */
}

/* 飲み会のタイトルのスタイル */
.title {
  font-size: 2rem; /* フォントサイズ */
  margin-bottom: 16px; /* 下に余白を追加 */
  color: #5d3d2c; /* 茶色に変更 */
}

/* 経過時間の表示スタイル */
.elapsed-time {
  font-size: 1.5rem; /* フォントサイズ */
  margin: 20px 0; /* 上下に余白を追加 */
  color: #5d3d2c; /* 茶色に変更 */
}

/* 参加者名のスタイル */
.participant-name {
  color: #5d3d2c; /* 茶色に変更 */
}

/* ユーザー名のスタイル */
.user-name {
  color: #5d3d2c; /* ボタンの文字を茶色に変更 */
  text-align: center; /* 名前を中央揃え */
}

/* ユーザーの写真のスタイル */
.user-image {
  width: 100px; /* 画像の幅 */
  height: 100px; /* 画像の高さを指定 */
  border-radius: 50%; /* 丸い画像 */
  margin-bottom: 10px; /* 画像と名前の間に余白を追加 */
  object-fit: cover; /* 画像が中央に収まるように調整 */
}

/* ユーザーカードのスタイル */
.user-card {
  width: 150px;
  margin: 10px;
  display: flex;
  flex-direction: column; /* 縦方向に並べる */
  justify-content: center;
  align-items: center; /* 中央に配置 */
  cursor: pointer;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

/* ユーザーカードのホバー時のスタイル */
.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

/* ユーザーたちのボタンコンテナのスタイル */
.user-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap; /* 複数行に対応 */
  margin-top: 20px;
}

/* ボタンコンテナのスタイル */
.button-container {
  display: flex;
  justify-content: center; /* ボタンを中央に配置 */
  margin-top: 20px; /* 上に余白を追加 */
}

/* 飲み会終了ボタンのスタイル */
.end-button {
  font-size: 1.5rem;
  padding: 15px 30px; /* パディングの設定 */
  border-radius: 10px; /* 丸い角 */
  background-color: #ff0000; /* 赤色背景 */
  color: #fff; /* 文字色を白に */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.3s; /* ホバー時のアニメーション効果 */
}

/* 飲み会終了ボタンがホバーされたときのスタイル */
.end-button:hover {
  background-color: #cc0000; /* 色を少し暗く */
  transform: scale(1.05); /* ボタンを少し拡大 */
}
</style>

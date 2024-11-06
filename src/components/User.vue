<template>
  <!-- コンテナを中央に配置 -->
  <v-container class="d-flex align-center justify-center fill-height container">
    <div class="text-center">
      <!-- 飲み会名を入力するためのタイトルとテキストフィールド -->
      <h1 class="title">飲み会名を入力</h1>
      <v-text-field v-model="partyName" label="飲み会名" class="text-field" />
      <!-- 飲み会名が入力されていないと決定ボタンを無効化 -->
      <v-btn @click="startParty" :disabled="!partyName">決定</v-btn>

      <v-divider class="my-4" />

      <!-- 参加者登録セクション -->
      <h2 class="title">参加者登録</h2>
      <!-- 参加者の名前を入力するテキストフィールド -->
      <v-text-field v-model="participantName" label="名前" class="text-field" />
      <!-- 性別を選択するセレクトボックス -->
      <v-select v-model="selectedGender" :items="genders" label="性別" class="text-field" />
      <!-- 名前と性別が入力されていないと参加者追加ボタンを無効化 -->
      <v-btn @click="addParticipant" :disabled="!participantName || !selectedGender">参加者追加</v-btn>

      <!-- 参加者一覧の表示 -->
      <v-list class="transparent-list">
        <v-list-item-group>
          <v-list-item v-for="(participant, index) in participants" :key="index" class="transparent-background">
            <v-list-item-content>
              <!-- 参加者の名前と性別を表示 -->
              <v-list-item-title class="participant-name">{{ participant.name }} ({{ participant.gender }})</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-divider class="my-4" />

      <div class="button-container">
        <!-- 参加者がいないとスタートボタンを無効化 -->
        <v-btn @click="startMeeting" :disabled="participants.length === 0" class="fun-button">
          スタート
        </v-btn>
      </div>
      
      <!-- 経過時間がある場合に表示 -->
      <div v-if="elapsedTime" class="elapsed-time">
        経過時間: {{ formatTime(elapsedTime) }}
      </div>
    </div>
  </v-container>
</template>

<script setup>
// Vueのref、onUnmountedをインポート
import { ref, onUnmounted } from 'vue';
// ルーターをインポート
import { useRouter } from 'vue-router';

const router = useRouter();

// 変数の定義
const partyName = ref('');  // 飲み会名
const participantName = ref('');  // 参加者名
const selectedGender = ref('');  // 性別
const participants = ref([]);  // 参加者リスト
const genders = ['男性', '女性'];  // 性別選択肢
const elapsedTime = ref(0);  // 経過時間
let timer;  // タイマーの保持

// 参加者を追加する関数
const addParticipant = () => {
  if (participantName.value && selectedGender.value) {
    participants.value.push({ name: participantName.value, gender: selectedGender.value, avatar: '' });
    participantName.value = '';  // 入力フィールドをクリア
    selectedGender.value = '';  // 入力フィールドをクリア
  }
};

// タイマーを開始する関数
const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++;  // 1秒ごとに経過時間を更新
  }, 1000);
};

// 飲み会をスタートする関数
const startMeeting = () => {
  console.log('飲み会がスタートしました！');
  startTimer();  // タイマーを開始
  // 飲み会画面へ遷移し、参加者と経過時間、飲み会名をパラメータとして渡す
  router.push({ 
    name: 'face', 
    params: { 
      participants: JSON.stringify(participants.value), 
      elapsedTime: elapsedTime.value,
      partyName: partyName.value 
    } 
  });
};

// 経過時間を分:秒形式にフォーマットする関数
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);  // 分を計算
  const seconds = time % 60;  // 秒を計算
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;  // 分:秒の形式にして返す
};

// コンポーネントがアンマウントされる際にタイマーをクリア
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
/* 背景のグラデーションを設定 */
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* ビールの色をイメージしたグラデーション */
  height: 100vh;  /* 画面全体の高さを指定 */
}

/* タイトルのスタイル */
.title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #5d3d2c; /* 茶色 */
}

/* テキストフィールドの文字色を茶色に変更 */
.text-field {
  color: #5d3d2c; /* テキストフィールドの文字色を茶色に変更 */
}

/* リストの背景を透明に設定 */
.transparent-list {
  background-color: transparent;
}

/* 参加者リストの背景を透明に設定 */
.transparent-background {
  background-color: transparent;
}

/* 参加者名の文字色を黒に設定 */
.participant-name {
  color: black;
  list-style-type: disc; /* 箇条書きのスタイルを指定 */
  padding-left: 20px; /* 左に少し余白を追加 */
}

/* ボタンコンテナを中央揃えに */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* スタートボタンのスタイル */
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

/* スタートボタンにホバーしたときのスタイル */
.fun-button:hover {
  background-color: #cc0000; /* ホバー時の赤色 */
  transform: scale(1.05);  /* ボタンを少し拡大 */
}

/* 経過時間の表示スタイル */
.elapsed-time {
  font-size: 1.5rem;
  margin-top: 20px;
  color: #5d3d2c; /* 茶色 */
}
</style>

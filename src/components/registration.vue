<template>
  <!-- コンテナ全体を中央に配置し、横幅を広く設定 -->
  <v-container class="d-flex align-center justify-center fill-height wide-container">
    <div class="text-center">
      <!-- ヘッダー部分 (左上にユーザー画像と名前) -->
      <div class="user-header">
        <v-img src="C:\Users\bi222064\Documents\３年前期\研究室\vuecheers\stage1.png" class="user-image" alt="User 1" />
        <v-card-title class="user-name">ユーザー１</v-card-title>
      </div>

      <!-- 飲んだお酒の一覧 -->
      <h2 class="subtitle">飲んだお酒一覧</h2>

      <!-- 飲んだお酒を四角い枠内に表示 -->
      <v-card class="drink-card">
        <v-card-text class="drink-list">
          <!-- 箇条書きのリストを表示 -->
          <ul>
            <li>・生ビール 1杯</li>
            <li>・ハイボール 1杯</li>
            <li>・レモンサワー 2杯</li>
          </ul>
        </v-card-text>
      </v-card>

      <!-- お酒の登録ボタン -->
      <v-btn @click="startCamera" class="register-button">お酒の登録</v-btn>

      <!-- カメラが有効な場合に表示されるカメラのコンテナ -->
      <div v-if="isCameraActive" class="camera-container">
        <!-- ビデオ要素でカメラの映像を表示 -->
        <video ref="video" autoplay class="video"></video>
        <!-- 写真を撮るボタン -->
        <v-btn @click="takePhoto" class="capture-button">写真を撮る</v-btn>
        <!-- 写真を表示するための非表示のcanvas要素 -->
        <canvas ref="canvas" style="display: none;"></canvas>
      </div>

      <!-- 撮影した写真がある場合に表示 -->
      <div v-if="photoUrl">
        <img :src="photoUrl" alt="撮影した写真" class="captured-image" />
      </div>

      <!-- 戻るボタン -->
      <v-btn @click="goBack" class="back-button">戻る</v-btn>
    </div>
  </v-container>
</template>

<script setup>
// Vueのrefとライフサイクルフックをインポート
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// ルーターを使用して、現在のページのパラメーターを取得
const route = useRoute();
const router = useRouter();
const userId = route.params.userId;  // ユーザーIDを取得

// お酒の情報とカメラの状態を管理するためのref
const drinkName = ref('');  // 飲んだお酒の名前
const drinkDetails = ref('');  // 飲んだお酒の詳細
const drinks = ref([
  { name: "生ビール", details: "1杯" },
  { name: "ハイボール", details: "1杯" },
  { name: "レモンサワー", details: "2杯" }
]);  // 飲んだお酒のリスト
const isCameraActive = ref(false);  // カメラが有効かどうか
const photoUrl = ref('');  // 撮影した写真のURL

// カメラを起動する関数
const startCamera = async () => {
  try {
    // メディアデバイスを使ってカメラ映像を取得
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },  // ユーザー側のカメラを使用
    });
    // ビデオ要素にストリームを設定
    const video = $refs.video;
    video.srcObject = stream;
    video.play();
    isCameraActive.value = true;  // カメラを起動した状態に設定
  } catch (error) {
    // カメラ起動に失敗した場合のエラーハンドリング
    console.error("カメラの起動に失敗しました: ", error);
    alert("カメラの起動に失敗しました。カメラが使用できるか確認してください。");
  }
};

// 写真を撮る関数
const takePhoto = () => {
  const canvas = $refs.canvas;  // 非表示のcanvas要素を参照
  const video = $refs.video;  // ビデオ要素を参照
  canvas.width = video.videoWidth;  // ビデオの幅をcanvasに設定
  canvas.height = video.videoHeight;  // ビデオの高さをcanvasに設定
  const context = canvas.getContext('2d');  // canvasのコンテキストを取得
  context.drawImage(video, 0, 0);  // ビデオのフレームをcanvasに描画
  photoUrl.value = canvas.toDataURL('image/png');  // canvasから画像URLを取得
};

// 戻るボタンの処理
const goBack = () => {
  router.push({ name: 'face' });  // 'face' 画面に遷移
};

// コンポーネントがマウントされた際に初期化処理（現在は特に何もしない）
onMounted(() => {
  // 初期化処理が必要な場合
});
</script>

<style scoped>
/* 全体的に横幅を広げる */
.wide-container {
  max-width: 1200px; /* 最大幅を設定して広くする */
  width: 100%;
  padding: 20px;
}

/* ビールの色をイメージした背景のグラデーション */
.v-container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f);
  height: 100vh;
  padding: 20px;
}

/* ヘッダー部分 (左上にユーザー画像と名前) */
.user-header {
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 20px;
}

.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-size: 1.5rem; /* 名前を少し大きめに */
  color: #3e2723;  /* 茶色 */
}

/* タイトルのスタイル */
.title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #3e2723;  /* 茶色 */
}

/* サブタイトルのスタイル */
.subtitle {
  font-size: 1.8rem;
  margin-top: 20px;
  color: #3e2723;
}

/* ボタンの共通スタイル */
.v-btn {
  width: 100%;
  max-width: 400px;  /* ボタンを少し広げる */
  height: 50px;
  margin: 10px 0;
  font-size: 1rem;
}

/* お酒の登録ボタン */
.register-button {
  background-color: #3e2723;
  color: white;
}

/* 戻るボタンのスタイル */
.back-button {
  background-color: #3e2723;
  color: white;
}

/* カメラの表示領域 */
.camera-container {
  margin-top: 20px;
  text-align: center;
}

/* ビデオ要素のスタイル */
.video {
  width: 100%;
  max-width: 600px;  /* ビデオの幅を広げる */
  height: auto;
  border: 2px solid #3e2723;  /* 茶色の枠 */
  border-radius: 5px;  /* 角を丸く */
}

/* 写真を撮るボタンのスタイル */
.capture-button {
  margin-top: 10px;
  background-color: #5d4037;  /* 明るい茶色 */
  color: white;
}

/* 撮影した写真のスタイル */
.captured-image {
  margin-top: 10px;
  width: 100%;  /* 自動調整 */
  max-width: 500px;  /* 最大幅を設定 */
  border: 2px solid #3e2723;  /* 茶色の枠 */
  border-radius: 5px;  /* 角を丸く */
}

/* 飲んだお酒のリストカードのスタイル */
.drink-card {
  background-color: #fff5e1;  /* 淡い背景色 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin: 20px 0;
}

/* 飲んだお酒リストのスタイル */
.drink-list ul {
  padding-left: 20px; /* 左の余白 */
  list-style-type: none;  /* 箇条書きの点を消す */
}

.drink-list li {
  font-size: 1.2rem;
  color: #3e2723;
  margin-bottom: 10px; /* 各項目の間隔を空ける */
}
</style>

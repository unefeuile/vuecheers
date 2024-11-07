<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div class="text-center">
      <h1 class="title">お酒の登録</h1>

      <v-btn @click="startCamera" class="camera-button">カメラを起動</v-btn>

      <div v-if="isCameraActive" class="camera-container">
        <video ref="video" autoplay class="video"></video>
        <v-btn @click="takePhoto" class="capture-button">写真を撮る</v-btn>
        <canvas ref="canvas" style="display: none;"></canvas>
      </div>

      <div v-if="photoUrl">
        <img :src="photoUrl" alt="撮影した写真" class="captured-image" />
      </div>

      <v-divider class="my-4" />

      <h2 class="subtitle">飲んだお酒一覧</h2>
      <v-list>
        <v-list-item v-for="(drink, index) in drinks" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ drink.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ drink.details }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="my-4" />

      <v-btn @click="goBack" class="back-button">戻る</v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;

const drinkName = ref('');
const drinkDetails = ref('');
const drinks = ref([]);
const isCameraActive = ref(false);
const photoUrl = ref('');

// カメラを起動する関数
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }, // 内カメラを指定
    });
    const video = $refs.video;
    video.srcObject = stream;
    video.play();
    isCameraActive.value = true;
  } catch (error) {
    console.error("カメラの起動に失敗しました: ", error);
    alert("カメラの起動に失敗しました。カメラが使用できるか確認してください。");
  }
};

// 写真を撮る関数
const takePhoto = () => {
  const canvas = $refs.canvas;
  const video = $refs.video;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0);
  photoUrl.value = canvas.toDataURL('image/png');
};

// 戻るボタンの処理
const goBack = () => {
  router.push({ name: 'face' });
};

onMounted(() => {
  // 初期化処理が必要な場合
});
</script>

<style scoped>
.v-container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* ビールのグラデーション */
  height: 100vh;
}

.title {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #3e2723; /* 茶色 */
}

.subtitle {
  font-size: 1.5rem;
  margin-top: 20px;
}

.back-button {
  margin-top: 20px;
  background-color: #3e2723; /* 茶色 */
  color: #fff;
}

.camera-container {
  margin-top: 20px;
  text-align: center;
}

.video {
  width: 100%;
  height: auto;
  border: 2px solid #3e2723; /* 茶色の枠 */
  border-radius: 5px; /* 角を丸く */
}

.capture-button {
  margin-top: 10px;
  background-color: #5d4037; /* 明るい茶色 */
  color: #fff;
}

.captured-image {
  margin-top: 10px;
  width: 100%; /* 自動調整 */
  max-width: 300px; /* 最大幅を設定 */
  border: 2px solid #3e2723; /* 茶色の枠 */
  border-radius: 5px; /* 角を丸く */
}
</style>

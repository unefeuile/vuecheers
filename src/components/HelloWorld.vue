<template>
  <v-container class="d-flex align-center justify-center fill-height">
    <div class="text-center">
      <h1 class="title">お酒の登録</h1>

      <v-btn @click="startCamera" class="camera-button">カメラを起動</v-btn>

      <div v-if="isCameraActive" class="camera-container">
        <video ref="video" autoplay></video>
        <v-btn @click="takePhoto" class="capture-button">写真を撮る</v-btn>
        <canvas ref="canvas" style="display: none;"></canvas>
      </div>

      <div v-if="photoUrl">
        <img :src="photoUrl" alt="撮影した写真" />
      </div>

      <v-divider class="my-4" />

      <v-form @submit.prevent="addDrink">
        <v-text-field
          v-model="drinkName"
          label="お酒の名前"
          required
        />
        <v-text-field
          v-model="drinkDetails"
          label="詳細"
          required
        />
        <v-btn type="submit" class="submit-button">登録</v-btn>
      </v-form>

      <v-divider class="my-4" />

      <h2 class="subtitle">飲んだお酒一覧</h2>
      <v-list>
        <v-list-item
          v-for="(drink, index) in drinks"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>{{ drink.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ drink.details }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider class="my-4" />

      <!-- 戻るボタン -->
      <v-btn @click="goBack" class="back-button">
        戻る
      </v-btn>
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
const video = ref(null);
const canvas = ref(null);

// カメラを起動する関数
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
    video.value.play();
    isCameraActive.value = true;
  } catch (error) {
    console.error("カメラの起動に失敗しました: ", error);
  }
};

// 写真を撮る関数
const takePhoto = () => {
  const ctx = canvas.value.getContext('2d');
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  ctx.drawImage(video.value, 0, 0);
  photoUrl.value = canvas.value.toDataURL('image/png');
};

// お酒を登録する関数
const addDrink = () => {
  if (drinkName.value && drinkDetails.value) {
    drinks.value.push({
      name: drinkName.value,
      details: drinkDetails.value,
      photo: photoUrl.value, // 写真も追加
    });
    drinkName.value = '';
    drinkDetails.value = '';
    photoUrl.value = ''; // クリア
  }
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
.title {
  font-size: 2rem;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 1.5rem;
  margin-top: 20px;
}

.submit-button {
  margin-top: 20px;
  background-color: #ff5722;
  color: #fff;
}

.back-button {
  margin-top: 20px;
  background-color: #007bff;
  color: #fff;
}

.camera-container {
  margin-top: 20px;
}

.video {
  width: 100%;
  height: auto;
}

.capture-button {
  margin-top: 10px;
}
</style>

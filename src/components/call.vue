<template>
  <v-container class="d-flex align-center justify-center fill-height warning-container">
    <div class="text-container">
      <!-- 警告アイコンとタイトル -->
      <h1 class="main-title">
        ⚠️ WARNING
      </h1>
      <p class="highlighted-text">{{ lowestUser }}</p>
      
      <!-- 戻るボタン（中央配置） -->
      <div class="button-container">
        <v-btn class="cta-button" @click="navigateBack">
          戻る
        </v-btn>
      </div>

      <!-- 音声ファイルを再生するためのaudioタグ -->
      <audio ref="audio" :src="audioSrc" autoplay @loadeddata="onAudioLoaded">
        Your browser does not support the audio element.
      </audio>
    </div>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'; 
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

const audioSrc = ref('');
const audioElement = ref(null);
const lowestUser = ref('');
const bloodAlcoholLevel = ref('');
const loading = ref(false);
const error = ref(null);
const output = ref('');
const scriptOutput = ref('');



const fetchLowestUser = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get('http://localhost:5000/api/lowest_user');
    lowestUser.value = response.data.lowest_user;
    bloodAlcoholLevel.value = response.data.blood_alcohol_level;
  } catch (err) {
    error.value = err.response?.data?.error || 'データの取得に失敗しました。';
  } finally {
    loading.value = false;
  }

};

const runRandomScript = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/run-random-script');
    if (response.data.status === 'success') {
      scriptOutput.value = `スクリプト: ${response.data.script}\n出力:\n${response.data.output}`;
      console.log('スクリプトを実行できました');

      //スクリプト実行後に音声ファイルを再生
      playAudio();
    } else {
      scriptOutput.value = `エラー: ${response.data.message}`;
    }
  } catch (error) {
    console.error(error);
    scriptOutput.value = "スクリプトの実行に失敗しました。";
  }
};

//音声再生
const playAudio = () => {
  const audioSrc = 'http://localhost:5000/static/audio/output.mp3'
  const audio = new Audio(audioSrc);
  audio.play();

  audio.play()
  .then(() => {
    console.log('音声が再生されました:', audioSrc);
  })
  .catch((error) => {
    console.error('音声が再生されませんでした:', error);
  });
}


// コンポーネントの読み込み時にデータを取得
onMounted(() => {
  fetchLowestUser();
  runRandomScript();
});

// useRouter を setup() 内で呼び出す
const router = useRouter();

// 戻るボタンのクリックイベント
const navigateBack = () => {
  router.push({ name: 'face' });  // face.vue に遷移
};

</script>

<style scoped>
/* 強烈な赤の背景 */
.warning-container {
  background: linear-gradient(to bottom, #d32f2f, #b71c1c); /* 深い赤色のグラデーション */
  height: 100vh;
  padding: 20px;
  animation: zoomInOut 1s ease-out infinite alternate;  /* ズームイン・ズームアウトアニメーションの速さ調整 */
}

/* テキスト部分 */
.text-container {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.2); /* 半透明の白背景 */
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);  /* 背景をぼかしてテキストが際立つ */
  animation: scaleIn 0.5s ease-out; /* 出現時に拡大する */
}

/* メインタイトル（警告を強調） */
.main-title {
  font-size: 4.5rem;
  font-weight: bold;
  color: #ffffff; /* 白色 */
  margin-bottom: 30px;
  text-shadow: 4px 4px 10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 0, 0, 1); /* 強烈な影とグロー */
  animation: glow 1.5s ease-in-out infinite alternate; /* タイトルのグローエフェクト */
}

/* 警告テキスト（強調） */
.highlighted-text {
  font-size: 2.5rem;
  color: #ffeb3b;  /* 明るい黄色 */
  font-weight: bold;
  background-color: #ff1744; /* 鮮やかな赤背景 */
  padding: 15px;
  border-radius: 5px;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
  animation: pulse 1s ease-in-out infinite alternate; /* テキストの強調 */
}

/* 戻るボタンのコンテナ */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;  /* 上に少し余白を追加 */
}

/* 戻るボタン */
.cta-button {
  font-size: 1.5rem;
  padding: 15px 30px;
  background-color: #f44336; /* 赤色 */
  color: white;
  border-radius: 10px;
  text-transform: uppercase; /* ボタンの文字を大文字に */
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  min-width: 200px; /* 最小幅を確保 */
  height: 60px; /* ボタンの高さを調整 */
}

.cta-button:hover {
  background-color: #b71c1c; /* ホバー時の色変更 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* 背景ズームイン・ズームアウトアニメーション */
@keyframes zoomInOut {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}

/* 出現時に拡大するエフェクト */
@keyframes scaleIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* タイトルのグローエフェクト */
@keyframes glow {
  0% {
    text-shadow: 0 0 10px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 0.8);
  }
  50% {
    text-shadow: 0 0 30px rgba(255, 0, 0, 1), 0 0 60px rgba(255, 0, 0, 0.8);
  }
  100% {
    text-shadow: 0 0 10px rgba(255, 0, 0, 1), 0 0 20px rgba(255, 0, 0, 0.8);
  }
}

/* 強調するテキストの動き */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
</style>
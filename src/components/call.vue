<template>
  <v-container class="d-flex align-center justify-center fill-height warning-container">
    <div class="text-container">
      <!-- 警告アイコンとタイトル -->
      <h1 class="main-title">
        ⚠️ WARNING
      </h1>
      <p class="highlighted-text">たかひろ</p>
      
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
import { useRouter } from 'vue-router';  // useRouter をインポート
import { ref, onMounted } from 'vue';

// audioSrc と audioElement の設定
const audioSrc = ref('');  // 音声ファイルの URL を動的に設定
const audioElement = ref(null);

// useRouter を setup() 内で呼び出す
const router = useRouter();

// 戻るボタンのクリックイベント
const navigateBack = () => {
  router.push({ name: 'face' });  // face.vue に遷移
};

// 音声ファイルの URL 設定
onMounted(() => {
  // 音声ファイルの配列
  const audioFiles = [
    'output.mp3',
    'output1.mp3',
    'output2.mp3'
  ];

  // ランダムに音声ファイルを選択
  const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];

  // 音声ファイルのURLを設定
  audioSrc.value = `http://127.0.0.1:5000/audio/${randomAudio}`;  // サーバーパスに応じて変更

  // オーディオを再生
  if (audioElement.value) {
    audioElement.value.play();  // 自動で音声を再生
  }
});

// 音声がロードされた時に再生する関数
const onAudioLoaded = () => {
  if (audioElement.value) {
    audioElement.value.play();  // 音声ファイルがロードされたら再生開始
  }
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

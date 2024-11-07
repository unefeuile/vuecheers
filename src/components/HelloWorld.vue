<template>
  <div class="container">
    <h1 class="title">Cheers</h1>
    <img src="/beer.png" alt="中央の写真" class="image" />
    <button @click="startGame" :disabled="isGameStarted" class="start-button">スタート</button>

    <!-- 泡を表示するためのコンテナ -->
    <div class="bubble-container">
      <!-- 配列bubblesの各要素（泡）を繰り返し表示 -->
      <div v-for="bubble in bubbles" :key="bubble.id" class="bubble" :style="bubble.style"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const bubbles = ref([]); // 泡の配列
    const isGameStarted = ref(false); // ゲームが開始されたかどうかの状態

    // コンポーネントがマウントされたときに実行される処理
    onMounted(() => {
      const audio = new Audio('/cheers-47720.mp3'); // 音声ファイルのパス
      audio.volume = 0.5; // 音量設定（0.0から1.0）
      audio.play(); // 音を再生

      // 0.3秒ごとに泡を生成するためのインターバル
      setInterval(createBubble, 300); 
    });

    // ゲーム開始の処理
    const startGame = () => {
      if (!isGameStarted.value) {
        // ゲーム開始ボタンが押されたときに音を再生
        const audio = new Audio('/meka_ge_mouse_s02.mp3'); // 音声ファイルのパス
        audio.volume = 0.5; // 音量設定
        audio.play(); // 音を再生

        isGameStarted.value = true; // ゲーム開始フラグをtrueに
        router.push('/user'); // ユーザー画面に遷移
      }
    };

    // 泡を作成する関数
    const createBubble = () => {
      const size = Math.random() * 20 + 10; // ランダムなサイズ（10pxから30px）
      const left = Math.random() * 100; // ランダムな位置（0%から100%）
      const duration = Math.random() * 5 + 5; // ランダムなアニメーション時間（5秒から10秒）

      // 泡のスタイルを設定
      const bubbleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
      };

      // 新しい泡をbubbles配列に追加
      bubbles.value.push({
        id: Date.now(), // 一意なIDを生成
        style: bubbleStyle, // 泡のスタイル
      });

      // 最大30個の泡を保持するために古い泡を削除
      if (bubbles.value.length > 30) {
        bubbles.value.shift(); // 先頭の泡を削除
      }
    };

    // コンポーネントがアンマウントされる前に実行される処理
    onBeforeUnmount(() => {
      bubbles.value = []; // 泡の配列をリセット
    });

    // 必要なデータと関数を返却
    return { startGame, bubbles, isGameStarted };
  },
};
</script>

<style scoped>
/* コンテナ全体のスタイル */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* ビューポートの高さに合わせる */
  text-align: center;
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* グラデーション背景 */
  overflow: hidden; /* 内容がはみ出さないように */
  position: relative; /* 泡の位置を制御するために必要 */
}

/* タイトルのスタイル */
.title {
  font-size: 5rem; /* フォントサイズ */
  font-weight: bold;
  color: #3e2723; /* ダークブラウンの色 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 影付き */
  margin-bottom: 20px; /* 下に余白を追加 */
  z-index: 1; /* 背景の上に表示するため */
}

/* 画像のスタイル */
.image {
  width: 300px;
  height: auto;
  margin-bottom: 20px;
}

/* スタートボタンのスタイル */
.start-button {
  padding: 15px 30px;
  font-size: 1.5rem;
  color: #ffffff; /* 文字色 */
  background-color: #3e2723; /* ダークブラウンの背景 */
  border: none;
  border-radius: 5px; /* 丸みのある角 */
  cursor: pointer; /* マウスカーソルをポインタに */
  margin-top: 30px; /* 上に余白を追加 */
  transition: background-color 0.3s, transform 0.3s; /* ホバー時のトランジション効果 */
  position: relative;
  z-index: 2; /* タイトルの上に表示 */
}

/* スタートボタンのホバー時のスタイル */
.start-button:hover {
  background-color: #5d4037; /* ボタン色の変更 */
  transform: scale(1.05); /* ボタンを少し拡大 */
}

/* ボタンが無効な場合のスタイル */
.start-button:disabled {
  background-color: #9e9e9e; /* グレー色 */
  cursor: not-allowed; /* カーソルを無効に */
}

/* 泡を表示するコンテナ */
.bubble-container {
  position: absolute;
  top: 50px; /* 上から50pxの位置 */
  left: 0;
  right: 0;
  height: calc(100vh - 50px); /* 高さを調整 */
  overflow: hidden; /* 内容がはみ出さないように */
}

/* 各泡のスタイル */
.bubble {
  position: absolute;
  bottom: 0; /* 下から出現 */
  border-radius: 50%; /* 丸い形 */
  background: rgba(255, 255, 255, 0.6); /* 半透明な白 */
  opacity: 0.8; /* 透明度 */
  animation: bubble-float 10s forwards; /* アニメーションの適用 */
  z-index: 0; /* 背景に表示 */
}

/* 泡が浮かぶアニメーション */
@keyframes bubble-float {
  0% {
    transform: translateY(0); /* 初期位置 */
    opacity: 0.8; /* 初期透明度 */
  }
  100% {
    transform: translateY(-150vh); /* 高さを上にスライド */
    opacity: 0; /* 完全に透明になる */
  }
}
</style>

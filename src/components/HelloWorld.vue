<template>
  <div class="container">
    <h1 class="title">Cheers</h1>
    <img src="/beer.png" alt="中央の写真" class="image" />
    <v-btn @click="startGame" :disabled="isGameStarted" class="start-button">スタート</v-btn>

    <div class="bubble-container">
      <div v-for="bubble in bubbles" :key="bubble.id" class="bubble" :style="bubble.style"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default {
  setup() {
    const router = useRouter();
    const bubbles = ref([]);
    const isGameStarted = ref(false); // ゲーム開始状態

    // Firestore コレクション内の全データを削除する関数
    const deleteAllDocuments = async (collectionName) => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        for (const docSnap of querySnapshot.docs) {
          await deleteDoc(doc(db, collectionName, docSnap.id));
        }
        console.log(`コレクション '${collectionName}' の全ドキュメントが削除されました。`);
      } catch (error) {
        console.error('ドキュメント削除に失敗しました:', error);
      }
    };

    // 画面が開いたときに音を再生
    onMounted(() => {
      const audio = new Audio('/cheers-47720.mp3'); // 音のファイルパス
      audio.volume = 0.5; // 音量設定
      audio.play();

      setInterval(createBubble, 300); // 0.3秒ごとに泡を生成
    });

    const startGame = async () => {
      if (!isGameStarted.value) {
        // スタートボタンが押されたときに音を再生
        const audio = new Audio('/meka_ge_mouse_s02.mp3'); // 音のファイルパス
        audio.volume = 0.5; // 音量設定
        audio.play();

        try {
          // Firestore のデータ削除
          await deleteAllDocuments('drinking_records');
          await deleteAllDocuments('drinking_place');
        }catch (error) {
          console.error('ドキュメント削除に失敗しました:', error);
        };
        

        isGameStarted.value = true; // ゲーム開始状態を更新
        router.push('/user'); // ユーザー画面に遷移
      }
    };

    const createBubble = () => {
      const size = Math.random() * 20 + 10; // 10pxから30pxのサイズ
      const left = Math.random() * 100; // 0%から100%の位置
      const duration = Math.random() * 5 + 5; // 5秒から10秒の間

      const bubbleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
      };

      bubbles.value.push({
        id: Date.now(),
        style: bubbleStyle,
      });

      if (bubbles.value.length > 30) {
        bubbles.value.shift(); // 最大30個の泡を保持
      }
    };

    onBeforeUnmount(() => {
      bubbles.value = [];
    });

    return { startGame, bubbles, isGameStarted };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background: linear-gradient(to bottom, #fdd835, #ffe57f);
  overflow: hidden;
  position: relative;
}

.title {
  font-size: 5rem;
  font-weight: bold;
  color: #3e2723;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  z-index: 1;
}

.image {
  width: 300px;
  height: auto;
  margin-bottom: 20px;
}

.start-button {
  padding: 15px 30px;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: #3e2723;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.3s, transform 0.3s;
  position: relative;
  z-index: 2;
}

.start-button:hover {
  background-color: #5d4037;
  transform: scale(1.05);
}

.start-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

.bubble-container {
  position: absolute;
  top: 50px; 
  left: 0;
  right: 0;
  height: calc(100vh - 50px);
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6); /* 白っぽい透明感 */
  opacity: 0.8; /* 半透明に */
  animation: bubble-float 10s forwards;
  z-index: 0;
}

@keyframes bubble-float {
  0% {
    transform: translateY(0);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-150vh); /* 浮かび上がる高さを増やす */
    opacity: 0; /* 徐々に透明になる */
  }
}
</style>

<template>
  <!-- コンテナを中央に配置 -->
  <v-container class="d-flex align-center justify-center fill-height container">
    <div class="text-center">
      <!-- パーティ名と結果発表のタイトル -->
      <h1 class="title">{{ partyName }} 結果発表</h1>
  
      <!-- ユーザーとその結果画像の表示 -->
      <div class="result-container">
        <div v-for="(user, index) in users" :key="user.name" class="user-result">
          <!-- ユーザー名とその横に結果画像 -->
          <div class="user-info">
            <!-- ユーザー名の文字を小さく -->
            <h3 class="user-name">{{ user.name }}</h3>
            <div class="user-images">
              <v-img
                v-for="(image, imgIndex) in user.images"
                :key="imgIndex"
                :src="image"
                alt="Result Image"
                class="result-image"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 終了ボタン -->
      <div class="button-container">
        <v-btn @click="goBack" class="back-button">
          終了
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
// 必要なライブラリをインポート
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// ルーターからパラメータを取得
const route = useRoute();
const router = useRouter();

// パーティ名の取得（デフォルト値も設定）
const partyName = ref(route.params.partyName || '未定');

// ユーザーとその結果画像データ
const users = ref([
  { name: 'ユーザー１', images: ['result.png', 'result.png', 'result.png'] },
  { name: 'ユーザー２', images: ['result.png', 'result.png', 'result.png', 'result.png'] },
  { name: 'ユーザー３', images: ['result.png'] },
  { name: 'ユーザー４', images: ['result.png', 'result.png'] },
  { name: 'ユーザー５', images: ['result.png', 'result.png'] },
  { name: 'ユーザー６', images: ['result.png', 'result.png', 'result.png'] }
]);

// 終了ボタンの動作（タイトルページに戻る）
const goBack = () => {
  router.push({ name: 'title' });
};
</script>

<style scoped>
/* 背景のグラデーション設定 */
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* 明るい黄色のビールをイメージした背景 */
  height: 100vh;  /* 画面全体の高さ */
}

/* タイトルのスタイル */
.title {
  color: #5d3d2c; /* 茶色 */
  font-size: 2rem;
  margin-bottom: 20px;
}

/* 結果コンテナのスタイル */
.result-container {
  margin-bottom: 30px;
}

/* 各ユーザーの情報を縦に並べる */
.user-result {
  margin-bottom: 20px;
}

.user-info {
  display: flex;  /* ユーザー名と画像を横に並べる */
  justify-content: flex-start;  /* 左寄せにする */
  align-items: center;
  gap: 10px;  /* ユーザー名と画像の間隔 */
}

/* ユーザー名のスタイル */
.user-name {
  color: #5d3d2c;
  font-size: 1rem; /* すべてのユーザー名の文字サイズを小さく */
  font-weight: normal; /* 太字ではなく通常の太さ */
  margin: 0;
}

/* ユーザー画像のスタイル */
.user-images {
  display: flex;
  gap: 10px; /* 画像間隔を設定 */
}

.result-image {
  width: 60px;  /* 画像のサイズを小さく */
  height: 60px;
  object-fit: cover; /* 画像のアスペクト比を保ちながらサイズ調整 */
  border-radius: 8px;
}

/* 終了ボタンのコンテナのスタイル */
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

/* 終了ボタンのスタイル */
.back-button {
  font-size: 1.5rem;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #ff0000;
  color: #fff;
  width: 150px;
  height: 50px;
  transition: background-color 0.3s, transform 0.3s;
}

/* 終了ボタンのホバー効果 */
.back-button:hover {
  background-color: #cc0000;
  transform: scale(1.05);
}
</style>

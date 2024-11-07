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
            <!-- ユーザー名の文字を左寄せ -->
            <h3 class="user-name">{{ user.name }}</h3>
            <div class="user-images">
              <v-img
                v-for="(image, imgIndex) in getImageArray(user.value)"
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

// ユーザーとその結果画像データ（値を持たせて変更）
const users = ref([
  { name: '【ユーザー１】', value: 3 },
  { name: '【ユーザー２】', value: 8 },
  { name: '【ユーザー３】', value: 12 },
  { name: '【ユーザー４】', value: 6 },
  { name: '【ユーザー５】', value: 20 },
  { name: '【ユーザー６】', value: 48 }
]);

// 値に応じた画像数を生成する関数
const getImageArray = (value) => {
  const imageCount = Math.min(Math.floor(value / 5), 10); // 5 ごとに画像を増加（最大で 10 枚）
  const imageArray = Array(imageCount).fill('result.png');  // `result.png` を配列に追加
  return imageArray;
};

// 終了ボタンの動作（タイトルページに戻る）
const goBack = () => {
  router.push({ name: 'Helloworld' });
};
</script>

<style scoped>
/* 背景のグラデーション設定 */
.container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f); /* 明るい黄色のビールをイメージした背景 */
  height: 100vh;  /* 画面全体の高さ */
  background-size: cover; /* 背景を画面全体にフィットさせる */
  background-position: center; /* 背景の位置を中央に設定 */
  background-repeat: no-repeat; /* 背景を繰り返さない */
}

/* タイトルのスタイル */
.title {
  color: #5d3d2c; /* 茶色 */
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

/* 結果コンテナのスタイル */
.result-container {
  margin-bottom: 30px;
}

/* 各ユーザーの情報を縦に並べる */
.user-result {
  margin-bottom: 20px;
}

/* ユーザー名と画像を横に並べる */
.user-info {
  display: flex;  /* ユーザー名と画像を横に並べる */
  justify-content: flex-start;  /* ユーザー名を左寄せにする */
  align-items: flex-start;
  gap: 10px;  /* ユーザー名と画像の間隔 */
  flex-wrap: wrap;  /* 画像が画面幅に応じて折り返す */
  width: 100%;
}

/* ユーザー名のスタイル */
.user-name {
  color: #5d3d2c;
  font-size: 1rem; /* すべてのユーザー名の文字サイズを小さく */
  font-weight: normal; /* 太字ではなく通常の太さ */
  margin: 0;
  text-align: left; /* ユーザー名を左寄せ */
  flex-basis: 100%;  /* ユーザー名は1行目に表示 */
}

/* ユーザー画像のスタイル */
.user-images {
  display: flex;
  gap: 15px; /* 画像間隔を設定 */
  flex-wrap: wrap; /* 画像が画面幅に応じて折り返す */
  justify-content: flex-start; /* 画像を左寄せに配置 */
  flex-basis: 100%;  /* 画像も1行目に表示 */
}

.result-image {
  width: 100px;  /* 画像のサイズを小さく */
  height: 100px;
  object-fit: cover; /* 画像のアスペクト比を保ちながらサイズ調整 */
  border-radius: 80px;
  flex-shrink: 0; /* 画像が縮小しないように設定 */
  margin-bottom: 5px; /* 画像の下に余白を追加 */
  flex-grow: 0; /* 画像が伸びないように */
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

/* モバイル用レスポンシブデザイン */
@media (max-width: 600px) {
  .title {
    font-size: 1.5rem;  /* タイトルを小さく */
  }

  .result-image {
    width: 40px;  /* 画像を小さく */
    height: 40px;
  }

  .user-name {
    font-size: 0.9rem;  /* ユーザー名を小さく */
  }

  .back-button {
    font-size: 1.2rem;  /* ボタンの文字を小さく */
    width: 120px;  /* ボタンの幅を小さく */
  }
}
</style>

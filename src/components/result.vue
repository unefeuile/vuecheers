<template>
  <!-- コンテナを中央に配置 -->
  <v-container class="d-flex align-center justify-center fill-height container">
    <div class="text-center">
      <!-- パーティ名と結果発表のタイトル -->
      <h1 class="title">{{ partyName }} 飲み会 結果</h1>

      <!-- ユーザーとその結果画像の表示 -->
      <div class="result-container">
        <div v-for="(user, index) in users" :key="user.name" class="user-result">
          <!-- ユーザー名とその横に結果画像 -->
          <div class="user-info"> 
            <!-- ユーザー名の文字を小さく -->
            <h3 class="user-name">{{ user.name }}</h3>
            <!-- 飲んだお酒の数を表示 -->
            <p class="drink-count">{{ user.drinkCount }} 杯</p>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

// ルーターからパラメータを取得
const route = useRoute();
const router = useRouter();
const partyName = ref(route.params.partyName || '');
const userName = ref(route.params.userName || '');
const users = ref([]);

const fetchPartyName = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "drinking_place"));
    if (!querySnapshot.empty) {
      // 最初のドキュメントからlocationを取得
      const doc = querySnapshot.docs[0];
      partyName.value = doc.data().location;  // locationフィールドを取得
    } else {
      console.error("drinking_place コレクションにデータがありません");
    }
  } catch (error) {
    console.error("パーティ名の取得に失敗しました: ", error);
  }
};

const fetchUsers = async () => {
  try {
    
    const querySnapshot = await getDocs(collection(db, "drinking_records"));
    users.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().user_name || doc.id,
        drinkCount: Array.isArray(doc.data().alcohol_name_list) ? doc.data().alcohol_name_list.length : 0,
    }));

    console.log(users.value);
  } catch (error) {
    console.error("ユーザー情報の取得に失敗しました: ", error);
  }
};

onMounted(() => {
  fetchPartyName();
  fetchUsers();

});

// 終了ボタンの動作（タイトルページに戻る）
const goBack = () => {
  router.push({ name: 'Helloworld' });
};

</script>

<style scoped>
/* 背景のグラデーション設定 */
.container {
  background: linear-gradient(to bottom, #FDD835, #FFE57F); /* 明るい黄色のビールをイメージした背景 */
  height: 100vh;  /* 画面全体の高さ */
}
/* タイトルのスタイル */
.title {
  color: #5D3D2C; /* 茶色 */
  font-size: 2rem;
  margin-bottom: 40px;
}
/* 結果コンテナのスタイル */
.result-container {
  margin-bottom: 40px;
}
/* 各ユーザーの情報を縦に並べる */
.user-result {
  margin-bottom: 30px;
}
.user-info {
  display: flex;  /* ユーザー名と画像を横に並べる */
  justify-content: flex-start;  /* 左寄せにする */
  align-items: center;
  gap: 40px;  /* ユーザー名と画像の間隔 */
}
/* ユーザー名のスタイル */
.user-name {
  color: #5D3D2C;
  font-size: 1.5rem; /* フォントサイズを大きく */
  font-weight: bold; /* 太字に変更 */
  margin: 0;
}
/* 飲んだお酒の数のスタイル */
.drink-count {
  color: #5D3D2C;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
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
  background-color: #FF0000;
  color: #fff;
  width: 150px;
  height: 50px;
  transition: background-color 0.3s, transform 0.3s;
}
/* 終了ボタンのホバー効果 */
.back-button:hover {
  background-color: #CC0000;
  transform: scale(1.05);
}
</style>
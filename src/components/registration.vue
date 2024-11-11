<template>
  <!-- コンテナ全体を中央に配置し、横幅を広く設定 -->
  <v-container class="d-flex align-center justify-center fill-height wide-container">

    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
      ></v-progress-circular>

    <div class="text-center">
      <!-- ヘッダー部分 (左上にユーザー画像と名前) -->
      <div class="user-header">
        <v-img src="/beer.png" class="user-image" alt="User 1" />
        <v-card-title class="user-name"> {{userId}} </v-card-title>
      </div>
      
      <!-- 飲んだお酒の一覧 -->
      <h2 class="subtitle">飲んだお酒一覧</h2>
      <!-- 飲んだお酒を四角い枠内に表示 -->
      <v-card class="drink-card">
        <v-card-text class="drink-list">
          <!-- 飲んだお酒のリストを表示 -->
          <ul>
            <li v-if="drinks.length === 0">お酒はまだ登録されていません</li>
            <li v-for="(drink, index) in drinks" :key="index">{{ drink }}</li>
          </ul>
        </v-card-text>
      </v-card>
      <!-- お酒の登録ボタン -->
      <v-btn @click="startCamera" class="capture-button">お酒の登録</v-btn>
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
import { db } from '@/firebase';
import { collection, getDocs, query, where,doc, getDoc } from 'firebase/firestore';

// ルーターを使用して、現在のページのパラメーターを取得
const route = useRoute();
const router = useRouter();
const props = defineProps(['userId']);
const userId = route.params.userId;  // userIdを取得
console.log("Received userId:", userId);  // userId.valueで表示

// お酒の情報とカメラの状態を管理するためのref
const drinks = ref([]);  // 飲んだお酒の名前
const isCameraActive = ref(false);
const photoUrl = ref('');
const video = ref(null);
const canvas = ref(null);

const fetchDrinks = async () => {
  try {
    // 指定したユーザーIDでドキュメントを直接取得
    const docRef = doc(db, 'drinking_records', userId); // ドキュメントIDは userId に対応
    const docSnapshot = await getDoc(docRef); // ドキュメントを取得

    console.log(docSnapshot);

    // ドキュメントが存在する場合
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();  // ドキュメントのデータを取得
      console.log("Fetched data:", data); // 取得したデータを表示

      // alcohol_name_list が存在しているか確認
      if (data.alcohol_name_list && Array.isArray(data.alcohol_name_list)) {
        drinks.value = [...drinks.value, ...data.alcohol_name_list]; // 配列を追加
      } else {
        console.log("alcohol_name_list が存在しないか、配列ではありません");
      }
    } else {
      console.log("指定されたドキュメントが存在しません");
    }
  } catch (error) {
    console.error("Firebaseからデータを取得できませんでした:", error);
  }
};

// コンポーネントがマウントされたときに実行
onMounted(() => {
  console.log("Received userId:", userId);
  fetchDrinks();
});

// カメラを起動する関数
const startCamera = async () => {
  try {
    // メディアデバイスを使ってカメラ映像を取得
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },  // ユーザー側のカメラを使用
    });
    if (video.value) {
    video.value.srcObject = stream;
    video.value.play();
    }
    isCameraActive.value = true;  // カメラを起動した状態に設定
  } catch (error) {
    // カメラ起動に失敗した場合のエラーハンドリング
    console.error("カメラの起動に失敗しました: ", error);
    alert("カメラの起動に失敗しました。カメラが使用できるか確認してください。");
  }
};

// 写真を撮る関数
const takePhoto = async () => {
if (canvas.value && video.value) {
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  const context = canvas.value.getContext('2d');
  context.drawImage(video.value, 0, 0);
  photoUrl.value = canvas.value.toDataURL('image/png');

  console.log("photoUrl:", photoUrl.value);

  //画像をバックエンドに送信 (userIdも含まれる)
  await uploadPhoto(photoUrl.value);

 }
};

//画像をアップロードする関数
const uploadPhoto = async (photoUrl) => {
  try {
    //Base64 データからファイル形式を取得
    const base64Image = photoUrl.split(',')[1];

    //userIdを取得
    const userId = route.params.userId;

    //フォームデータを作成
    const formData = new FormData();
    formData.append('image', base64Image);

    //APIエンドポイントにPOSTリクエストを送信
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({image: base64Image, userId: userId}),
    });

    if (response.ok) {
      console.log('画像がアップロードされました');
    } else {
      console.error('画像のアップロードに失敗しました');
    }
  } catch (error) {
    console.error('画像のアップロード中にエラーが発生しました:', error);
  }
  
};


// 戻るボタンの処理
const goBack = () => {
  router.push({ name: 'face' });  // 'face' 画面に遷移
};

</script>

<style scoped>
/* ビールの色をイメージした背景のグラデーション */
.v-container {
  background: linear-gradient(to bottom, #fdd835, #ffe57f);
  height: 100vh;
}

/* 全体的に横幅を広げる */
.full-width-container {
  width: 100%;
  padding: 0;
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
  display: flex;
  justify-content: center; /* カード全体を中央揃え */
  align-items: center;
  text-align: center; /* テキストを中央揃え */
}

/* 飲んだお酒リストのスタイル */

.drink-list ul {
  padding: 0; /* 左の余白 */
  list-style-type: none;  /* 箇条書きの点を消す */
}

.drink-list li {
  font-size: 1.2rem;
  color: #3e2723;
  margin-bottom: 10px; /* 各項目の間隔を空ける */
}

</style>
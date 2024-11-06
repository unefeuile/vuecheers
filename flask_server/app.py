from flask import Flask, send_from_directory
from flask_cors import CORS  # CORS をインポート

app = Flask(__name__)
CORS(app)  # すべてのオリジンからのリクエストを許可

@app.route('/audio/<filename>')
def serve_audio(filename):
    # 音声ファイルを静的に提供
    return send_from_directory('static/audio', filename)

if __name__ == '__main__':
    app.run(debug=True)

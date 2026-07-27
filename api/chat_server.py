#!/usr/bin/env python3
"""园林博士 API 服务 - 云端 DeepSeek 版"""
import http.server
import json
import os
import sys
import urllib.request
import urllib.error

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
if not DEEPSEEK_API_KEY:
    print("⚠️ 请设置环境变量 DEEPSEEK_API_KEY")
    sys.exit(1)
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_MODEL = "deepseek-chat"
PORT = 8767

SYSTEM_PROMPT = """你是一位专业的园林博士（Garden Doctor），精通中国园林、世界园林、植物学、景观设计等领域的知识。
你的职责是回答用户关于园林、园艺、植物养护、景观设计等方面的问题。

回答原则：
1. 专业准确：基于园艺学与园林学的专业知识回答问题
2. 通俗易懂：用平实的语言解释专业概念
3. 实用导向：给出可操作的建议和方案
4. 热情友好：以园林爱好者的热情感染提问者
5. 如果你不确定答案，诚实地说不知道，不要编造

回答用中文，简洁明了，每个回答控制在200字以内。"""

class ChatHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body)
                user_msg = data.get('message', '')
            except:
                self.send_error(400, 'Invalid JSON')
                return

            # Call DeepSeek API
            payload = {
                "model": DEEPSEEK_MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_msg}
                ],
                "max_tokens": 512,
                "temperature": 0.7,
                "stream": False
            }

            try:
                req = urllib.request.Request(
                    DEEPSEEK_URL,
                    data=json.dumps(payload).encode(),
                    headers={
                        'Content-Type': 'application/json',
                        'Authorization': f'Bearer {DEEPSEEK_API_KEY}'
                    },
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=30) as resp:
                    result = json.loads(resp.read())
                    reply = result['choices'][0]['message']['content']
            except Exception as e:
                reply = f"⚠️ 服务暂时不可用，请稍后再试。"

            self.send_response(200)
            self.send_cors_headers()
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({"reply": reply}).encode('utf-8'))
        else:
            self.send_error(404)

    def do_GET(self):
        self.send_error(404)

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def log_message(self, format, *args):
        print(f"[API] {args[0]} {args[1]} {args[2]}")

if __name__ == '__main__':
    server = http.server.HTTPServer(('0.0.0.0', PORT), ChatHandler)
    print(f"🌱 园林博士 API 服务运行在 http://0.0.0.0:{PORT}/api/chat (DeepSeek)")
    server.serve_forever()

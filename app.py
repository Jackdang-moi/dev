import requests.cookies
from flask import Flask, render_template, jsonify, request, session, redirect, url_for

app = Flask(__name__)

from pymongo import MongoClient
import certifi

ca=certifi.where()

# ================================================================================
# db주소는 kjy
client = MongoClient('mongodb+srv://test:sparta@cluster0.itbv7ku.mongodb.net/?retryWrites=true&w=majority')

# ================================================================================
db = client.dbsparta

# JWT 토큰을 만들 때 필요한 비밀문자열입니다. 아무거나 입력해도 괜찮습니다.
# 이 문자열은 서버만 알고있기 때문에, 내 서버에서만 토큰을 인코딩(=만들기)/디코딩(=풀기) 할 수 있습니다.
SECRET_KEY = 'SPARTA'

# JWT 패키지를 사용합니다. (설치해야할 패키지 이름: PyJWT)
import jwt

# 토큰에 만료시간을 줘야하기 때문에, datetime 모듈도 사용합니다.
import datetime

# 회원가입 시엔, 비밀번호를 암호화하여 DB에 저장해두는 게 좋습니다.
# 그렇지 않으면, 개발자(=나)가 회원들의 비밀번호를 볼 수 있으니까요.^^;
import hashlib




#################################
##  HTML을 주는 부분             ##
#################################
@app.route('/')
def home():
    token_receive = request.cookies.get('mytoken')

    try:

        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])

        user_info = db.user.find_one({"id": payload['id']})
        # return render_template('com.html', nickname=user_info["nick"])
        return render_template('com.html')

    except jwt.ExpiredSignatureError:
        # return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
        return redirect(url_for("login"))
    except jwt.exceptions.DecodeError:
        # return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))
        return redirect(url_for("login"))


@app.route('/api/<path>')
def get_path(path):
    return render_template(path + '.html')

@app.route('/detail/<path>')
def get_path_detail(path):
    return render_template('detail.html')


@app.route("/detail", methods=['GET'])
def upload_get():
    upload_data = list(db.upload.find({}, {'_id': False}))
    comment_data = list(db.comment.find({}, {'_id': False}))
    return jsonify({'data': upload_data,'comment': comment_data, })


@app.route("/api/upload", methods=['POST'])
def send_data():
    upload_img = request.form['upload_img']
    upload_title = request.form['upload_title']
    upload_description = request.form['upload_description']


    order_lists = list(db.upload.find({}, {'_id': False}))
    order = len(order_lists) + 1

    db.upload.insert_one({'img': upload_img, 'title': upload_title, 'description': upload_description,'order': order})
    return jsonify({'result': 'SUCCESS', 'message': 'SIGN UP SUCCESS'})


@app.route('/detail/<path>', methods=['POST'])
def send_comment(path):
    try:

        path = request.form['give_path']
        comment = request.form['comment_description']

        token_receive = request.cookies.get('mytoken')
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
        user_info = db.user.find_one({"id": payload['id']})
        nick_name = user_info['nick']

        db.comment.insert_one({'order': path, 'comment': comment, 'nick': nick_name})

        return jsonify({'result': 'SUCCESS'})


    except jwt.ExpiredSignatureError:
        # return redirect(url_for("login", msg="로그인 시간이 만료되었습니다."))
        return redirect(url_for("login"))
    except jwt.exceptions.DecodeError:
        # return redirect(url_for("login", msg="로그인 정보가 존재하지 않습니다."))
        return redirect(url_for("login"))







@app.route('/login')
def login():
    msg = request.args.get("msg")
    return render_template('login.html', msg=msg)


@app.route('/member') # 유저정보를 저정하는 함수
def member():
    return render_template('signup.html')


#################################
##  로그인을 위한 API            ##
#################################

# [회원가입 API]
# id, pw, nickname을 받아서, mongoDB에 저장합니다.
# 저장하기 전에, pw를 sha256 방법(=단방향 암호화. 풀어볼 수 없음)으로 암호화해서 저장합니다.
@app.route('/api/member', methods=['POST'])
def api_member():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']
    nickname_receive = request.form['nick_give']

    if db.user.find_one({'id':id_receive}):
        return jsonify({'msg': '이미 사용중인 e-mail입니다.'})
    elif db.user.find_one({'nick':nickname_receive}):
        return jsonify({'msg': '이미 사용중인 닉네임 입니다.'})
    elif nickname_receive =="":
        return jsonify({'msg': '닉네임을 입력해주세요.'})
    elif id_receive =="":
        return jsonify({'msg': 'e-mail을 입력해주세요.'})
    elif pw_receive =="":
        return jsonify({'msg': '비밀번호를 입력해주세요.'})

    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    db.user.insert_one({'id': id_receive, 'pw': pw_hash, 'nick': nickname_receive})

    return jsonify({'result': 'success'})


# [로그인 API]
# id, pw를 받아서 맞춰보고, 토큰을 만들어 발급합니다.
@app.route('/api/login', methods=['POST'])
def api_login():
    id_receive = request.form['id_give']
    pw_receive = request.form['pw_give']


    # 회원가입 때와 같은 방법으로 pw를 암호화합니다.
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

    # id, 암호화된pw을 가지고 해당 유저를 찾습니다.
    result = db.user.find_one({'id': id_receive, 'pw': pw_hash})

    # 찾으면 JWT 토큰을 만들어 발급합니다.
    if result is not None:
        # JWT 토큰에는, payload와 시크릿키가 필요합니다.
        # 시크릿키가 있어야 토큰을 디코딩(=풀기) 해서 payload 값을 볼 수 있습니다.
        # 아래에선 id와 exp를 담았습니다. 즉, JWT 토큰을 풀면 유저ID 값을 알 수 있습니다.
        # exp에는 만료시간을 넣어줍니다. 만료시간이 지나면, 시크릿키로 토큰을 풀 때 만료되었다고 에러가 납니다.
        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

        }

        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        # token을 줍니다.
        return jsonify({'result': 'success', 'token': token})
    # 찾지 못하면
    else:
        return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})
    return response, 200  # 서버가 제대로 요청을 처리했다는 성공

# [유저 정보 확인 API]
# 로그인된 유저만 call 할 수 있는 API입니다.
# 유효한 토큰을 줘야 올바른 결과를 얻어갈 수 있습니다.
# (그렇지 않으면 남의 장바구니라든가, 정보를 누구나 볼 수 있겠죠?)
@app.route('/api/nick', methods=['GET'])
def api_valid():
    token_receive = request.cookies.get('mytoken')

    # try / catch 문?
    # try 아래를 실행했다가, 에러가 있으면 except 구분으로 가란 얘기입니다.

    try:
        # token을 시크릿키로 디코딩합니다.
        # 보실 수 있도록 payload를 print 해두었습니다. 우리가 로그인 시 넣은 그 payload와 같은 것이 나옵니다.
        payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])


        # payload 안에 id가 들어있습니다. 이 id로 유저정보를 찾습니다.
        # 여기에선 그 예로 닉네임을 보내주겠습니다.
        userinfo = db.user.find_one({'id': payload['id']}, {'_id': 0})
        return jsonify({'result': 'success', 'nickname': userinfo['nick']})
    except jwt.ExpiredSignatureError:
        # 위를 실행했는데 만료시간이 지났으면 에러가 납니다.
        # return jsonify({'result': 'fail', 'msg': '로그인 시간이 만료되었습니다.'})
        return jsonify({'result': 'fail'})
    except jwt.exceptions.DecodeError:
        # return jsonify({'result': 'fail', 'msg': '로그인 정보가 존재하지 않습니다.'})
        return jsonify({'result': 'fail'})




if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)



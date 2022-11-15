from pymongo import MongoClient
from flask import Flask, render_template, jsonify, request

import certifi

ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.hqmjigh.mongodb.net/Cluster0?retryWrites=true&w=majority',
                     tlsCAFile=ca)
db = client.dbsparta
app = Flask(__name__)

@app.route('/api/<path>')
def get_path(path):
    return render_template(path + '.html')

@app.route('/')
def home():
    return render_template('home.html')


@app.route("/detail", methods=['GET'])
def upload_get():
    upload_data = list(db.upload.find({}, {'_id': False}))
    return jsonify({'data': upload_data})


@app.route("/api/upload", methods=['POST'])
def send_data():
    upload_img = request.form['upload_img']
    upload_title = request.form['upload_title']
    upload_description = request.form['upload_description']


    # if db.user.count_documents({'user_id': user_id}) == 0:
    db.upload.insert_one({'img': upload_img, 'title': upload_title, 'description': upload_description})
    return jsonify({'result': 'SUCCESS', 'message': 'SIGN UP SUCCESS'})



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

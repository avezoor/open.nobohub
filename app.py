import os
import json
from flask import Flask, render_template, jsonify

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")

# Data file paths
NODES_FILE = "data/nodes.json"

def load_nodes():
    if os.path.exists(NODES_FILE):
        with open(NODES_FILE, 'r') as f:
            return json.load(f)
    return {"nodes": [], "edges": []}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/nodes', methods=['GET'])
def get_nodes():
    return jsonify(load_nodes())
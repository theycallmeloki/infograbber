import requests
from quart import Quart, request
from quart_cors import cors
import json
import webbrowser


app = Quart(__name__)
app = cors(app, allow_origin="*")

url = ""

@app.route('/postUrlToOpen', methods=["POST"])
async def postUrlToOpen():
    log = await request.get_json()
    global url
    try:
        url = log['url']
        webbrowser.get(using='google-chrome').open(url,new=2)
    except:
        pass
    return json.dumps({"response": "Success"})

@app.route('/getPayload', methods=["GET"])
async def getPayload():
    f = open('assets/payload.json').read()
    return json.dumps(f)

    

app.run(host='0.0.0.0')

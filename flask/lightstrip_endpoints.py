import sys
from flask import Flask, request, Response
from lightstrip_controls import set_color

app = Flask("lightstrip")

@app.route("/set", methods=['POST'])
def post_color_set():

    try:
        data = request.get_json()
        red     = data['red']
        green   = data['green']
        blue    = data['blue']
    except KeyError as e:
        msg = f"Missing key \'{e.args[0]}\' from POST request"
        print(msg, file=sys.stderr)
        return Response(msg, status=400, mimetype="text/plain")

# TODO: Make sure these are numbers, and not the empty string
    set_color(red, green, blue)

    return "Successfully set the lightstrip colors"

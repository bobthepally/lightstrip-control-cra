from flask import Flask, request, Response
from lightstrip_controls import set_color

app = Flask("lightstrip")

@app.route("/set", methods=['POST'])
def post_color_set():

    try:
        red     = request.args['red']
        green   = request.args['green']
        blue    = request.args['blue']
    except KeyError as e:
        msg = f"Missing key \'{e.args[0]}\' from POST request"
        return Response(msg, status=405, mimetype="text/plain")

    set_color(red, green, blue)

    return "Successfully set the lightstrip colors"

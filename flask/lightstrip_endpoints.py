import sys # for printing to stderr
from flask import Flask, request, Response
from lightstrip_controls import Lightstrip

app = Flask("lightstrip")

strip = Lightstrip(pixel_count=173)

@app.route("/api/set", methods=['POST'])
def post_color_set():

    # Read in the data from the request
    try:
        data = request.get_json()
        red     = data['red']
        green   = data['green']
        blue    = data['blue']
    except KeyError as e:
        msg = f"Missing key \'{e.args[0]}\' from POST request"
        print(msg, file=sys.stderr)
        return Response(msg, status=400, mimetype="text/plain")

    # Read in data for the specified pattern, defaulting to 0 if it's unspecified.
    try:
        pattern = data['pattern']
    except KeyError as e:
        pattern = 0

    # Data validation section
    try:
        current_key = 'red'
        int_red = int(red)

        current_key = 'green'
        int_green = int(green)

        current_key = 'blue'
        int_blue = int(blue)

        current_key = 'pattern'
        int_pattern = int(pattern)

    except ValueError as e:    
        msg = f"Color argument \'{current_key}\' is not an int"
        print(msg, file=sys.stderr)
        return Response(msg, status=400, mimetype="text/plain")

    # Make call to the lightstrip API
    strip.set_color(red, green, blue, pattern)

    return ("Successfully set the lightstrip colors", 200)

@app.route("/api/get-colors", methods=['GET'])
def get_colors():
    # TODO: implement this

    return ("Getting current colors is not implemented yet", 501)

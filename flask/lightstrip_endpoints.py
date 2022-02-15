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
        colors = data['colors']
        selected_color = data['selectedColor'] # Gets the selected active color from the palette
        speed = data['speed']
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
        # current_key = 'pattern'
        int_pattern = int(pattern)
        int_selected_color = int(selected_color)
        int_speed = int(speed)

        unpack_rgb = lambda c : (int(c['r']), int(c['g']), int(c['b']))

        color_tuples = list(map(unpack_rgb, colors))

    except ValueError as e:    
        msg = f"Color argument is not an int"
        print(msg, file=sys.stderr)
        return Response(msg, status=400, mimetype="text/plain")

    # Make call to the lightstrip API
    strip.set_color(color_tuples, int_selected_color, int_pattern, int_speed)

    return ("Successfully set the lightstrip colors", 200)

@app.route("/api/get-colors", methods=['GET'])
def get_colors():
    # TODO: implement this

    return ("Getting current colors is not implemented yet", 501)

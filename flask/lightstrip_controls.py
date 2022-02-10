# Used to control the lightstrip itself

from serial_coms import ArduinoController

try:
    import board
    import neopixel

    DEFAULT_PIN = board.D18
except NotImplementedError:
    DEFAULT_PIN = None

# Set this to true if you're using an arduino to control the lights
ARDUINO = True

# Amps per subpixel
PIXEL_AMPS = 0.02

class Lightstrip:

    # NeoPixels must be connected to D10, D12, D18 or D21
    def __init__(self, pin=DEFAULT_PIN, pixel_count=30, max_amps=7.0, arduino=ARDUINO) :
        self.pin = pin
        self.pixel_count = pixel_count   
        self.max_amps = max_amps
        self.arduino = arduino

        if self.arduino:
            self.controller = ArduinoController()

    # TODO: re-implement this  
        # else:
        #     self.pixels = neopixel.NeoPixel(pin=pin,n=pixel_count)


    # Sets the colors of the lightstrip and returns a code depending on success or failure
    def set_color(self, colors, selected_color=0, pattern=0):

        # For debugging
        # print(f"rgb({red},{green},{blue}), {pattern}")

        color_amps = map(lambda c : (c[0] / 255) * PIXEL_AMPS + (c[1] / 255) * PIXEL_AMPS + (c[2] / 255) * PIXEL_AMPS, colors)
    
        # single_pixel_amperage = (red / 255) * PIXEL_AMPS + (green / 255) * PIXEL_AMPS + (blue / 255) * PIXEL_AMPS
        # total_amperage = single_pixel_amperage * self.pixel_count

        total_max_amperage = max(color_amps)

        # TODO: throw an exception and handle it at the level above
        if total_max_amperage > self.max_amps:
            print(f"Error: current draw too high. Current: {total_max_amperage}, max: {self.max_amps}")
            return

        # If the 'arduino' variable is set, this sends the data over the com port
        # instead of directly via GPIO pins
        if self.arduino:
            self.controller.send_colors(colors, selected_color, pattern)

        else:
            print(str(colors) + f" selected_color: {str(selected_color)}, pattern: {str(pattern)}")

if __name__ == "__main__":
    
    strip = Lightstrip(pixel_count=30)
    strip.set_color(100, 0, 100)


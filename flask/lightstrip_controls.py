# Used to control the lightstrip itself

import board
import neopixel

class Lightstrip:

    # NeoPixels must be connected to D10, D12, D18 or D21
    def __init__(self, pin=board.D18, pixel_count=30, order=neopixel.GRB, auto_write=False, brightness=0.2) :
        self.pin = pin
        self.pixel_count = pixel_count

        self.pixels = neopixel.NeoPixel(pin, pixel_count, brightness=brightness)
    
    # Sets the colors of the lightstrip and returns a code depending on success or failure
    def set_color(self, red, green, blue):

        # For debugging
        print(f"rgb({red},{green},{blue})")

        self.pixels.fill((red, green, blue))
        self.pixels.show()
        
if __name__ == "__main__":
    
    strip = Lightstrip(pixel_count=30)
    strip.set_color(100, 0, 0)


# Used to control the lightstrip itself

import board
import neopixel

# Amps per subpixel
PIXEL_AMPS = 0.02

class Lightstrip:

    # NeoPixels must be connected to D10, D12, D18 or D21
    def __init__(self, pin=board.D18, pixel_count=30, order=neopixel.GRB, auto_write=False, brightness=0.2, max_amps=7.0) :
        self.pin = pin
        self.pixel_count = pixel_count
        
        self.pixels = neopixel.NeoPixel(pin, pixel_count, brightness=brightness)
    
        self.max_amps = max_amps

    # Sets the colors of the lightstrip and returns a code depending on success or failure
    def set_color(self, red, green, blue):

        # For debugging
        print(f"rgb({red},{green},{blue})")

        single_pixel_amperage = (red / 255) * PIXEL_AMPS + (green / 255) * PIXEL_AMPS + (blue / 255) * PIXEL_AMPS
        total_amperage = single_pixel_amperage * self.pixel_count

        # TODO: throw an exception and handle it at the level above
        if total_amperage > self.max_amps:
            print(f"Error: current draw too high. Current: {total_amperage}, max: {self.max_amps}")
            return

        self.pixels.fill((red, green, blue))
        self.pixels.show()
        
if __name__ == "__main__":
    
    strip = Lightstrip(pixel_count=30)
    strip.set_color(100, 0, 0)


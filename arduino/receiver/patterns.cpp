#include <Adafruit_NeoPixel.h>

#include "patterns.h"

// helper functions
uint8_t unpack_red(uint32_t color) {
    return (uint8_t) (color >> 16);
}

uint8_t unpack_green(uint32_t color) {
    return (uint8_t) (color >> 8);
}

uint8_t unpack_blue(uint32_t color) {
    return (uint8_t) color;
}

void fade_in_and_out(Adafruit_NeoPixel &p, uint32_t color) {
    
    const int time_interval = 50; // delay between each brightness stage
    const size_t count = p.numPixels();
    const double delta = 0.1; // change in brightness per loop
    
    double r = unpack_red(color);
    double g = unpack_green(color);
    double b = unpack_blue(color);

    double brightness = 1.0;

    while (brightness > 0) {
        uint32_t dimmed_color = p.Color(r * brightness, g * brightness, b * brightness);
        p.fill(dimmed_color);
        brightness -= delta;
        delay(time_interval);
    }
}


void evenSpacedDots(Adafruit_NeoPixel &p, uint32_t foregroundColor, uint32_t backgroundColor, int dotNum, int dotLength, unsigned long timeInterval) {
    
    const uint16_t count = p.numPixels();
    int dotInterval = count / dotNum;
    
    for (int j = 0; j < dotInterval; j++) {
        for (int i = 0; i < count; i++) {
            if ((i + j) % dotInterval < dotLength)
                p.setPixelColor(i, foregroundColor);
            else
                p.setPixelColor(i, backgroundColor);
        }
        p.show();
        delay(timeInterval);
    }
}

void backfill(Adafruit_NeoPixel &p, uint32_t foregroundColor, uint32_t backgroundColor) {
  const size_t count = p.numPixels();
  
  for (int i = 0; i < count; i++)
    p.setPixelColor(i, backgroundColor);
  p.show();

  for (int j = 0; j < count; j++) {
    for (int i = 0; i < count - j; i++) {
      p.setPixelColor(i, foregroundColor);
      p.show();
      delay(1);
      p.setPixelColor(i, backgroundColor);
      p.show();
    }
    p.setPixelColor(count - j, foregroundColor); // This is unnecessarily repetitive, probably
    p.show();
  }
}

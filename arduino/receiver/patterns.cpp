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

/*
void even_spaced_dots(Adafruit_NeoPixel &p, uint32_t foreground_color, uint32_t background_color, int dot_num, int dot_length, unsigned long counter) {
    // the counter is used to represent each stage of the dots

    const uint16_t count = p.numPixels();
    int dotInterval = count / dot_num;

    

}
*/

void moving_color(Adafruit_NeoPixel &p, uint32_t foreground_color, uint32_t background_color, uint16_t length, unsigned long counter) {
    
    const uint16_t pixels = p.numPixels();
    unsigned long stage = counter % pixels;

    // p.fill(foreground_color);

    for (uint16_t i = 0; i < pixels; i++) {
        if (i < (length + stage) and i >= stage)
            p.setPixelColor(i, foreground_color);
        else
            p.setPixelColor(i, background_color);
    }

    p.show();
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

/*
void movingTwoColors(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int movingPixels, unsigned long counter) {
  const size_t pixels = p.numPixels();
  unsigned long stage = counter % pixels;

  int currentLocation = 0;
  int locationMovement = 1;
  for (int j = 0; j <= (pixels - movingPixels) * 2; j++) { // For a full cycle
    for (int i = 0; i < pixels; i++) {
      uint32_t currentColor = 0;
      if (i >= currentLocation && i < currentLocation + movingPixels) {
        // pixels.setPixelColor(i, foregroundColor1);
        currentColor += foregroundColor1;
      }
      if (i <= pixels - currentLocation && i > pixels - currentLocation - movingPixels) {
        // pixels.setPixelColor(i, foregroundColor2);
        currentColor += foregroundColor2;
      }
      if (currentColor == 0) { // If the pixel currently has no color, that means it's a background pixel
        //  pixels.setPixelColor(i, backgroundColor);
        currentColor = backgroundColor;
      }
      pixels.setPixelColor(i, currentColor);
    }
    currentLocation += locationMovement;
    if (currentLocation == pixels - movingPixels) // When you reach the ends of the strip, reverse the direction and go again
      locationMovement = locationMovement * -1;
    pixels.show();
  }
}
*/

void two_colors_helper(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int length1, int length2, unsigned long counter) {
  const size_t pixels = p.numPixels();
  int least_length = length1 < length2 ? length1 : length2;
  unsigned long stage = counter % (pixels - least_length);

  for (int i = 0; i < pixels; i++) {
    uint32_t currentColor = 0;

    // first line of pixels
    if (i < length1 + stage and i > stage)
      currentColor += foregroundColor1;
    
    if (i + stage > pixels - length2 and i < pixels - stage)
      currentColor += foregroundColor2;

    if (currentColor == 0) {
      // if currentColor is zero, then it has no color and is meant to be a background pixel.
      // TODO: this assumption is WRONG in the case where you want the foreground color to be zero
      currentColor = backgroundColor;
    }
    p.setPixelColor(i, currentColor);
  }
  p.show();
}

void two_colors(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int length1, int length2, unsigned long counter) {
  const size_t pixels = p.numPixels();

  int least_length = length1 < length2 ? length1 : length2;
  unsigned long stage = counter % ((pixels - least_length) * 2);

  if (stage < (pixels - least_length))
    two_colors_helper(p, foregroundColor1, foregroundColor2, backgroundColor, length1, length2, counter);
  else
    two_colors_helper(p, foregroundColor2, foregroundColor1, backgroundColor, length2, length1, counter);
}

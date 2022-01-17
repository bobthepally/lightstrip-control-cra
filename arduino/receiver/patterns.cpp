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

void two_colors_helper(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int length1, int length2, unsigned long counter) {
  const size_t pixels = p.numPixels();
  int least_length = length1 < length2 ? length1 : length2;
  unsigned long stage = counter % (pixels - least_length);

  for (int i = 0; i < pixels; i++) {
    uint32_t currentColor = 0;

    // first line of pixels
    if (i < length1 + stage and i > stage)
      currentColor = foregroundColor1;
    
    if (i + stage > pixels - length2 and i < pixels - stage)
      currentColor = foregroundColor2;

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

void fade(Adafruit_NeoPixel &p, uint32_t foregroundColor1, double delta, double start_brightness, double end_brightness, unsigned long counter) {
  double brightness_difference = end_brightness - start_brightness;
  unsigned long stage_count = abs(brightness_difference / delta);

  unsigned long stage = counter % stage_count;

  double r = unpack_red(foregroundColor1);
  double g = unpack_green(foregroundColor1);
  double b = unpack_blue(foregroundColor1);

  double brightness = start_brightness;
  brightness = brightness + (delta * (stage + 1));
  
  // brightness = log(1 + brightness);

  r *= brightness;
  g *= brightness;
  b *= brightness;

  uint32_t dimmed_color = p.Color(r, g, b);

  p.fill(dimmed_color);
  p.show();
}

void fade_in_and_out(Adafruit_NeoPixel &p, uint32_t foreground_color, double delta, unsigned long counter) {
  unsigned long stage_half = 1 / delta;
  unsigned long stage_count = 2 * stage_half;
  
  unsigned long stage = counter % stage_count;

  if (stage < stage_half) {
    fade(p, foreground_color, delta, 0, 1, counter);
  } else {
    fade(p, foreground_color, -delta, 1, 0, counter);
  }

}

void two_color_fade_in_and_out(Adafruit_NeoPixel &p, uint32_t color1, uint32_t color2, double delta, unsigned long counter) {
  unsigned long stage_count = 4 * (1 / delta);
  unsigned long stage = counter % stage_count;

  if (stage < stage_count / 2) {
    fade_in_and_out(p, color1, delta, counter);
  } else {
    fade_in_and_out(p, color2, delta, counter);
  }
}

void blending_colors(Adafruit_NeoPixel &p, uint32_t color1, uint32_t color2, int total_stages, unsigned long counter) {
  
  unsigned long stage = counter % total_stages;

  double color1_r = unpack_red(color1);
  double color1_g = unpack_green(color1);
  double color1_b = unpack_blue(color1);

  double color2_r = unpack_red(color2);
  double color2_g = unpack_green(color2);
  double color2_b = unpack_blue(color2);

  double r_delta = (color2_r - color1_r) / total_stages;
  double g_delta = (color2_g - color1_g) / total_stages;
  double b_delta = (color2_b - color1_b) / total_stages;

  double blended_red = color1_r + (r_delta * stage);
  double blended_green = color1_g + (g_delta * stage);
  double blended_blue = color1_b + (b_delta * stage);

  uint32_t blended_color = p.Color(blended_red, blended_green, blended_blue);

  p.fill(blended_color);
  p.show();

}

void blended_color_cycle(Adafruit_NeoPixel &p, uint32_t colors[], size_t color_count, size_t color_stages, unsigned long counter) {
  
  unsigned long total_stages = (color_count - 1) * color_stages;
  unsigned long stage = counter % total_stages;

  size_t color1_index = stage / color_stages;
  size_t color2_index = color1_index + 1;
  
  blending_colors(p, colors[color1_index], colors[color2_index], color_stages, counter);
}

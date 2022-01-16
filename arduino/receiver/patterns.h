#ifndef PATTERNS_H
#define PATTERNS_H

#include <Adafruit_NeoPixel.h>

void fade_in_and_out(Adafruit_NeoPixel &p, uint32_t foreground_color, double delta, unsigned long counter);
void evenSpacedDots(Adafruit_NeoPixel &p, uint32_t foregroundColor, uint32_t backgroundColor, int dotNum, int dotLength, unsigned long timeInterval);
void backfill(Adafruit_NeoPixel &p, uint32_t foregroundColor, uint32_t backgroundColor);
void moving_color(Adafruit_NeoPixel &p, uint32_t foreground_color, uint32_t background_color, uint16_t length, unsigned long counter);
void two_colors(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int length1, int length2, unsigned long counter);
void fade(Adafruit_NeoPixel &p, uint32_t foregroundColor1, double delta, double start_brightness, double end_brightness, unsigned long counter);

// for debugging
// void two_colors_helper(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int length1, int length2, unsigned long counter);

#endif

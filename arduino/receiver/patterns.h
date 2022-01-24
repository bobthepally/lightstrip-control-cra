#ifndef PATTERNS_H
#define PATTERNS_H

#include <Adafruit_NeoPixel.h>

void fade_in_and_out(Adafruit_NeoPixel &p, uint32_t foreground_color, double delta, unsigned long counter);
void backfill(Adafruit_NeoPixel &p, uint32_t foregroundColor, uint32_t backgroundColor);
void moving_color(Adafruit_NeoPixel &p, uint32_t foreground_color, uint32_t background_color, uint16_t length, unsigned long counter);
void two_colors(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int length1, int length2, unsigned long counter);
void fade(Adafruit_NeoPixel &p, uint32_t foregroundColor1, double delta, double start_brightness, double end_brightness, unsigned long counter);
void two_color_fade_in_and_out(Adafruit_NeoPixel &p, uint32_t color1, uint32_t color2, double delta, unsigned long counter);
void blending_colors(Adafruit_NeoPixel &p, uint32_t color1, uint32_t color2, int total_stages, unsigned long counter);
void blended_color_cycle(Adafruit_NeoPixel &p, uint32_t colors[], size_t color_count, size_t color_stages, unsigned long counter);
void even_spaced_dots(Adafruit_NeoPixel &p, uint32_t foreground_color, uint32_t background_color, unsigned long dot_count, unsigned long dot_length, unsigned long counter);
void rainbow_blend(Adafruit_NeoPixel &p, uint32_t colors[], size_t color_count, unsigned long counter);
void random_blips(Adafruit_NeoPixel &p, uint32_t colors[], size_t color_count, size_t number_of_blips, unsigned long counter);

// for debugging
// void two_colors_helper(Adafruit_NeoPixel &p, uint32_t foregroundColor1, uint32_t foregroundColor2, uint32_t backgroundColor, int length1, int length2, unsigned long counter);

#endif

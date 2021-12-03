#ifndef PATTERNS_H
#define PATTERNS_H

#include <Adafruit_NeoPixel.h>

void fade_in_and_out(Adafruit_NeoPixel &p, uint32_t color);
void evenSpacedDots(Adafruit_NeoPixel &p, uint32_t foregroundColor, uint32_t backgroundColor, int dotNum, int dotLength, unsigned long timeInterval);
void backfill(Adafruit_NeoPixel &p, uint32_t foregroundColor, uint32_t backgroundColor);

#endif

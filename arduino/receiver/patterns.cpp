#include <Adafruit_NeoPixel.h>

#include "patterns.h"

/*
void fade_in_and_out(Adafruit_Neopixel p, uint32_t color) {
    
    const int delay = 50; // delay between each brightness stage
    const uint16_t count = p.numPixels();
    const double delta = 0.1; // change in brightness per loop
    
    double brightness = 1.0;

    for (uint16_t i = 0; i < count; i++) {
        p.fill(color);
    }
}
*/

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

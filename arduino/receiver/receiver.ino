// This module receives signals over a COM port and sets the lightstrip color based on those signals

#include <Adafruit_NeoPixel.h>
#include <SerialTransfer.h>

#ifdef __AVR__
  #include <avr/power.h>
#endif

#include "patterns.h"

// Signal pin
#define PIN 6

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 173

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

// Maximum number of colors which can be received over the COM port
#define MAX_COLORS 16

// I swear to god this wouldn't run correctly until I initialized it like this. I'm sorry.
uint32_t current_colors[MAX_COLORS] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
size_t color_count = 0;
size_t selected_color = 0;

// Global variable for the current color
unsigned char currentColorArray[] = {0,0,255};

// Global variable for the current pattern
unsigned char currentPattern = 0;

unsigned long pattern_counter = 0;
unsigned long last_pattern_time = 0;
unsigned long interval = 25; // ms delay between pattern updates

SerialTransfer pyTransfer;

uint32_t rainbow[] = {
  pixels.Color(255,0,0),
  pixels.Color(255,255,0),
  pixels.Color(0,255,0),
  pixels.Color(0,255,255),
  pixels.Color(0,0,255),
  pixels.Color(255,0,255),
  pixels.Color(255,0,0)
};

void setup() {
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined (__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
#endif
  // End of trinket special code

  Serial.begin(115200);
  pyTransfer.begin(Serial);
  pixels.begin(); // This initializes the NeoPixel library.
  singleColor(0); // turns off all lights

  last_pattern_time = millis();
}

void loop() {

    uint32_t mainColor = current_colors[selected_color]; //pixels.Color(currentColorArray[0], currentColorArray[1], currentColorArray[2]);

    if (millis() >= last_pattern_time + interval) {

      switch (currentPattern) {
      case 0:
        singleColor(mainColor);
        break;
      case 1:
        moving_color(pixels, mainColor, 0, 10, pattern_counter);
        break;
      case 2:
        // fade_in_and_out(pixels, mainColor, 0.02, pattern_counter);
        blended_color_cycle(pixels, current_colors, color_count, 80, pattern_counter);
        break;
      case 3: // rainbow
        // blended_color_cycle(pixels, rainbow, 7, 160, pattern_counter);
        rainbow_blend(pixels, rainbow, 7, pattern_counter);
        break;
      case 4: // beat-saber
        two_color_fade_in_and_out(pixels, pixels.Color(200,0,0), pixels.Color(0,40,255), 0.02, pattern_counter);
        break;
      case 5: // karaoke
        random_blips(pixels, rainbow, 7, 10, pattern_counter);
        break;
      default:
        singleColor(0);
      }

      pattern_counter++;
      last_pattern_time = millis();
    }

    // Check if new colors are in the serial buffer
    if (pyTransfer.available() != 0) {

      // get number of colors (first section of packet)
      uint16_t recSize = 0;
      uint32_t data = 0;
      
      recSize = pyTransfer.rxObj(data, recSize);
      size_t sent_color_count = data;

      // TODO: compare sent_color_count with MAX_COLORS to avoid a buffer overflow

      // TODO: sanity check for number of colors as compared to the number of bytes in the message
      uint8_t temp_color_holder[3] = { 0 };
      for (size_t i = 0; i < sent_color_count; i++) {
        for (int j = 0; j < 3; j++) {
          recSize = pyTransfer.rxObj(data, recSize);
          temp_color_holder[j] = data;
        }
        current_colors[i] = pixels.Color(temp_color_holder[0], temp_color_holder[1], temp_color_holder[2]);
      }

      color_count = sent_color_count;

      // read the selected color, and verify it exists in the array
      recSize = pyTransfer.rxObj(data, recSize);
      if (data >= color_count || data >= MAX_COLORS)
        selected_color = 0;
      else
        selected_color = data;

      // read the pattern from the end of the message
      recSize = pyTransfer.rxObj(data, recSize);
      currentPattern = data;
      
      pyTransfer.reset();
    }
}

void singleColor(uint32_t mainColor) {
  for (int i = 0; i < NUMPIXELS; i++)
    pixels.setPixelColor(i, mainColor);
  pixels.show();
}

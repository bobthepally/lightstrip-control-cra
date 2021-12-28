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

// Global variable for the current color
unsigned char currentColorArray[] = {0,0,0};

// Global variable for the current pattern
unsigned char currentPattern = 0;

unsigned long pattern_counter = 0;
unsigned long last_pattern_time = 0;
unsigned long interval = 10; // ms delay between pattern updates

unsigned char serialDataArray[] = {0,0,0,0};
size_t serialIndex = 0;

SerialTransfer pyTransfer;

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

    uint32_t mainColor = pixels.Color(currentColorArray[0], currentColorArray[1], currentColorArray[2]);

    if (millis() >= last_pattern_time + interval) {

      switch (currentPattern) {
      case 0:
        singleColor(mainColor);
        break;
      case 1:
        moving_color(pixels, mainColor, 0, 10, pattern_counter);
        break;
      // case 2:
      //   fade_in_and_out(pixels, mainColor);
      //   break;
      default:
        singleColor(0);
      }

      //moving_color(pixels, mainColor, 0, 10, pattern_counter);

      pattern_counter++;
      last_pattern_time = millis();
    }

   // singleColor(mainColor);

    // Check if new colors are in the serial buffer
    if (pyTransfer.available()) {

      /*
      if (pyTransfer.bytesRead >= 4) {
        currentColorArray[0] = pyTransfer.packet.txBuff[0];
        currentColorArray[1] = pyTransfer.packet.txBuff[1];
        currentColorArray[2] = pyTransfer.packet.txBuff[2];
      
        currentPattern = pyTransfer.packet.txBuff[3];
      }
      */

      uint32_t temp = 0;
      
      uint16_t recSize = 0;

      for (uint16_t i = 0; i < 3; i++) {
        recSize = pyTransfer.rxObj(temp, recSize);
        currentColorArray[i] = temp;
      }

      recSize = pyTransfer.rxObj(temp, recSize);
      currentPattern = temp;
    }
}

void singleColor(uint32_t mainColor) {
  for (int i = 0; i < NUMPIXELS; i++)
    pixels.setPixelColor(i, mainColor);
  pixels.show();
}

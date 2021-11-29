// This module receives signals over a COM port and sets the lightstrip color based on those signals

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

// Signal pin
#define PIN 6

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS 173

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

int delayval = 500; // delay for half a second

// Global variable for the current color
char currentColorArray[] = {0,0,0};

// void singleColor(uint32_t mainColor);

void setup() {
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
#if defined (__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
#endif
  // End of trinket special code

  Serial.begin(9600);
  pixels.begin(); // This initializes the NeoPixel library.
  singleColor(0); // turns off all lights

}

void loop() {

    uint32_t mainColor = pixels.Color(currentColorArray[0], currentColorArray[1], currentColorArray[2]);
    singleColor(mainColor);
}

void singleColor(uint32_t mainColor) {
  for (int i = 0; i < NUMPIXELS; i++)
    pixels.setPixelColor(i, mainColor);
  pixels.show();
}

void serialEvent() {
  while (Serial.available()) {
    char tempArray[] = {0,0,0};
    Serial.readBytes(tempArray, 3);

    // Sets the main color
    currentColorArray[0] = tempArray[0];
    currentColorArray[1] = tempArray[1];
    currentColorArray[2] = tempArray[2];
  }
}

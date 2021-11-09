import serial

from time import sleep

COM_PORT = "/dev/ttyACM0"

class ArduinoController:

    def __init__(self, com_port=COM_PORT, pixel_count=30):
        self.com_port = com_port
        self.pixel_count = pixel_count

        # Initialize the COM port
        try:
            self.s_port = serial.Serial(com_port, timeout=1, baudrate=9600)
            # self.arduino.flushInput()
            # self.arduino.flushOutput()

        except Exception as e:
            # This really shouldn't catch all exceptions and print exceptions about COM ports.

            print("Error: could not initialize COM port. Please verify that you have the right one selected, and that it is not currently in use.")
            print(e)
            exit()

    def send_colors(self, red, green, blue):
        
        # print(f"sending colors rgb({red},{green},{blue})")

        color_array = bytes([int(red), int(green), int(blue)])
        self.s_port.write(color_array)


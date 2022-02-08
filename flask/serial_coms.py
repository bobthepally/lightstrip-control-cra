# import serial

from pySerialTransfer import pySerialTransfer as txfer

from NamedAtomicLock import NamedAtomicLock

COM_PORT = "/dev/ttyACM0"

class ArduinoController:
    def __init__(self, com_port=COM_PORT, pixel_count=30):
        self.com_port = com_port
        self.pixel_count = pixel_count

        # Initialize the COM port
        try:
            # self.s_port = serial.Serial(com_port, timeout=1, baudrate=9600)
            
            self.link = txfer.SerialTransfer(com_port)
            self.link.open()

        except Exception as e:
            # This really shouldn't catch all exceptions and print exceptions about COM ports.

            print("Error: could not initialize COM port. Please verify that you have the right one selected, and that it is not currently in use.")
            print(e)
            exit()

    def send_colors(self, colors, pattern=0):
        
        # print(f"sending colors rgb({red},{green},{blue})")

        array_size = 0

        color_count = len(colors)

        color_array = [color_count]
        for c in colors:
            color_array.append(c[0])
            color_array.append(c[1])
            color_array.append(c[2])

        color_array.append(pattern)

        # color_array = [int(red), int(green), int(blue), int(pattern)]
        array_size += self.link.tx_obj(color_array)

        print(color_array)

        lightstripSerialLock = NamedAtomicLock("lightstripSerialLock")

        if lightstripSerialLock.acquire(timeout=15):
            try:
                self.link.send(array_size)
            finally:
                lightstripSerialLock.release()


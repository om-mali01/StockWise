import barcode
from barcode.writer import ImageWriter
import os

def generate_barcodes(sku):
    folder_paths = "All_Images/Barcode_Img"
    # print(barcode.PROVIDED_BARCODES)
    if not os.path.exists(folder_paths):
        os.makedirs(folder_paths)

    barcode_number = f"B{sku}{len(sku)}"

    barcode_type = barcode.get_barcode_class('code128')
    my_barcode = barcode_type(barcode_number, writer=ImageWriter())

    file_name = f"img_{barcode_number}"
    output_file = os.path.join(folder_paths, file_name)

    my_barcode.save(output_file)

    return {
        "barcode_number": barcode_number,
        "barcode_img": f"Barcode_Img/{file_name}.png"
    }

# print(generate_barcodes("A01"))
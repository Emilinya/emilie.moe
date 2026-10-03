import os
import json
from typing import Any

import geocoder
import numpy as np
from tqdm import tqdm
from GPSPhoto import gpsphoto
from PIL import Image, ExifTags
import pillow_avif


def add_files(path: str, array: list[str]):
    directories = os.listdir(path)
    for directory in directories:
        new_path = f"{path}/{directory}"
        if os.path.isdir(new_path):
            add_files(new_path, array)
        else:
            if os.path.splitext(new_path)[1].upper() != ".MOV":
                array.append(new_path)


def get_files(path: str):
    imgs: list[str] = []
    add_files(path, imgs)
    return imgs


def compress_images(image_paths: list[str], image_folder: str):
    os.makedirs(image_folder, exist_ok=True)

    manual_coordinates = {}
    with open("manual_coordinates.json", "r", encoding="utf8") as datafile:
        manual_coordinates = json.load(datafile)

    image_data = []
    for image_path in tqdm(image_paths):
        # Open image and get image info
        image_name = os.path.basename(image_path).replace(" ", "_")
        data: dict[str, Any] = {}
        image = Image.open(image_path)
        image_exif = image.getexif()

        # Get time, orientation and position from exif
        for key, val in image_exif.items():
            if key in ExifTags.TAGS:
                if ExifTags.TAGS[key] == "DateTime":
                    data[ExifTags.TAGS[key]] = str(val)

        GPSInfo = gpsphoto.getGPSData(image_path)
        if GPSInfo is None:
            raise ValueError(f"Could not get GPS data for '{image_path}'")

        if data_time := data.get("DateTime"):
            if gps_date := GPSInfo.get("Date"):
                month, day, year = gps_date.split("/")
                img_time = GPSInfo.get("UTC-Time", data_time.split(" ")[1])
                correct_DateTime = f"{year}:{month}:{day} {img_time}"
                data["DateTime"] = correct_DateTime

        if data.get("DateTime") is None:
            print(f"WARNING: {image_name} has no Date!")
            continue

        # Ask user to fill in missing gps information
        if not GPSInfo.get("Latitude") or not GPSInfo.get("Longitude"):
            if not manual_coordinates.get(image_name):
                print(f"\nMissing gps data for {image_name}")
                latitude = float(input("Enter latitude:"))
                longitude = float(input("Enter longitude:"))
                manual_coordinates[image_name] = {
                    "Latitude": latitude,
                    "Longitude": longitude,
                }
            data["GPSInfo"] = manual_coordinates[image_name]
        else:
            data["GPSInfo"] = GPSInfo

        # Get country and city from latlong coordinates
        latlong = (data["GPSInfo"]["Latitude"], data["GPSInfo"]["Longitude"])
        g = geocoder.osm(latlong, method="reverse", lang_code="en")
        if not g.ok:
            print("Something went wrong with geodecoding!")
            return
        data["PosInfo"] = g.raw["address"]
        image_data.append(data)

        # Resize image to reduce filesize
        size = image.size
        max_pixels = 720 * 1080

        if size[0] * size[1] > max_pixels:
            new_size = [0, 0]

            ratio = size[0] / size[1]
            new_size[0] = np.sqrt(ratio * max_pixels)
            new_size[1] = int(new_size[0] / ratio)
            new_size[0] = int(new_size[0])

            image = image.resize(new_size)
        data["size"] = {"width": new_size[0], "height": new_size[1]}

        root, _ = os.path.splitext(image_name)
        new_name = f"{image_folder}/compressed_{root}.avif"
        data["name"] = new_name

        # Save image as compressed avif
        image.save(
            new_name,
            speed=4,
            quality=60,
            optimize=True,
            exif=image_exif,
            icc_profile=image.info.get("icc_profile", ""),
        )
    print()

    with open("manual_coordinates.json", "w", encoding="utf8") as datafile:
        datafile.write(json.dumps(manual_coordinates))

    with open(f"{image_folder}/img_data.js", "w", encoding="utf8") as datafile:
        datafile.write("const img_data_array = [\n")
        for data in image_data:
            datafile.write(
                "\t{"
                + ", ".join(
                    f"{key}: '{value}'"
                    for key, value in data.items()
                    if not isinstance(value, dict)
                )
            )
            datafile.write(", size: " + str(data["size"]))
            datafile.write(", GPSInfo: " + str(data["GPSInfo"]))
            datafile.write(", PosInfo: " + str(data["PosInfo"]))
            datafile.write("},\n")
        datafile.write("];")


def main():
    imgs = get_files("many_imgs")
    compress_images(imgs, "../preprocessor/content/media/compressed_imgs")


if __name__ == "__main__":
    main()

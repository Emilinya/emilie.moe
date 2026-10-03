import os
import json
from typing import Any

import geocoder
import requests
import numpy as np
from tqdm import tqdm
from GPSPhoto import gpsphoto
from PIL import Image, ExifTags
import pillow_avif


def remove_quotes(string: str) -> str:
    if string[0] in ('"', "'"):
        return string[1:-1]
    return string


def to_num(string: str) -> float | int:
    try:
        return int(string)
    except ValueError:
        try:
            return float(string)
        except ValueError as exc:
            raise ValueError(f"{string} is not a number!") from exc


def to_js_string(dictionary: dict[str, Any]) -> str:
    string = "{"
    for key, value in dictionary.items():
        value_str = ""
        if isinstance(value, dict):
            value_str = f"{to_js_string(value)}"
        elif isinstance(value, (float, int)):
            value_str = f"{value}"
        else:
            value_str = f'"{remove_quotes(value)}"'
        string += f'"{remove_quotes(key)}": {value_str}, '
    return string[:-2] + "}"


def from_js_string(string: str) -> dict[str, Any]:
    def add_values(iterator, dictionary):
        for key_value in iterator:
            key, *values = key_value.split(": ")

            value = ": ".join(values)
            if key == "" or value == "":
                continue
            key = remove_quotes(key)

            if value[0] in ('"', "'"):
                dictionary[key] = value[1:-1]
            else:
                dictionary[key] = to_num(value)

    def convert_and_count(string: str) -> tuple[dict[str, Any], int]:
        if string[0] != "{":
            raise ValueError(f"malformed js string: '{string}'")

        dictionary: dict[str, str | dict] = {}

        i = 1
        done = False
        start_split = i
        while i < len(string):
            if string[i] == "}":
                done = True
                if i != start_split:
                    add_values(string[start_split:i].split(", "), dictionary)
                break
            if string[i] != "{":
                i += 1
                continue

            partial_string = string[start_split : i - 2]
            key_value_pairs = partial_string.split(", ")
            add_values(key_value_pairs[:-1], dictionary)

            dict_key = key_value_pairs[-1]
            dictionary[remove_quotes(dict_key)], count = convert_and_count(string[i:])
            i += count + 1
            start_split = i

        if done:
            return dictionary, i
        raise ValueError(f"Malformed string: '{string}'")

    return convert_and_count(string)[0]


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
    image_data: list[dict[str, Any]] = []

    # get previously compressed images
    pre_compressed_images: set[str] = set()
    try:
        with open(f"{image_folder}/img_data.js", "r", encoding="utf8") as datafile:
            datafile.readline()
            for line in map(lambda s: s.strip(), datafile.readlines()):
                if len(line) < 3:
                    continue
                data = from_js_string(line[:-1])
                pre_compressed_images.add(data["name"])
                image_data.append(data)
    except FileNotFoundError:
        pass

    with open("manual_coordinates.json", "r", encoding="utf8") as datafile:
        manual_coordinates = json.load(datafile)

    osm_session = requests.session()

    for image_path in tqdm(image_paths):
        # Open image and get image info
        image_name = os.path.basename(image_path).replace(" ", "_")
        root, _ = os.path.splitext(image_name)
        new_name = f"compressed_{root}.avif"
        if new_name in pre_compressed_images:
            continue

        data: dict[str, Any] = {}
        data["name"] = new_name

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
                print(f"\nMissing gps data for {image_path}")
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
        g = geocoder.osm(latlong, session=osm_session, method="reverse", lang_code="en")
        if not g.ok:
            print("Something went wrong with geodecoding!")
            continue
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

        # Save image as compressed avif
        image.save(
            f"{image_folder}/{new_name}",
            speed=4,
            quality=60,
            optimize=True,
            exif=image_exif,
            icc_profile=image.info.get("icc_profile", ""),
        )

    with open("manual_coordinates.json", "w", encoding="utf8") as datafile:
        datafile.write(json.dumps(manual_coordinates))

    with open(f"{image_folder}/img_data.js", "w", encoding="utf8") as datafile:
        datafile.write("const img_data_array = [\n")
        for data in image_data:
            datafile.write(f"\t{to_js_string(data)},\n")
        datafile.write("];")


def main():
    imgs = get_files("many_imgs")
    compress_images(imgs, "../preprocessor/content/media/compressed_imgs")


if __name__ == "__main__":
    main()

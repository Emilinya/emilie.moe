from PIL import Image, ExifTags
from GPSPhoto import gpsphoto
import numpy as np
import geocoder
import json
import time
import os

def add_files(path, array):
	dirs = os.listdir(path)
	for dir in dirs:
		new_path = f"{path}/{dir}"
		if os.path.isdir(new_path):
			add_files(new_path, array)
		else:
			if os.path.splitext(new_path)[1].upper() != ".MOV":
				array.append(new_path)

def get_files(path):
	imgs = []
	add_files(path, imgs)
	return imgs

def compress_images(image_paths, image_folder):
	manual_coordinates = {}
	with open("manual_coordinates.json", "r") as datafile:
		manual_coordinates = json.load(datafile)

	times = []
	image_data = []
	for i, image_path in enumerate(image_paths):
		# Progress bar logic
		time_remaining_str = ""
		if len(times) != 0:
			total_time = sum(times)*len(image_paths)/len(times)
			time_elapsed = sum(times)
			time_remaining_str = f" - {time_elapsed:.1f}/{total_time:.1f} s"
		print(f"\r{i+1}/{len(image_paths)}{time_remaining_str}{' '*8}", end="")
		start_time = time.time()

		# Open image and get image info
		image_name = os.path.basename(image_path).replace(" ", "_")
		data = {"name": f"compressed_{image_name}"}
		image = Image.open(image_path)
		img_exif = image.getexif()

		# Get time, orientation and position from exif
		orientation = 1
		for key, val in img_exif.items():
			if key in ExifTags.TAGS:
				if ExifTags.TAGS[key] == "DateTime":
					data[ExifTags.TAGS[key]] = str(val)
				elif ExifTags.TAGS[key] == "Orientation":
					orientation = val
		GPSInfo = gpsphoto.getGPSData(image_path)
		if data.get("DateTime") is None:
			print(f"{image_name} has no datetime, so it is skipped")
		if GPSInfo.get("Date"):
			month, day, year = GPSInfo["Date"].split("/")
			img_time = GPSInfo.get("UTC-Time", data["DateTime"].split(" ")[1])
			correct_DateTime = f"{year}:{month}:{day} {img_time}"
			data["DateTime"] = correct_DateTime

		# Ask user to fill in missing gps information
		manualGPS = False
		if GPSInfo.get("Latitude") is None or GPSInfo.get("Longitude") is None:
			if manual_coordinates.get(image_name) is None:
				manualGPS = True
				print(f"\nMissing gps data for {image_name}")
				lattitude = float(input("Enter lattitude:"))
				longitude = float(input("Enter longitude:"))
				manual_coordinates[image_name] = {
					"Latitude": lattitude,
					"Longitude": longitude,
				}
			data["GPSInfo"] = manual_coordinates[image_name]
		else:
			data["GPSInfo"] = GPSInfo

		# Get country and city from latlong coordinates
		latlong = (data["GPSInfo"]['Latitude'], data["GPSInfo"]['Longitude'])
		g = geocoder.osm(latlong, method='reverse', lang_code="en")
		if not g.ok:
			print("Something went wrong with geodecoding!")
			return
		data["PosInfo"] = g.raw["address"]
		image_data.append(data)

		# Use orientation to rotate image correctly
		if orientation == 3:
			image = image.rotate(180, expand=True)
		elif orientation == 6:
			image = image.rotate(270, expand=True)
		elif orientation == 8:
			image = image.rotate(90, expand=True)

		# Resize image to reduce filesize
		size = image.size
		max_pixels = 720*1080

		if size[0]*size[1] > max_pixels:
			new_size = [0, 0]

			ratio = size[0]/size[1]
			new_size[0] = np.sqrt(ratio*max_pixels)
			new_size[1] = int(new_size[0]/ratio)
			new_size[0] = int(new_size[0])

			image = image.resize(new_size)
		data["size"] = {"width": new_size[0], "height": new_size[1]}

		# Save image as compressed jpeg
		image.save(f"{image_folder}/compressed_{image_name}", optimize=True, quality=60)

		if not manualGPS:
			elapsed_time = time.time() - start_time
			times.append(elapsed_time)
	print()

	with open("manual_coordinates.json", "w") as datafile:
		datafile.write(json.dumps(manual_coordinates))
	with open(f"{image_folder}/img_data.js", "w") as datafile:
		datafile.write("const img_data_array = [\n")
		for data in image_data:
			datafile.write("\t{"+", ".join(f"{key}: '{value}'" for key, value in data.items() if type(value) is not dict))
			datafile.write(", size: "+str(data['size']))
			datafile.write(", GPSInfo: "+str(data['GPSInfo']))
			datafile.write(", PosInfo: "+str(data['PosInfo']))
			datafile.write("},\n")
		datafile.write("];")

imgs = get_files("many_imgs")
compress_images(imgs, "../preprocessor/content/media/compressed_imgs")

from img_manager import to_js_string, from_js_string


def test_to_from():
    string = "{\"name\": \"compressed_21-08-21_02-38-00_0225.avif\", \"DateTime\": \"2021:08:20 19:38:01\", \"size\": {\"width\": 1018, \"height\": 763}, \"GPSInfo\": {\"Latitude\": 41.87565277777778, \"Longitude\": -87.64945277777778, \"Altitude\": 197.57223113964687}, \"PosInfo\": {\"road\": \"South Peoria Street\", \"neighbourhood\": \"Greektown\", \"city\": \"Chicago\", \"municipality\": \"West Chicago Township\", \"county\": \"Cook County\", \"state\": \"Illinois\", \"ISO3166-2-lvl4\": \"US-IL\", \"postcode\": \"60607\", \"country\": \"United States\", \"country_code\": \"us\"}}"
    dictionary = from_js_string(string)
    new_string = to_js_string(dictionary)
    if string != new_string:
        print("Something is wrong!")
        print(string)
        print(new_string)


if __name__ == "__main__":
    test_to_from()

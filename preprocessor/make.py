import os
import sys
import re
import json

# Get build mode:
build_mode = sys.argv[1]
output_folder = {"dev": "dev_output", "prod": "output"}[build_mode]

# Get config

with open("config.json", "r") as conf_file:
	config = json.load(conf_file)
config = config[build_mode]


# Get template files

template_path = "templates"
template_files = os.listdir(template_path)
template_dict = {re.sub(r"\..*", "", template): template for template in template_files}


# Recursively get content

content_path = "content"
content = []
def get_content(path):
	for file in os.listdir(path):
		new_path = f"{path}/{file}"
		if os.path.isdir(new_path):
			if ".git" not in new_path:
				get_content(new_path)
		else:
			content.append(new_path.replace(f"{content_path}/", ""))
get_content(content_path)

def add(template, file_name, whitespace="", args=None):
	"""
	Function to add content from a template file to the outfile
	"""
	new_line = ""
	with open(f"{template_path}/{template_dict[template]}", "r") as template_file:
		for line in template_file:
			new_line += whitespace + parse_line(line, file_name, whitespace, args)
	return new_line

def add_blog(file_name, name, section, whitespace):
	read = False
	text = ""
	path = "/".join(file_name.split("/")[:-1])
	with open(f"content/{path}/{name}.html") as blogfile:
		while True:
			line = blogfile.readline()
			if not line:
				break

			if f"<{section}" in line:
				read = True
				continue
			if f"</{section}" in line:
				break

			if "<img" in line:
				line = line.replace("<img", "<img width=100%")

			if text != "":
				text += whitespace
			text += line

	return text.strip("\n")

def parse_line(line, file_name, whitespace="", args=None):
	"""
	Function to detect and parse templates in otherwise vanilla html code
	"""
	matches = re.findall(r"(\s*){{(.*?)}}", line)
	for match in matches:
		whitespace += match[0]
		template = match[1]

		# If template is a blog item, add blog
		if re.search(r"^blog", template) is not None:
			name, section = template.split(":")[1].split("-")
			string = add_blog(file_name, name, section, whitespace)
			left, right = line.split("{{"+template+"}}")
			line = left + string + right

		# If template is a if statement, parse it
		elif re.search(r"^if", template) is not None:
			_, statement = template.split(":")
			conditional, string = statement.split("->")
			conditional = eval(config["if"][conditional])
			if not conditional:
				string = ""
			line = re.sub("{{"+template+"}}", string, line)

		# If template is an url template, get correct url
		elif re.search(r"^url", template) is not None:
			path = template.split(":")[1]
			url = config["url"][path]
			if build_mode == "dev":
				url = relative_path(file_name, url)
			line = re.sub("{{"+template+"}}", url, line)

		else:
			template, *argstr = template.split("?")
			args = get_args(argstr)
			line = add(template, file_name, whitespace, args)
	return line

def relative_path(from_url, to_url):
	"""
	Function to get the path from one site to another site
	"""
	from_list = from_url.split("/")
	from_pos = from_list[-1]
	from_list = from_list[:-1]
	to_list = to_url.split("/")
	path = ""
	for dir in from_list[::-1]:
		if dir in to_url:
			to_url = "/".join(to_list[to_list.index(dir)+1:])
			break
		else:
			path += "../"
	path += to_url

	if path == from_pos:
		path = ""
	return path

def get_args(argstr):
	if len(argstr) == 0:
		return None
	argstr = argstr[0]
	arg_dict = {}
	for arg in argstr.split(","):
		key, value = arg.split("=")
		arg_dict[key] = value
	return arg_dict

def main():
	"""
	Main function, in a function so it can be above required functions
	"""
	for file_name in content:
		folders = file_name.split("/")
		for i in range(1, len(folders)):
			folder = "/".join(folders[:i])
			try:
				os.mkdir(f"../{output_folder}/{folder}")
			except FileExistsError:
				pass

		# If the file is a html file, read line for line, else copy bytes
		if ".html" in file_name:
			outfile = open(f"../{output_folder}/{file_name}", "w")
			with open(f"{content_path}/{file_name}", "r") as infile:
				for line in infile:
					outfile.write(parse_line(line, file_name))
			outfile.close()
		else:
			outfile = open(f"../{output_folder}/{file_name}", "wb")
			with open(f"{content_path}/{file_name}", "rb") as infile:
				outfile.write(infile.read())
			outfile.close()

main()

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


def add(template, file_name, whitespace="", args=None):
	"""
	Function to add content from a template file to the outfile
	"""
	new_line = ""
	with open(f"{template_path}/{template_dict[template]}", "r") as template_file:
		for line in template_file:
			new_line += whitespace + parse_line(line, file_name, whitespace, args)
	return new_line

def parse_line(line, file_name, whitespace="", args=None):
	"""
	Function to detect and parse templates in otherwise vanilla html code
	"""
	matches = re.findall(r"(\s*){{(.*?)}}", line)
	for match in matches:
		whitespace += match[0]
		template = match[1]

		# If template is a if statement, parse it
		if re.search(r"^if", template) is not None:
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

main()

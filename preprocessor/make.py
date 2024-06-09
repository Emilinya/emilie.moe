import os
import re
import json
import argparse

# Parse command line arguments
parser = argparse.ArgumentParser()
parser.add_argument("mode", help="build mode", choices=("dev", "prod"))
parser.add_argument(
    "-f", "--fast", help="speed up program by not copying images", action="store_true"
)
parser.add_argument(
    "-d",
    "--directories",
    nargs="+",
    required=False,
    help="the directories you want to copy over. If not set, all directories will be copied.",
)
cmd_args = parser.parse_args()

# Get build mode:
build_mode = str(cmd_args.mode)
output_folder = {"dev": "dev_output", "prod": "output"}[build_mode]

# Get config
with open("config.json", "r", encoding="utf-8") as conf_file:
    config: dict[str, dict[str, str]] = json.load(conf_file)[build_mode]

# Get template files

template_path = "templates"
template_files = os.listdir(template_path)
template_dict = {re.sub(r"\..*", "", template): template for template in template_files}


# Recursively get content
content_path = "content"
content: list[str] = []


def get_content(path: str):
    for file in os.listdir(path):
        new_path = f"{path}/{file}"
        if os.path.isdir(new_path):
            if ".git" not in new_path:
                get_content(new_path)
        else:
            content.append(new_path.replace(f"{content_path}/", ""))


get_content(content_path)


def add(
    template: str, file_name: str, whitespace="", args: dict[str, str] | None = None
):
    """
    Function to add content from a template file to the outfile
    """
    new_line = ""
    with open(
        f"{template_path}/{template_dict[template]}", "r", encoding="utf-8"
    ) as template_file:
        for line in template_file:
            new_line += whitespace + parse_line(line, file_name, whitespace, args)
    return new_line


def add_blog(file_name: str, name: str, section: str, whitespace: str):
    text = ""
    path = "/".join(file_name.split("/")[:-1])
    with open(f"content/{path}/{name}.html", encoding="utf-8") as blogfile:
        while True:
            line = blogfile.readline()
            if not line:
                break

            if f"<{section}" in line:
                continue
            if f"</{section}" in line:
                break

            if "<img" in line:
                line = line.replace("<img", "<img width=100%")

            if text != "":
                text += whitespace
            text += line

    return text.strip("\n")


def parse_line(
    line: str, file_name: str, whitespace="", args: dict[str, str] | None = None
):
    """
    Function to detect and parse templates in otherwise vanilla html code
    """
    matches = re.findall(r"(\s*){{(.*?)}}", line)
    for match in matches:
        whitespace += str(match[0])
        template = str(match[1])

        # If template is a blog item, add blog
        if re.search(r"^blog", template) is not None:
            name, section = template.split(":")[1].split("-")
            string = add_blog(file_name, name, section, whitespace)
            left, right = line.split("{{" + template + "}}")
            line = left + string + right

        # If template is an if statement, parse it
        elif re.search(r"^if", template) is not None:
            _, statement = template.split(":")
            conditional, string = statement.split("->")
            conditional = eval(config["if"][conditional])
            if not conditional:
                string = ""
            line = re.sub("{{" + template + "}}", string, line)

        # If template is an url template, get correct url
        elif re.search(r"^url", template) is not None:
            path = template.split(":")[1]
            url = config["url"][path]
            if build_mode == "dev":
                url = relative_path(file_name, url)
            line = re.sub("{{" + template + "}}", url, line)

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
    for directory in from_list[::-1]:
        if directory in to_url:
            to_url = "/".join(to_list[to_list.index(directory) + 1 :])
            break
        path += "../"
    path += to_url

    if path == from_pos:
        path = ""
    return path


def get_args(args_list: list[str]):
    if len(args_list) == 0:
        return None
    args = args_list[0]
    arg_dict: dict[str, str] = {}
    for arg in args.split(","):
        key, value = arg.split("=")
        arg_dict[key] = value
    return arg_dict


def main():
    base = f"../{output_folder}"
    for file_name in content:
        # see if directory should be copied
        folders = file_name.split("/")
        if cmd_args.directories and folders[0] not in cmd_args.directories:
            continue

        # create necessary folders
        os.makedirs(f"{base}/{'/'.join(folders[:-1])}", exist_ok=True)

        # If the file is a html file, read line for line, else copy bytes
        extension = os.path.splitext(file_name)[1].lower()
        if extension == ".html":
            with open(f"{base}/{file_name}", "w", encoding="utf-8") as outfile:
                with open(
                    f"{content_path}/{file_name}", "r", encoding="utf-8"
                ) as infile:
                    for line in infile:
                        outfile.write(parse_line(line, file_name))
        else:
            # for faster execution, ignore images
            if cmd_args.fast and extension in (".jpg", ".jpeg", ".png", ".webp"):
                continue
            with open(f"{base}/{file_name}", "wb") as outfile:
                with open(f"{content_path}/{file_name}", "rb") as infile:
                    outfile.write(infile.read())


main()

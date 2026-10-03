from make import relative_path

if __name__ == "__main__":
    assert (
        relative_path("media/index.html", "www/media/favicon") == "../www/media/favicon"
    )
    assert (
        relative_path("games/index.html", "www/media/favicon") == "../www/media/favicon"
    )
    assert (
        relative_path("media/index.html", "www/css/main.css") == "../www/css/main.css"
    )
    assert (
        relative_path("www/projects/strippinator.html", "www/projects/index.html")
        == "index.html"
    )
    assert (
        relative_path("www/projects/schrodinger/index.html", "media/index.html")
        == "../../../media/index.html"
    )
    assert (
        relative_path("www/projects/index.html", "www/css/main.css") == "../css/main.css"
    )

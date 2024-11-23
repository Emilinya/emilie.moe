import io
import base64
import PIL.Image as image


def get_top(pix, w, h):
    for y in range(h):
        for x in range(w):
            if pix[x, y][:3] != (255, 255, 255):
                return y


def get_bottom(pix, w, h):
    for y in range(h - 1, 0 - 1, -1):
        for x in range(w):
            if pix[x, y][:3] != (255, 255, 255):
                return y


def get_left(pix, w, h):
    for x in range(w):
        for y in range(h):
            if pix[x, y][:3] != (255, 255, 255):
                return x


def get_right(pix, w, h):
    for x in range(w - 1, 0 - 1, -1):
        for y in range(h):
            if pix[x, y][:3] != (255, 255, 255):
                return x


def get_new_fraction(width, left, right, fraction):
    new_width = width - (left + right)
    if fraction <= 0.5:
        return (width * fraction - left) / new_width
    else:
        return 1 - (width * (1 - fraction) - right) / new_width


def get_padding(width, fraction):
    if fraction <= 0.5:
        return "left", width * (1 - 2 * fraction)
    else:
        return "right", width * (2 * fraction - 1)


def get_new_padding(width, left, right, fraction):
    new_fraction = get_new_fraction(width, left, right, fraction)
    return get_padding(width - (left + right), new_fraction)


def strip_img(img, center=True, center_frac=None):
    w, h = img.size
    pix = img.load()

    topy = get_top(pix, w, h)
    bottomy = get_bottom(pix, w, h) + 1

    if center_frac is not None:
        leftx = get_left(pix, w, h)
        rightx = get_right(pix, w, h) + 1
        if center:
            dir, padding = get_new_padding(w, leftx, w - rightx, center_frac)
            if dir == "left":
                leftx -= int(padding)
            else:
                rightx += int(padding)

        new_img = image.new("RGB", (rightx - leftx, bottomy - topy), (255, 255, 255))
        new_img.paste(img, (-leftx, -topy))
    else:
        new_img = img.crop([0, topy, w, bottomy])

    return new_img


def b64_to_img(b64):
    return image.open(io.BytesIO(base64.b64decode(b64)))


def img_to_b64(img, datatype=None):
    bIO = io.BytesIO()
    if datatype is None:
        datatype = img.format
    img.save(bIO, datatype)
    bIO.seek(0)
    img_bytes = bIO.getvalue()
    return base64.b64encode(img_bytes).decode()


def strip_b64(b64, center=True, center_frac=None, datatype=None):
    return img_to_b64(strip_img(b64_to_img(b64), center, center_frac), datatype)

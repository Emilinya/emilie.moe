import io
import base64
import sympy as sp
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor,
)
import numpy as np
import matplotlib.pyplot as plt


def taylorinator(f, x, a, N):
    Tf_latex = sp.latex(f.subs(x, a))
    Tf = f.subs(x, a)
    for n in range(1, N + 1):
        f = sp.diff(f, x)
        expression = (f.subs(x, a) / sp.factorial(n)) * (x - a) ** n
        Tf += expression

        latex_expression = sp.latex(expression)
        if latex_expression == "0":
            Tf_latex += ""
        elif latex_expression[0] == "-":
            Tf_latex += latex_expression
        else:
            Tf_latex += "+" + latex_expression

    if Tf_latex[0] == "0":
        if len(Tf_latex) == 1:
            return Tf, Tf_latex
        elif Tf_latex[1] == "+":
            Tf_latex = Tf_latex[2:]
        else:
            Tf_latex = Tf_latex[1:]
    return Tf, Tf_latex.replace("log", "ln")


def get_figsize(radius):
    min_size = 8
    max_size = 16

    default_radius = 5
    scale_factor = 30

    return min_size + (max_size - min_size) * max(radius - default_radius, 0) / (
        radius + scale_factor
    )


def plot_taylor(f, Tf, x, a, N, radius):
    x_ray = np.linspace(a - radius, a + radius, 10000)
    f_latex = sp.latex(f)
    f = sp.lambdify(x, f)
    Tf = sp.lambdify(x, Tf)

    plt.figure(figsize=(get_figsize(radius), 6))

    f_ray = f(x_ray)
    if max(f_ray) > 10000:
        plt.yscale("log")

    plt.plot(x_ray, f(x_ray), label=f"${f_latex}$")
    axis = plt.axis()
    plt.plot(
        x_ray, [Tf(x) for x in x_ray], "--", label=f"$T_{{{N}}}({f_latex},\\ {a})$"
    )
    plt.axis(axis)
    plt.legend()

    pic_IObytes = io.BytesIO()
    plt.savefig(pic_IObytes, format="png")
    plt.close()
    pic_IObytes.seek(0)
    pic_hash = base64.b64encode(pic_IObytes.read())
    pic_str = str(pic_hash)[2:-1]
    return pic_str


def taylor(f_str, a, N, radius):
    x = sp.symbols("x")
    transformations = (
        standard_transformations
        + (implicit_multiplication_application,)
        + (convert_xor,)
    )
    try:
        f = parse_expr(f_str, local_dict={"x": x}, transformations=transformations)
        Tf, Tf_latex = taylorinator(f, x, a, N)
        Tf_img_hash = plot_taylor(f, Tf, x, a, N, radius)
        return Tf_latex, Tf_img_hash
    except Exception:
        return False

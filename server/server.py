from flask import Flask, escape, request
import threading
from diff_solver import diff_solver
from lcm import lcm
from taylor import taylor
from strippinator import strip_b64


def timeout(f, t, *args, **kwargs):
	result = None

	def help_f(*args, **kwargs):
		nonlocal result
		result = f(*args, **kwargs)

	thread = threading.Thread(target=help_f, args=args, kwargs=kwargs)
	thread.start()
	thread.join(t)
	return result

app = Flask(__name__)

@app.route('/lcm')
def lcmify():
	try:
		values = request.args.get("values")
		values = [int(value) for value in values.split(",")]
		return f'{escape(timeout(lcm, 1, values))}'
	except Exception as e:
		print(e)
		return f'{escape("Error")}'

@app.route('/diff')
def diffify():
	try:
		init_cons = [int(init) for init in request.args.get("initials").split(",")]
		functions = [int(func) for func in request.args.get("functions").split(",")]
		N = int(request.args.get("N"))
		right_side = int(request.args.get("rightSide"))
		display_type = request.args.get("display")
		return f'{escape(timeout(diff_solver, 2, init_cons, functions, N, right_side, display_type))}'
	except Exception:
		return f'{escape("Error")}'

@app.route('/taylor')
def taylorify():
	try:
		function = request.args.get("function")
		function = function.replace("£", "+")
		point = int(request.args.get("point"))
		order = int(request.args.get("order"))
		radius = int(request.args.get("radius"))

		result = timeout(taylor, 2, function, point, order, radius)
		if result is None:
			return f'{escape("TimeoutError")}'
		elif not result:
			return f'{escape("FuncError")}'
		else:
			return f'{escape(result)}'
	except Exception:
		return f'{escape("Error")}'

@app.route('/strip', methods=["POST"])
def strippinator():
	try:
		dataURI, src = str(request.data).split(",")
		datatype = dataURI.split("/")[1].replace(";base64", "")
		center_frac = request.args.get("center_frac")
		center_frac = None if center_frac == "None" else float(center_frac)
		center = bool(request.args.get("center"))

		result = timeout(strip_b64, 1, src, center, center_frac, datatype)
		if result is None:
			return f'{escape("TimeoutError")}'
		else:
			return f'{escape(f"{dataURI},{str(result)}")}'
	except Exception:
		return f'{escape("Error")}'

@app.after_request
def after_request(response):
	response.headers.add('Access-Control-Allow-Origin', '*')
	response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
	response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
	return response

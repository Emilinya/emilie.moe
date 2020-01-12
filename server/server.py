from flask import Flask, escape, request
import threading
from diff_solver import diff_solver
from lcm import lcm


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
	except Exception:
		return f'{escape("Error")}'

@app.route('/diff')
def diffify():
	try:
		init_cons = [int(init) for init in request.args.get("initials").split(",")]
		functions = [int(func) for func in request.args.get("functions").split(",")]
		N = int(request.args.get("N"))
		right_side = int(request.args.get("rightSide"))
		display_type = request.args.get("display")
		return f'{escape(timeout(diff_solver, 1, init_cons, functions, N, right_side, display_type))}'
	except Exception:
		return f'{escape("Error")}'

@app.after_request
def after_request(response):
	response.headers.add('Access-Control-Allow-Origin', '*')
	response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
	response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
	return response

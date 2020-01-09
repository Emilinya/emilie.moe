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
	values = request.args.get("values")
	values = [int(value) for value in values.split(",")]
	return f'{escape(timeout(lcm, 1, values))}!'

@app.route('/diff')
def diffify():
	values = request.args.get("values")
	values = [int(value) for value in values.split(",")]
	return f'{escape(diff_solver(values))}!'

def diff_solver(init_cons, functions, N, right_side=0, display="full"):
	diff_count = len(init_cons)
	functions_num = [0]*diff_count
	for i in range(len(functions)):
		if not callable(functions[i]):
			functions_num[i] = functions[i]
			functions[i] = lambda n: functions_num[i]
	if not callable(right_side):
		right_side_num = right_side
		right_side = lambda n: right_side_num

	output = []
	if display == "full":
		for n in range(len(init_cons)):
			if n < N+1:
				space_count = len(str(N)) - len(str(n))
				output.append(f"x[{n}]: {' '*space_count}{init_cons[n]}")
	values = init_cons
	for n in range(diff_count, N+1):
		x = right_side(n)
		for i in range(diff_count):
			x += functions[i](n)*values[i]
		for i in range(diff_count-1):
			values[i] = values[i+1]
		values[diff_count-1] = x
		space_count = len(str(N)) - len(str(n))
		if display == "full":
			output.append(f"x[{n}]: {' '*space_count}{x}")
	if display == "result":
		output.append(f"x[{N}]: {values[diff_count-1]}")
	return output

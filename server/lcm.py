def lcm(num_list):
    # Recursively solve for each set of two values
    if len(num_list) == 1:
        return num_list[0]
    a = num_list.pop()
    b = lcm(num_list)

    # Make sure b >= a
    if a > b:
        a = a + b
        b = a - b
        a = a - b

    # Keep start values
    a_start = a
    b_start = b

    # Search for lcm
    while True:
        a += a_start * ((b - a) // a_start)
        if a == b:
            return a
        b += b_start

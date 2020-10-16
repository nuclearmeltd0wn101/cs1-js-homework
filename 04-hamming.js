data = [0, 1, 0, 1]
ctl = []
ctl[0] = (data[0] + data[1] + data[3]) % 2
ctl[1] = (data[1] + data[2] + data[3]) % 2
ctl[2] = (data[0] + data[2] + data[3]) % 2
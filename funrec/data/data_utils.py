import pickle


def read_pkl_data(path):
    with open(path, "rb") as f:
        data_dict = pickle.load(f)
    return data_dict

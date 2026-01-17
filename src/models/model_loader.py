import pickle


def load_model(path):
    with open(path, "rb") as f:
        return pickle.load(f)

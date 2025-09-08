import numpy as np
import logging
from gensim.models import Word2Vec

# Suppress gensim logging output
logging.getLogger("gensim").setLevel(logging.WARNING)


class Item2Vec:
    def __init__(self, model_config):
        self.model_config = model_config

    def build_model(self):
        pass

    def fit(self, train_hist_movie_id_list):
        self.model = Word2Vec(
            train_hist_movie_id_list,
            vector_size=self.model_config["EmbDim"],
            window=self.model_config["Window"],
            min_count=self.model_config["MinCount"],
            workers=self.model_config["Workers"],
        )

    def get_user_embs(self, hist_movie_id_list):
        user_embs = []
        for hist_movie_ids in hist_movie_id_list:
            user_embs.append(
                self.model.wv[hist_movie_ids[np.where(hist_movie_ids != 0)[0]]].mean(
                    axis=0
                )
            )
        return np.array(user_embs)

    def get_item_embs(self, item_id_list):
        item_embs = []
        for item_id in item_id_list:
            try:
                item_embs.append(self.model.wv[item_id])
            except KeyError:
                item_embs.append(np.zeros(self.model_config["EmbDim"]))
        return np.array(item_embs)


def build_item2vec_model(model_config):
    return Item2Vec(model_config)

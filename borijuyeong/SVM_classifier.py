import numpy as np
import hashlib
from matplotlib import pyplot as plt


class Model():
    
    def __init__(
        self, seed_key, learning_rate, reg_rate, n_iter, n_fold, batch_size
    ):
        seed = int(hashlib
                   .sha1(seed_key.encode("utf8"))
                   .hexdigest()[10], 16)
        np.random.seed(seed)
        self.learning_rate = learning_rate
        self.reg_rate = reg_rate
        self.n_iter = n_iter
        self.n_fold = n_fold
        self.batch_size = batch_size

    def fit(self, train_X, train_y):
        self.train_X = train_X
        self.train_y = np.array([train_y]).T
        self.labels = set(train_y)
        self.n_class = len(self.labels)
        self.weights = np.array([self._learn(n) for n in range(self.n_fold)])
        self.weight = self.weights.mean(axis=0)

    def predict(self, test_X):
        return test_X.dot(self.weight.T).argmax(axis=1)

    def _learn(self, n):

        def get_grad8loss(i):
            node11 = w.dot(X[i]).reshape(1, -1)
            node12 = np.array(
                [w[y[i]].dot(X[i])]*self.n_class
            ).reshape(1, -1)
            node2 = node11-node12+1
            loss = np.concatenate(
                [node2, [np.zeros(self.n_class)]]
            ).max(axis=0)
            grad = np.array([X[i]*(loss[i_] > 0)
                            for i_ in range(self.n_class)])
            loss = loss[list(self.labels-{np.asscalar(y[i])})]
            grad[y[i]] = -X[i]*(loss > 0).sum()
            return grad, loss

        X, y, n_fold = self.train_X, self.train_y, self.n_fold
        if n_fold > 1:
            s = len(X)//n_fold*n
            e = len(X)//n_fold*(n+1)
            X = np.concatenate([X[0:s], X[e:]])
            y = np.concatenate([y[0:s], y[e:]])
        
        logger = []
        w = np.random.randn(self.n_class, len(X[0]))
        for i in range(self.n_iter):
            idxs = np.random.choice(len(X), self.batch_size, replace=False)
            grad8loss_list = [get_grad8loss(i) for i in idxs]
            grads = np.array([t[0] for t in grad8loss_list])
            losses = np.array([t[1] for t in grad8loss_list])
            grad = grads.mean(axis=0)+self.reg_rate*np.abs(w)/w
            w -= self.learning_rate*grad
            loss = losses.mean(axis=0).sum()+self.reg_rate*np.abs(w).sum()
            logger.append(loss)
            if not i%(self.n_iter//4):
                print(str(n)+"fold "+str(i)+"iter | loss: "+str(loss))
        
        plt.plot(logger)
        plt.show()
        return w
